import { Component, inject, OnInit, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArogyaService } from '../../services/arogya.service';
import * as L from 'leaflet';

interface CityAQI {
  name: string;
  aqi: number;
  lat: number;
  lng: number;
  status: 'good' | 'moderate' | 'hazardous';
  color: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="map-page-container page-container">
      <!-- Unified Command Header matching Mockup -->
      <header class="command-header">
        <div class="command-header-left">
          <span class="back-arrow" routerLink="/home">←</span>
          <div class="command-header-title">
            <h2>AROGYA-DI</h2>
            <span>AQI Geo-Monitoring Map</span>
          </div>
        </div>
        <div class="command-header-right">
          <span class="command-header-icon" title="Geo Location">🧭</span>
        </div>
      </header>

      <div class="scroll-viewport">

      <div class="map-layout">
        <!-- Sidebar stats -->
        <div class="sidebar-stats">
          <div class="card status-overview">
            <h3>Overview</h3>
            <div class="stat-grid">
              <div class="stat-box good">
                <span class="stat-count">{{ countGood() }}</span>
                <span class="stat-label">Good</span>
              </div>
              <div class="stat-box moderate">
                <span class="stat-count">{{ countModerate() }}</span>
                <span class="stat-label">Moderate</span>
              </div>
              <div class="stat-box hazardous">
                <span class="stat-count">{{ countHazardous() }}</span>
                <span class="stat-label">Hazardous</span>
              </div>
            </div>
          </div>

          <div class="card city-list-card">
            <h3>Monitoring Stations</h3>
            <div class="city-items">
              @if (isLoading()) {
                <div class="sidebar-loading">
                  <div class="dots-loader"><span></span><span></span><span></span></div>
                  <p>Fetching geolocation coordinates...</p>
                </div>
              } @else {
                @for (city of cities(); track city.name) {
                  <div class="city-item" [style.border-left-color]="city.color" (click)="focusCity(city)" (mouseenter)="selectedCity.set(city)">
                    <div class="city-info">
                      <span class="city-name">{{ city.name }}</span>
                      <span class="city-coords">{{ city.lat }}°N, {{ city.lng }}°E</span>
                    </div>
                    <span class="city-aqi" [style.background-color]="city.color + '22'" [style.color]="city.color">
                      {{ city.aqi }}
                    </span>
                  </div>
                }
              }
            </div>
          </div>
        </div>

        <!-- Map Visualization -->
        <div class="card map-canvas-card">
          @if (isLoading()) {
            <div class="map-loading-overlay">
              <div class="compass-loader">🧭</div>
              <h3>Generating Geospatial Plot</h3>
              <p>Polling coordinates & index levels from health command center database...</p>
            </div>
          }

          <div class="map-wrapper">
            <!-- Leaflet Map Container -->
            <div id="leaflet-map" style="height: 520px; width: 100%; border-radius: var(--radius-md);"></div>

            <!-- Map legend overlay -->
            <div class="map-legend">
              <div class="legend-item"><span class="legend-color good"></span> Good (<=100)</div>
              <div class="legend-item"><span class="legend-color moderate"></span> Moderate (101-200)</div>
              <div class="legend-item"><span class="legend-color hazardous"></span> Hazardous (>200)</div>
            </div>

