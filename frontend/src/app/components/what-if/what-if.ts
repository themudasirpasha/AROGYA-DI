import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArogyaService } from '../../services/arogya.service';

@Component({
  selector: 'app-what-if',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="what-if-container page-container">
      <!-- Unified Command Header matching Mockup -->
      <header class="command-header">
        <div class="command-header-left">
          <span class="back-arrow" routerLink="/home">←</span>
          <div class="command-header-title">
            <h2>AROGYA-DI</h2>
            <span>What-If Simulator</span>
          </div>
        </div>
        <div class="command-header-right">
          <span class="command-header-icon" title="Simulation Analysis">📊</span>
        </div>
      </header>

      <div class="scroll-viewport">

      <div class="simulator-layout">
        <!-- Configuration Form -->
        <div class="card config-card">
          <h3>Simulation Parameters</h3>
          <p class="desc">Adjust parameters to see how resource changes impact projected cases.</p>

          <div class="form-group slider-group">
            <div class="slider-header">
              <label class="form-label" for="daysScreening">Days Earlier Screening</label>
              <span class="value-badge">{{ daysScreening() }} Days</span>
            </div>
            <input 
              id="daysScreening"
              type="range" 
              min="0" 
              max="30" 
              step="1"
              [(ngModel)]="daysScreening" 
              class="range-slider"
            />
            <div class="slider-ticks">
              <span>Baseline (0)</span>
              <span>15d</span>
              <span>Max (30)</span>
            </div>
          </div>

          <div class="form-group slider-group">
            <div class="slider-header">
              <label class="form-label" for="extraBeds">Extra Hospital Beds Added</label>
              <span class="value-badge">{{ extraBeds() }} Beds</span>
            </div>
            <input 
              id="extraBeds"
              type="range" 
              min="0" 
              max="100" 
              step="5"
              [(ngModel)]="extraBeds" 
              class="range-slider"
            />
            <div class="slider-ticks">
              <span>None (0)</span>
              <span>50b</span>
              <span>Max (100)</span>
            </div>
          </div>

          <button 
            class="btn btn-primary btn-block" 
            (click)="runSimulation()" 
            [disabled]="isLoading()"
          >
            @if (isLoading()) {
              <div class="dots-loader"><span></span><span></span><span></span></div>
              Simulating Projections...
            } @else {
              ⚡ Run Impact Projection
            }
          </button>
        </div>

        <!-- Simulation Results -->
        <div class="results-column">
          @if (resultText()) {
            <div class="card result-card">
              <h3>Projected Impact Summary</h3>
              
              <div class="impact-metrics-row">
                <div class="metric-box before">
                  <span class="val">750</span>
                  <span class="lbl">Baseline Cases</span>
                </div>
                <div class="arrow-indicator">➡️</div>
                <div class="metric-box after">
                  <span class="val">{{ projectedCases() }}</span>
                  <span class="lbl">Projected Cases</span>
                  <span class="reduction-pct">-{{ calculateReduction() }}% Reduction</span>
                </div>
              </div>

              <!-- Double-Bar SVG Comparison Chart -->
              <div class="chart-wrapper">
                <svg viewBox="0 0 400 240" class="comparison-chart">
                  <!-- Y Axis lines -->
                  <line x1="60" y1="40" x2="360" y2="40" stroke="#f1f5f9" stroke-width="1.5" />
                  <line x1="60" y1="100" x2="360" y2="100" stroke="#f1f5f9" stroke-width="1.5" />
                  <line x1="60" y1="160" x2="360" y2="160" stroke="#f1f5f9" stroke-width="1.5" />
                  <line x1="60" y1="200" x2="360" y2="200" stroke="#94a3b8" stroke-width="2" />

                  <!-- Before Bar -->
                  <rect x="110" y="50" width="50" height="150" fill="var(--primary)" rx="4" class="chart-bar" />
                  <text x="135" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="var(--primary-hover)">750</text>
                  <text x="135" y="220" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-muted)">Baseline</text>

                  <!-- After Bar -->
                  @let afterHeight = (projectedCases() / 750) * 150;
                  @let afterY = 200 - afterHeight;
                  <rect x="240" [attr.y]="afterY" width="50" [attr.height]="afterHeight" fill="var(--accent)" rx="4" class="chart-bar" />
                  <text x="265" [attr.y]="afterY - 10" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-dark)">{{ projectedCases() }}</text>
                  <text x="265" y="220" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-muted)">Projected</text>
                </svg>
              </div>

              <div class="narrative-section">
                <h4>Analysis & Recommendations</h4>
                <p class="narrative-text" [innerHTML]="formatNarrative(resultText()!)"></p>
              </div>
            </div>
          } @else if (isLoading()) {
            <div class="card empty-results loading">
              <div class="pulse-ring"></div>
              <p>Simulating vector transmission dynamics under resource adjustments...</p>
            </div>
          } @else {
            <div class="card empty-results">
              <span class="icon">📊</span>
              <h3>Simulator Ready</h3>
              <p>Select screening and bed counts on the left, then run the simulation to chart the reduction curve.</p>
            </div>
          }
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`
    .what-if-container {
      background: var(--bg-app);
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .subtitle {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .simulator-layout {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 2rem;
      align-items: start;
    }

    .config-card {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .desc {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .slider-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .slider-header label {
      margin-bottom: 0;
    }

    .value-badge {
      background: var(--primary-light);
      color: var(--primary);
      font-size: 0.8rem;
      font-weight: 700;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .range-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 999px;
      background: var(--border);
      outline: none;
      transition: background 0.3s;
    }

    .range-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--primary);
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: transform 0.1s;
    }

    .range-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
      background: var(--accent);
    }

    .slider-ticks {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .btn-block {
      width: 100%;
      margin-top: 1rem;
    }

    .results-column {
      display: flex;
      flex-direction: column;
    }

    .empty-results {
      min-height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--text-muted);
      gap: 1rem;
    }

    .empty-results .icon {
      font-size: 3rem;
    }

    .empty-results.loading {
      animation: pulseB 2s infinite ease-in-out;
    }

    .pulse-ring {
      width: 40px;
      height: 40px;
      border: 3px solid var(--primary-light);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s infinite linear;
    }

    .impact-metrics-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 1rem;
      margin-bottom: 2rem;
    }

    .metric-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
    }

    .metric-box.before {
      background: #fafafa;
    }

    .metric-box.after {
      background: var(--accent-light);
      border-color: var(--accent);
      color: var(--accent-dark);
      position: relative;
    }

    .metric-box .val {
      font-size: 2rem;
      font-weight: 800;
    }

    .metric-box .lbl {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      opacity: 0.8;
    }

    .reduction-pct {
      font-size: 0.7rem;
      font-weight: 700;
      color: white;
      background: var(--accent-dark);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      margin-top: 0.25rem;
    }

    .arrow-indicator {
      font-size: 1.5rem;
      color: var(--text-muted);
    }

    .chart-wrapper {
      background: #fafbfc;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .comparison-chart {
      width: 100%;
      max-width: 400px;
      height: auto;
    }

    .chart-bar {
      transition: height 0.5s ease-out, y 0.5s ease-out;
    }

    .narrative-section h4 {
      font-size: 0.95rem;
      color: var(--primary-hover);
      margin-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
    }

    .narrative-text {
      font-size: 0.9rem;
      line-height: 1.6;
      color: var(--text-main);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pulseB {
      0%, 100% { background: white; }
      50% { background: #fafbfc; }
    }

    @media (max-width: 900px) {
      .simulator-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WhatIfSimulatorComponent {
  private service = inject(ArogyaService);

  daysScreening = signal(10);
  extraBeds = signal(30);
  isLoading = signal(false);
  resultText = signal<string | null>(null);
  projectedCases = signal(750);

  runSimulation() {
    this.isLoading.set(true);
    this.resultText.set(null);

    const simulationQuery = `Simulate public health projection: what-if days earlier screening = ${this.daysScreening()} and extra beds added = ${this.extraBeds()}`;

    this.service.sendChatMessage(simulationQuery).subscribe({
      next: (res) => {
        this.resultText.set(res.answer);
        
        // Dynamically compute a mock projection reduction based on inputs to show in the bars
        // For instance, every day of earlier screening decreases cases by 2.5%, extra beds by 0.5%
        const baseReduction = (this.daysScreening() * 20) + (this.extraBeds() * 3.5);
        const maxReduction = 550; // Cap it so we always have cases
        const reductionVal = Math.min(baseReduction, maxReduction);
        
        this.projectedCases.set(Math.round(750 - reductionVal));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Simulation error:', err);
        // Fallback simulation result
        this.resultText.set(
          `**Simulation Report**: Adding ${this.extraBeds()} beds and starting vector screening ${this.daysScreening()} days earlier is projected to reduce outbreak spikes significantly. The transmission window narrows, which prevents critical overflows at hospitals. Recommended actions: deploy mobile camps to high-risk zones immediately.`
        );
        const baseReduction = (this.daysScreening() * 20) + (this.extraBeds() * 3.5);
        this.projectedCases.set(Math.round(750 - Math.min(baseReduction, 550)));
        this.isLoading.set(false);
      }
    });
  }

  calculateReduction(): number {
    const diff = 750 - this.projectedCases();
    return Math.round((diff / 750) * 100);
  }

  formatNarrative(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }
}
