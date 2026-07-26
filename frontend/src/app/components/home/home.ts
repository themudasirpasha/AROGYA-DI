import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page-container page-container">
      <!-- Unified Command Header -->
      <header class="command-header">
        <div class="command-header-left">
          <div class="header-logo-icon">
            <svg class="header-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          </div>
          <div class="command-header-title">
            <h2>AROGYA-DI</h2>
            <span>Health Decision Support System</span>
          </div>
        </div>
        <div class="command-header-right">
          <span class="badge live-badge">● LIVE COMMAND CONTROL</span>
        </div>
      </header>

      <div class="scroll-viewport">
        <!-- Hero Section -->
        <div class="hero-card card">
          <div class="hero-image-wrapper">
            <img src="/health-command-center.jpg" alt="Health Command Center Dashboard" class="hero-image" />
            <div class="hero-gradient-overlay"></div>
          </div>
          <div class="hero-content">
            <h1>Welcome to Arogya-DI Command Center</h1>
            <p>
              An AI-powered Decision Intelligence Platform designed for public health officials and stakeholders in India. 
              By integrating multi-lingual LLM analytics, geospatial monitoring, and computer vision diagnostics, 
              Arogya-DI assists in tracking vector risks, modeling capacity, and monitoring live air quality metrics.
            </p>
          </div>
        </div>

        <!-- Metric Cards Overlay Grid -->
        <div class="metrics-grid">
          <div class="metric-item card">
            <span class="metric-icon">📍</span>
            <div class="metric-info">
              <h4>Monitoring Districts</h4>
              <p class="metric-val">12 Districts</p>
            </div>
          </div>
          <div class="metric-item card">
            <span class="metric-icon">📡</span>
            <div class="metric-info">
              <h4>AQI Telemetry Status</h4>
              <p class="metric-val text-success">Active (24 Stations)</p>
            </div>
          </div>
          <div class="metric-item card">
            <span class="metric-icon">🚨</span>
            <div class="metric-info">
              <h4>Vector Breeding Incidents</h4>
              <p class="metric-val text-warning">8 Sites Flagged</p>
            </div>
          </div>
          <div class="metric-item card">
            <span class="metric-icon">🩺</span>
            <div class="metric-info">
              <h4>Doctor Availability</h4>
              <p class="metric-val">98% Coverage</p>
            </div>
          </div>
        </div>

        <!-- Navigation Guide Section -->
        <h2 class="section-title">Diagnostic Workspaces & Navigation Guide</h2>
        <div class="guide-grid">
          
          <div class="guide-card card" routerLink="/chat">
            <div class="card-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3>Chat Command Center</h3>
            <p>Query health datasets in natural English, Hindi (हिंदी), or Kannada (ಕನ್ನಡ). Instantly generates interactive charts and tables.</p>
            <span class="arrow-link">Enter Workspace →</span>
          </div>

          <div class="guide-card card" routerLink="/doctor-chat">
            <div class="card-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3>Doctor Consultation</h3>
            <p>Locate healthcare specialists, view clinic hours, and check doctor availability across districts and taluks in Karnataka.</p>
            <span class="arrow-link">Enter Workspace →</span>
          </div>

          <div class="guide-card card" routerLink="/photo">
            <div class="card-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
            <h3>Breeding Site Detector</h3>
            <p>Upload photograph records of standing water and drains. Computer vision scans for larvicidal risks and suggests checklists.</p>
            <span class="arrow-link">Enter Workspace →</span>
          </div>

          <div class="guide-card card" routerLink="/map">
            <div class="card-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3>AQI Geo-Monitoring Map</h3>
            <p>Inspect city monitoring stations mapped on a live OpenStreetMap dashboard. Stations are color-coded based on hazard level.</p>
            <span class="arrow-link">Enter Workspace →</span>
          </div>

          <div class="guide-card card" routerLink="/voice">
            <div class="card-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>
            <h3>Citizen Transcriber</h3>
            <p>Upload citizen audio hotline records or call logs. Speech recognition transcribes audio into text reports with a waveform.</p>
            <span class="arrow-link">Enter Workspace →</span>
          </div>

          <div class="guide-card card" routerLink="/what-if">
            <div class="card-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3>What-If Resource Simulator</h3>
            <p>Model the reduction curves of outbreaks. Adjust screening times and extra bed allocations to project transmission comparisons.</p>
            <span class="arrow-link">Enter Workspace →</span>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-page-container {
      background: var(--bg-app);
    }

    .live-badge {
      background: var(--primary-light);
      color: var(--primary);
      font-size: 0.75rem;
      letter-spacing: 1px;
      font-weight: 700;
    }

    .hero-card {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 2.5rem;
      padding: 1.75rem;
      align-items: center;
      margin-bottom: 2rem;
      overflow: hidden;
      border: 1px solid var(--border);
      position: relative;
    }

    .hero-image-wrapper {
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      height: 280px;
      position: relative;
    }

    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .hero-card:hover .hero-image {
      transform: scale(1.03);
    }

    .hero-gradient-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(7, 72, 64, 0) 60%, rgba(7, 72, 64, 0.15) 100%);
    }

    .hero-content h1 {
      font-size: 1.9rem;
      color: var(--primary);
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .hero-content p {
      font-size: 0.95rem;
      color: var(--text-main);
      line-height: 1.65;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .metric-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: white;
      border: 1px solid var(--border);
      padding: 1rem 1.25rem;
      transition: var(--transition);
    }

    .metric-item:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
    }

    .metric-icon {
      font-size: 1.8rem;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .metric-info h4 {
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--text-muted);
      margin: 0;
    }

    .metric-val {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary);
      margin: 0.15rem 0 0 0;
    }

    .text-success {
      color: var(--accent) !important;
    }

    .text-warning {
      color: var(--warning) !important;
    }

    .section-title {
      font-size: 1.3rem;
      color: var(--primary);
      margin-bottom: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.2px;
    }

    .guide-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .guide-card {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: var(--transition);
      border: 1px solid var(--border);
      height: 100%;
      justify-content: space-between;
      background: white;
    }

    .guide-card:hover {
      transform: translateY(-4px);
      border-color: var(--accent);
      box-shadow: var(--shadow-md);
    }

    .card-icon-wrapper {
      width: 48px;
      height: 48px;
      background: var(--primary-light);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      transition: var(--transition);
    }

    .card-icon-wrapper svg {
      width: 24px;
      height: 24px;
      stroke: var(--primary);
    }

    .guide-card:hover .card-icon-wrapper {
      background: var(--accent);
      color: white;
    }

    .guide-card:hover .card-icon-wrapper svg {
      stroke: white;
    }

    .guide-card h3 {
      font-size: 1.05rem;
      color: var(--primary);
      margin: 0;
    }

    .guide-card p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.55;
      flex: 1;
    }

    .arrow-link {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary);
      margin-top: 0.5rem;
      transition: var(--transition);
    }

    .guide-card:hover .arrow-link {
      color: var(--accent);
      transform: translateX(3px);
    }

    @media (max-width: 900px) {
      .hero-card {
        grid-template-columns: 1fr;
      }
      .hero-image-wrapper {
        height: 200px;
      }
    }
  `]
})
export class HomeComponent {}