            <!-- Details Tooltip Card -->
            @if (selectedCity()) {
              <div class="map-tooltip shadow-lg">
                <div class="tooltip-header" [style.background-color]="selectedCity()?.color">
                  <h4>{{ selectedCity()?.name }}</h4>
                  <button class="close-btn" (click)="selectedCity.set(null)">×</button>
                </div>
                <div class="tooltip-body">
                  <div class="tooltip-row">
                    <span class="lbl">AQI Index:</span>
                    <span class="val font-bold" [style.color]="selectedCity()?.color">{{ selectedCity()?.aqi }}</span>
                  </div>
                  <div class="tooltip-row">
                    <span class="lbl">Status:</span>
                    <span class="val badge font-bold" [ngClass]="'badge-' + selectedCity()?.status">
                      {{ selectedCity()?.status | uppercase }}
                    </span>
                  </div>
                  <div class="tooltip-row">
                    <span class="lbl">Coordinates:</span>
                    <span class="val">{{ selectedCity()?.lat }}° N, {{ selectedCity()?.lng }}° E</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`
    .map-page-container {
      background: var(--bg-app);
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .subtitle {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .map-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 2rem;
      flex: 1;
      align-items: start;
    }

    .sidebar-stats {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .status-overview h3 {
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      text-align: center;
    }

    .stat-box {
      display: flex;
      flex-direction: column;
      padding: 0.5rem 0.25rem;
      border-radius: var(--radius-sm);
    }

    .stat-box.good { background-color: var(--accent-light); color: var(--accent-dark); }
    .stat-box.moderate { background-color: var(--warning-light); color: #92400e; }
    .stat-box.hazardous { background-color: var(--critical-light); color: #991b1b; }

    .stat-count {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .stat-label {
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .city-list-card {
      max-height: 380px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .city-list-card h3 {
      font-size: 1rem;
    }

    .city-items {
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-right: 0.25rem;
    }

    .sidebar-loading {
      text-align: center;
      padding: 2rem 0;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    .city-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: #fafafa;
      border: 1px solid var(--border);
      border-left: 4px solid var(--primary);
      border-radius: 6px;
      cursor: pointer;
      transition: var(--transition);
    }

    .city-item:hover {
      background: white;
      box-shadow: var(--shadow-sm);
      transform: translateX(4px);
    }

    .city-info {
      display: flex;
      flex-direction: column;
    }

    .city-name {
      font-size: 0.85rem;
      font-weight: 600;
    }

    .city-coords {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .city-aqi {
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .map-canvas-card {
      min-height: 520px;
      position: relative;
      background: white;
      padding: 0.75rem;
    }

    .map-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      z-index: 1010;
      text-align: center;
    }

    .compass-loader {
      font-size: 3rem;
      animation: spin 3s infinite linear;
    }

    .map-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .map-legend {
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: white;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.75rem;
      box-shadow: var(--shadow-sm);
      z-index: 1000;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .legend-color.good { background-color: var(--accent); }
    .legend-color.moderate { background-color: var(--warning); }
    .legend-color.hazardous { background-color: var(--critical); }

    .map-tooltip {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 220px;
      background: white;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--border);
      animation: slideIn 0.2s ease-out;
      z-index: 1000;
    }

    .tooltip-header {
      padding: 0.5rem 1rem;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tooltip-header h4 {
      color: white;
      font-size: 0.9rem;
      margin: 0;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
    }

    .tooltip-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.8rem;
    }

    .tooltip-row {
      display: flex;
      justify-content: space-between;
    }

    .lbl {
      color: var(--text-muted);
    }

    .val {
      font-weight: 600;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 768px) {
      .map-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MapComponent implements OnInit {
  private service = inject(ArogyaService);

  isLoading = signal(true);
  cities = signal<CityAQI[]>([]);
  selectedCity = signal<CityAQI | null>(null);

  countGood = signal(0);
  countModerate = signal(0);
  countHazardous = signal(0);

  private map: L.Map | undefined;
  private markers: L.CircleMarker[] = [];

  constructor() {
    // Run Leaflet code safely on client side
    afterNextRender(() => {
      this.initMap();
    });
  }

  ngOnInit() {
    this.fetchMapData();
  }

  private initMap() {
    this.map = L.map('leaflet-map', {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.renderMarkers();
  }

  fetchMapData() {
    this.isLoading.set(true);
    this.service.sendChatMessage("Show me air quality with location coordinates").subscribe({
      next: (res) => {
        const parsed = this.parseAQIData(res.answer);
        if (parsed.length > 0) {
          this.cities.set(parsed);
          this.updateCounts(parsed);
          const delhi = parsed.find(c => c.name.toLowerCase() === 'delhi') || parsed[0];
          this.selectedCity.set(delhi);
        } else {
          this.loadFallbackData();
        }
        this.isLoading.set(false);
        this.renderMarkers();
      },
      error: (err) => {
        console.error('Failed to get map data:', err);
        this.loadFallbackData();
        this.isLoading.set(false);
        this.renderMarkers();
      }
    });
  }

  private renderMarkers() {
    if (!this.map || this.cities().length === 0) return;

    // Clear existing markers
    this.markers.forEach(m => this.map?.removeLayer(m));
    this.markers = [];

    const bounds: L.LatLngTuple[] = [];

    this.cities().forEach(city => {
      const marker = L.circleMarker([city.lat, city.lng], {
        radius: 10,
        fillColor: city.color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      });

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; color: #0a4f46; font-weight: 700;">${city.name}</h4>
          <p style="margin: 0 0 2px 0; font-size: 12px; color: #1f2937;">AQI Index: <strong>${city.aqi}</strong></p>
          <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; color: white; background-color: ${city.color};">
            ${city.status}
          </span>
        </div>
      `);

