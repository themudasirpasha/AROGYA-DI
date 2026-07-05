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
        <div class="logo-icon">➕</div>
        <div class="brand-info">
          <h2>AROGYA-DI</h2>
          <span>Health Command Center</span>
        </div>
      </div>
      
      <nav class="nav-links">
        <a routerLink="/home" routerLinkActive="active" class="nav-item">
          <span class="icon">🏠</span>
          <span class="label">Home Dashboard</span>
        </a>
        <a routerLink="/chat" routerLinkActive="active" class="nav-item">
          <span class="icon">💬</span>
          <span class="label">Chat Center</span>
        </a>
        <a routerLink="/photo" routerLinkActive="active" class="nav-item">
          <span class="icon">📷</span>
          <span class="label">Breeding Site Detector</span>
        </a>
        <a routerLink="/map" routerLinkActive="active" class="nav-item">
          <span class="icon">🗺️</span>
          <span class="label">AQI Geo Map</span>
        </a>
        <a routerLink="/voice" routerLinkActive="active" class="nav-item">
          <span class="icon">🎙️</span>
          <span class="label">Citizen Audio Transcriber</span>
        </a>
        <a routerLink="/what-if" routerLinkActive="active" class="nav-item">
          <span class="icon">📊</span>
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
      background-color: var(--primary);
      color: white;
      display: flex;
      flex-direction: column;
      height: 100vh;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    .brand {
      padding: 2rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .logo-icon {
      font-size: 1.5rem;
      background: var(--accent);
      width: 42px;
      height: 42px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
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

    .icon {
      font-size: 1.25rem;
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
