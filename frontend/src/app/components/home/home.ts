import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page-container page-container">
      <!-- Unified Command Header (No Back Button, No Bell Icon) -->
      <header class="command-header">
        <div class="command-header-left">
          <div class="command-header-title">
            <h2>AROGYA-DI</h2>
            <span>Health Decision Support System</span>
          </div>
        </div>
        <div class="command-header-right">
          <span class="command-header-icon" title="Platform Information">ℹ️</span>
        </div>
      </header>

      <div class="scroll-viewport">
        <!-- Hero Section -->
        <div class="hero-card card">
          <div class="hero-image-wrapper">
            <img src="/health-command-center.jpg" alt="Health Command Center Dashboard Illustration" class="hero-image" />
          </div>
          <div class="hero-content">
            <h1>Welcome to Arogya-DI Command Center</h1>
            <p>Arogya-DI is an AI-powered Decision Intelligence Platform designed for public health officials and stakeholders in India. By integrating multi-lingual LLM analytics, geospatial monitoring, and computer vision diagnostics, the platform assists in tracking vector risks and modeling ward capacity.</p>
          </div>
        </div>

        <!-- User Guide and Modules Directory -->
        <h2 class="section-title">Diagnostic Workspaces & Navigation Guide</h2>
        <div class="guide-grid">
          
          <div class="guide-card card" routerLink="/chat">
            <div class="card-icon">💬</div>
            <h3>Chat Command Center</h3>
            <p>Query health datasets in natural English, Hindi (हिंदी), or Kannada (ಕನ್ನಡ). Instantly generates interactive charts and tables from natural queries.</p>
            <span class="arrow-link">Enter Workspace →</span>
          </div>

          <div class="guide-card card" routerLink="/photo">
            <div class="card-icon">📷</div>
            <h3>Breeding Site Detector</h3>
            <p>Upload photograph records of surface water and drains. Computer vision scans for larvicidal risks and suggests vector control check-lists.</p>
            <span class="arrow-link">Enter Workspace →</span>
          </div>

          <div class="guide-card card" routerLink="/map">
            <div class="card-icon">🗺️</div>
            <h3>AQI Geo-Monitoring Map</h3>
            <p>Inspect city monitoring stations mapped on a live OpenStreetMap dashboard. Stations are color-coded dynamically based on AQI levels.</p>
            <span class="arrow-link">Enter Workspace →</span>
          </div>

          <div class="guide-card card" routerLink="/voice">
            <div class="card-icon">🎙️</div>
            <h3>Citizen Transcriber</h3>
            <p>Upload citizen audio hotline records or call logs. Speech recognition transcribes audio into text reports with a waveform visualization.</p>
            <span class="arrow-link">Enter Workspace →</span>
          </div>

          <div class="guide-card card" routerLink="/what-if">
            <div class="card-icon">📊</div>
            <h3>What-If Resource Simulator</h3>
            <p>Model the reduction curves of outbreaks. Adjust screening times and extra bed allocations to project disease transmission comparisons.</p>
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

    .hero-card {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 2rem;
      padding: 1.5rem;
      align-items: center;
      margin-bottom: 2rem;
      overflow: hidden;
      border: 1px solid var(--border);
    }

    .hero-image-wrapper {
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      height: 250px;
    }

    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-content h1 {
      font-size: 1.8rem;
      color: var(--primary);
      margin-bottom: 0.75rem;
    }

    .hero-content p {
      font-size: 0.95rem;
      color: var(--text-main);
      line-height: 1.6;
    }

    .section-title {
      font-size: 1.25rem;
      color: var(--primary);
      margin-bottom: 1rem;
      font-weight: 700;
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
      gap: 0.50rem;
      transition: var(--transition);
      border: 1px solid var(--border);
      height: 100%;
      justify-content: space-between;
    }

    .guide-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary);
      box-shadow: var(--shadow-md);
      background: white;
    }

    .card-icon {
      font-size: 2rem;
      width: 48px;
      height: 48px;
      background: var(--primary-light);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }

    .guide-card h3 {
      font-size: 1rem;
      color: var(--primary);
      margin: 0;
    }

    .guide-card p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
      flex: 1;
    }

    .arrow-link {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary);
      margin-top: 0.5rem;
    }

    @media (max-width: 900px) {
      .hero-card {
        grid-template-columns: 1fr;
      }
      .hero-image-wrapper {
        height: 180px;
      }
    }
  `]
})
export class HomeComponent {}
