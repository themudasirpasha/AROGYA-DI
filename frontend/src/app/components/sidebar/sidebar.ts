import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <div class="logo-icon">
          <svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </div>
        <div class="brand-info">
          <h2>AROGYA-DI</h2>
          <span>Health Command Center</span>
        </div>
      </div>
      
      <nav class="nav-links">
        <a routerLink="/home" routerLinkActive="active" class="nav-item">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="label">Home Dashboard</span>
        </a>
        <a routerLink="/chat" routerLinkActive="active" class="nav-item">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="label">Chat Center</span>
        </a>
        <a routerLink="/doctor-chat" routerLinkActive="active" class="nav-item">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          <span class="label">Doctor Consultation</span>
        </a>
        <a routerLink="/photo" routerLinkActive="active" class="nav-item">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          <span class="label">Breeding Site Detector</span>
        </a>
        <a routerLink="/map" routerLinkActive="active" class="nav-item">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span class="label">AQI Geo Map</span>
        </a>
        <a routerLink="/voice" routerLinkActive="active" class="nav-item">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
          <span class="label">Citizen Audio Transcriber</span>
        </a>
        <a routerLink="/what-if" routerLinkActive="active" class="nav-item">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <span class="label">What-If Simulator</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <span class="lang-pill">EN / HI / KN</span>
        <p>Arogya-DI v1.0</p>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-w);
      background: linear-gradient(180deg, var(--primary) 0%, #021a17 100%);
      color: white;
      display: flex;
      flex-direction: column;
      height: 100vh;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      flex-shrink: 0;
      box-shadow: 4px 0 25px rgba(0, 0, 0, 0.15);
    }

    .brand {
      padding: 2rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.1);
    }

    .logo-icon {
      background: var(--accent);
      width: 42px;
      height: 42px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-svg {
      width: 20px;
      height: 20px;
      stroke: white;
    }

    .brand-info h2 {
      color: white;
      font-size: 1.2rem;
      margin: 0;
      letter-spacing: 0.5px;
    }

    .brand-info span {
      font-size: 0.75rem;
      color: var(--accent-light);
      opacity: 0.8;
    }

    .nav-links {
      flex: 1;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      color: rgba(255, 255, 255, 0.75);
      border-radius: var(--radius-sm);
      font-weight: 500;
      transition: var(--transition);
    }

    .nav-item:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.05);
    }

    .nav-item.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
      border-left: 4px solid var(--accent);
      padding-left: calc(1rem - 4px);
    }

    .icon-svg {
      width: 20px;
      height: 20px;
      stroke: rgba(255, 255, 255, 0.6);
      transition: var(--transition);
    }

    .nav-item:hover .icon-svg {
      stroke: rgba(255, 255, 255, 0.95);
    }

    .nav-item.active .icon-svg {
      stroke: var(--accent);
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      text-align: center;
    }

    .lang-pill {
      display: inline-block;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: bold;
      color: var(--accent-light);
      margin-bottom: 0.5rem;
    }

    .sidebar-footer p {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.4);
    }
  `]
})
export class SidebarComponent {}