      marker.on('click', () => {
        this.selectedCity.set(city);
      });

      marker.addTo(this.map!);
      this.markers.push(marker);
      bounds.push([city.lat, city.lng]);
    });

    if (bounds.length > 0) {
      this.map.fitBounds(bounds, { padding: [40, 40] });
    }
  }

  focusCity(city: CityAQI) {
    this.selectedCity.set(city);
    if (this.map) {
      this.map.setView([city.lat, city.lng], 7, { animate: true });
    }
  }

  parseAQIData(text: string): CityAQI[] {
    const lines = text.split('\n');
    const tableLines = lines.filter(l => l.trim().startsWith('|') && l.trim().endsWith('|'));
    
    if (tableLines.length < 3) return [];

    const headers = tableLines[0]
      .split('|')
      .map(h => h.trim().toLowerCase())
      .filter(h => h !== '');

    const cityIdx = headers.findIndex(h => h.includes('city'));
    const aqiIdx = headers.findIndex(h => h.includes('aqi'));
    const latIdx = headers.findIndex(h => h.includes('lat'));
    const lngIdx = headers.findIndex(h => h.includes('lon') || h.includes('lng'));

    if (cityIdx === -1 || aqiIdx === -1 || latIdx === -1 || lngIdx === -1) {
      return [];
    }

    const result: CityAQI[] = [];

    for (let i = 2; i < tableLines.length; i++) {
      const cells = tableLines[i]
        .split('|')
        .map(c => c.trim())
        .filter(c => c !== '');
      
      if (cells.length >= headers.length) {
        const name = cells[cityIdx];
        const aqi = parseInt(cells[aqiIdx], 10);
        const lat = parseFloat(cells[latIdx]);
        const lng = parseFloat(cells[lngIdx]);

        if (name && !isNaN(aqi) && !isNaN(lat) && !isNaN(lng)) {
          let status: 'good' | 'moderate' | 'hazardous' = 'good';
          let color = '#10b981'; // green

          if (aqi > 200) {
            status = 'hazardous';
            color = '#ef4444'; // red
          } else if (aqi > 100) {
            status = 'moderate';
            color = '#f59e0b'; // yellow
          }

          result.push({ name, aqi, lat, lng, status, color });
        }
      }
    }

    return result;
  }

  updateCounts(list: CityAQI[]) {
    let good = 0;
    let moderate = 0;
    let haz = 0;
    list.forEach(c => {
      if (c.status === 'good') good++;
      else if (c.status === 'moderate') moderate++;
      else if (c.status === 'hazardous') haz++;
    });
    this.countGood.set(good);
    this.countModerate.set(moderate);
    this.countHazardous.set(haz);
  }

  loadFallbackData() {
    const fallback: CityAQI[] = [
      { name: 'Delhi', aqi: 245, lat: 28.61, lng: 77.20, status: 'hazardous', color: '#ef4444' },
      { name: 'Mumbai', aqi: 88, lat: 19.07, lng: 72.87, status: 'good', color: '#10b981' },
      { name: 'Bengaluru', aqi: 62, lat: 12.97, lng: 77.59, status: 'good', color: '#10b981' },
      { name: 'Chennai', aqi: 95, lat: 13.08, lng: 80.27, status: 'good', color: '#10b981' },
      { name: 'Kolkata', aqi: 154, lat: 22.57, lng: 88.36, status: 'moderate', color: '#f59e0b' },
      { name: 'Ahmedabad', aqi: 210, lat: 23.02, lng: 72.57, status: 'hazardous', color: '#ef4444' },
      { name: 'Hyderabad', aqi: 110, lat: 17.38, lng: 78.48, status: 'moderate', color: '#f59e0b' },
    ];
    this.cities.set(fallback);
    this.updateCounts(fallback);
    this.selectedCity.set(fallback[0]);
  }
}
