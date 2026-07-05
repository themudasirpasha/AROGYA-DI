import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArogyaService } from '../../services/arogya.service';

import { RouterLink } from '@angular/router';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  tableData?: TableData;
}

interface TableData {
  headers: string[];
  rows: string[][];
  chartable: boolean;
  chartValues: { label: string; value: number }[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="chat-container">
      <!-- Unified Command Header matching Mockup -->
      <header class="command-header">
        <div class="command-header-left">
          <span class="back-arrow" routerLink="/home">←</span>
          <div class="command-header-title">
            <h2>AROGYA-DI</h2>
            <span>Chat Command Center</span>
          </div>
        </div>
        <div class="command-header-right">
          <span class="command-header-icon" title="Channel Info">📁</span>
        </div>
      </header>

      <div class="messages-list" #scrollContainer>
        <!-- Welcome Message -->
        <div class="msg assistant">
          <div class="avatar">🤖</div>
          <div class="bubble">
            <p>Welcome to <strong>Arogya-DI Command Center</strong>. I can assist you with:</p>
            <ul>
              <li>Checking air quality (AQI) levels and coordinates across Indian cities.</li>
              <li>Predicting dengue and mosquito breeding sites with geo-data.</li>
              <li>Analyzing anomalies and disease outbreak trends.</li>
              <li>Running what-if public health resource simulations.</li>
            </ul>
            <p class="hint">Try asking: <em>"Show me air quality with location coordinates"</em> or <em>"List the cities with the worst air quality"</em></p>
          </div>
        </div>

        <!-- Chat History -->
        @for (msg of messages(); track $index) {
          <div class="msg" [ngClass]="msg.sender">
            <div class="avatar">{{ msg.sender === 'user' ? '👤' : '🤖' }}</div>
            <div class="bubble-wrapper">
              <div class="bubble">
                <p class="message-text" [innerHTML]="formatMessageText(msg.text)"></p>
                
                <!-- Render Table & Chart if parsed -->
                @if (msg.tableData) {
                  <div class="table-visualization-container">
                    <div class="tabs">
                      <button [class.active]="activeTab[$index] !== 'chart'" (click)="activeTab[$index] = 'table'">
                        📋 Table View
                      </button>
                      @if (msg.tableData.chartable) {
                        <button [class.active]="activeTab[$index] === 'chart'" (click)="activeTab[$index] = 'chart'">
                          📊 Chart View
                        </button>
                      }
                    </div>

                    <div class="tab-content">
                      <!-- Table View -->
                      @if (activeTab[$index] !== 'chart') {
                        <div class="table-responsive">
                          <table class="data-table">
                            <thead>
                              <tr>
                                @for (h of msg.tableData.headers; track h) {
                                  <th>{{ h }}</th>
                                }
                              </tr>
                            </thead>
                            <tbody>
                              @for (row of msg.tableData.rows; track row) {
                                <tr>
                                  @for (cell of row; track cell) {
                                    <td>{{ cell }}</td>
                                  }
                                </tr>
                              }
                            </tbody>
                          </table>
                        </div>
                      }

                      <!-- Chart View -->
                      @if (msg.tableData.chartable && activeTab[$index] === 'chart') {
                        <div class="chart-wrapper">
                          <svg viewBox="0 0 500 360" class="bar-chart">
                            <!-- Y Grid Lines -->
                            <line x1="50" y1="40" x2="450" y2="40" stroke="#e5e7eb" stroke-dasharray="4" />
                            <line x1="50" y1="100" x2="450" y2="100" stroke="#e5e7eb" stroke-dasharray="4" />
                            <line x1="50" y1="160" x2="450" y2="160" stroke="#e5e7eb" stroke-dasharray="4" />
                            <line x1="50" y1="230" x2="450" y2="230" stroke="#9ca3af" stroke-width="2" />

                            <!-- Bars -->
                            @for (item of msg.tableData.chartValues; track item; let idx = $index) {
                              @let numBars = msg.tableData.chartValues.length;
                              @let chartWidth = 400;
                              @let barWidth = Math.max(12, Math.min(40, (chartWidth / numBars) * 0.45));
                              @let totalBarWidth = numBars * barWidth;
                              @let spacing = (chartWidth - totalBarWidth) / (numBars + 1);
                              @let x = 50 + spacing + (idx * (barWidth + spacing));
                              @let maxVal = getMaxChartValue(msg.tableData.chartValues);
                              @let valRatio = maxVal > 0 ? (item.value / maxVal) : 0;
                              @let barHeight = valRatio * 180;
                              @let y = 230 - barHeight;

                              <!-- Bar -->
                              <rect 
                                [attr.x]="x" 
                                [attr.y]="y" 
                                [attr.width]="barWidth" 
                                [attr.height]="barHeight" 
                                fill="var(--primary)" 
                                rx="4"
                                class="chart-bar"
                              />

                              <!-- Bar Label (Value) -->
                              <text 
                                [attr.x]="x + barWidth / 2" 
                                [attr.y]="y - 6" 
                                text-anchor="middle" 
                                font-size="10" 
                                font-weight="700" 
                                fill="var(--primary-hover)"
                              >
                                {{ item.value }}
                              </text>

                              <!-- Label (X axis) -->
                              <text 
                                [attr.x]="x + barWidth / 2" 
                                y="255" 
                                text-anchor="middle" 
                                font-size="9" 
                                font-weight="600"
                                fill="var(--text-muted)"
                                [attr.transform]="'rotate(-30 ' + (x + barWidth / 2) + ' 255)'"
                              >
                                {{ truncateLabel(item.label) }}
                              </text>
                            }
                          </svg>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
              <span class="time">{{ msg.timestamp | date:'shortTime' }}</span>
            </div>
          </div>
        }

        <!-- Loading indicator -->
        @if (isLoading()) {
          <div class="msg assistant">
            <div class="avatar">🤖</div>
            <div class="bubble loading-bubble">
              <div class="dots-loader">
                <span></span><span></span><span></span>
              </div>
              <span class="loading-text">Analyzing & querying live data...</span>
            </div>
          </div>
        }
      </div>

      <div class="chat-input-area">
        <form (ngSubmit)="sendMessage()" class="input-form">
          <input 
            type="text" 
            [(ngModel)]="userInput" 
            name="message" 
            placeholder="Ask a question (e.g. 'Show me air quality coordinates' or 'Simulate 10 beds')..." 
            [disabled]="isLoading()"
            autocomplete="off"
            class="chat-input-field"
          />
          <button type="submit" class="btn btn-primary send-btn" [disabled]="!userInput.trim() || isLoading()">
            <span>Send</span> ➡️
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--bg-app);
    }

    .chat-header {
      background: white;
      padding: 1.25rem 2rem;
      border-bottom: 1px solid var(--border);
    }

    .header-main {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: var(--accent-light);
      color: var(--accent-dark);
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 9999px;
      text-transform: uppercase;
    }

    .status-indicator .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
    }

    .subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .messages-list {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .msg {
      display: flex;
      gap: 1rem;
      max-width: 80%;
      animation: fadeIn 0.3s ease-out;
    }

    .msg.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .msg.assistant {
      align-self: flex-start;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: var(--shadow-sm);
      flex-shrink: 0;
    }

    .msg.user .avatar {
      background: var(--primary);
    }

    .bubble-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .bubble {
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      background: white;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      font-size: 0.95rem;
    }

    .msg.user .bubble {
      background: var(--primary);
      color: white;
      border: none;
      border-top-right-radius: 0;
    }

    .msg.assistant .bubble {
      background: #f6f4ed;
      border-color: #e2dec9;
      border-top-left-radius: 0;
      color: #1c1917;
    }

    .msg.assistant .bubble h3 {
      font-size: 1.1rem;
      margin-top: 0.85rem;
      margin-bottom: 0.5rem;
      color: var(--primary);
    }

    .msg.assistant .bubble h2 {
      font-size: 1.25rem;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: var(--primary);
    }

    .msg.assistant .bubble h1 {
      font-size: 1.4rem;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: var(--primary);
    }

    .msg.assistant .bubble ul {
      margin-left: 1.25rem;
      margin-top: 0.5rem;
      margin-bottom: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .msg.assistant .bubble li {
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--text-main);
    }

    .msg.assistant .bubble p {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }

    .inline-code {
      background: var(--bg-app);
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85rem;
      color: var(--primary-hover);
      border: 1px solid var(--border);
    }

    .time {
      font-size: 0.75rem;
      color: var(--text-muted);
      align-self: flex-end;
    }

    .msg.user .time {
      align-self: flex-end;
    }

    .hint {
      margin-top: 1rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      background: var(--bg-app);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-sm);
      border-left: 3px solid var(--accent);
    }

    .loading-bubble {
      display: flex;
      align-items: center;
      gap: 1rem;
      border-top-left-radius: 0;
    }

    .loading-text {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-style: italic;
    }

    /* Table Formatting */
    .table-visualization-container {
      margin-top: 1rem;
      background: var(--bg-app);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      padding: 1rem;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
    }

    .tabs button {
      background: transparent;
      border: none;
      font-family: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: var(--transition);
    }

    .tabs button.active {
      color: var(--primary);
      background: var(--primary-light);
    }

    .table-responsive {
      max-height: 250px;
      overflow-y: auto;
      border-radius: 4px;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      text-align: left;
    }

    .data-table th, .data-table td {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--border);
    }

    .data-table th {
      background: white;
      font-weight: 700;
      color: var(--primary);
      position: sticky;
      top: 0;
    }

    .data-table tr:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    /* Chart styles */
    .chart-wrapper {
      padding: 1rem;
      background: white;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .bar-chart {
      width: 100%;
      max-height: 200px;
    }

    .chart-bar {
      transition: height 0.3s ease, y 0.3s ease;
    }

    .chart-bar:hover {
      fill: var(--accent);
    }

    /* Chat input box */
    .chat-input-area {
      padding: 1.5rem 2rem;
      background: white;
      border-top: 1px solid var(--border);
    }

    .input-form {
      display: flex;
      gap: 1rem;
    }

    .chat-input-field {
      flex: 1;
      padding: 0.875rem 1.25rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      font-family: inherit;
      outline: none;
      transition: var(--transition);
      font-size: 0.95rem;
    }

    .chat-input-field:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }

    .send-btn {
      border-radius: 999px;
      padding-left: 2rem;
      padding-right: 2rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ChatComponent {
  private service = inject(ArogyaService);
  protected readonly Math = Math;

  userInput = '';
  messages = signal<Message[]>([]);
  isLoading = signal(false);
  activeTab: { [key: number]: 'table' | 'chart' } = {};

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading()) return;

    const userMessageText = this.userInput;
    this.messages.update((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userMessageText,
        timestamp: new Date(),
      },
    ]);

    this.userInput = '';
    this.isLoading.set(true);

    this.service.sendChatMessage(userMessageText).subscribe({
      next: (res) => {
        const tableData = this.parseMarkdownTable(res.answer);
        const cleanAnswer = tableData ? this.removeTableFromText(res.answer) : res.answer;

        this.messages.update((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: cleanAnswer,
            timestamp: new Date(),
            tableData,
          },
        ]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Chat error:', err);
        this.messages.update((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: 'Sorry, I encountered an error while processing your request. Please try again.',
            timestamp: new Date(),
          },
        ]);
        this.isLoading.set(false);
      },
    });
  }

  formatMessageText(text: string): string {
    const lines = text.split('\n');
    let inList = false;
    const htmlLines = lines.map(line => {
      let trimmed = line.trim();
      
      // 1. Headers
      if (trimmed.startsWith('###')) {
        let headerText = trimmed.substring(3).trim();
        if (inList) {
          inList = false;
          return '</ul><h3>' + headerText + '</h3>';
        }
        return '<h3>' + headerText + '</h3>';
      }
      if (trimmed.startsWith('##')) {
        let headerText = trimmed.substring(2).trim();
        if (inList) {
          inList = false;
          return '</ul><h2>' + headerText + '</h2>';
        }
        return '<h2>' + headerText + '</h2>';
      }
      if (trimmed.startsWith('#')) {
        let headerText = trimmed.substring(1).trim();
        if (inList) {
          inList = false;
          return '</ul><h1>' + headerText + '</h1>';
        }
        return '<h1>' + headerText + '</h1>';
      }

      // 2. Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2).trim()
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
        
        if (!inList) {
          inList = true;
          return '<ul><li>' + content + '</li>';
        }
        return '<li>' + content + '</li>';
      }

      // Close list if line is empty or does not start with *
      let formattedLine = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
        
      if (inList && trimmed === '') {
        inList = false;
        return '</ul>';
      } else if (inList) {
        inList = false;
        return '</ul><p>' + formattedLine + '</p>';
      }

      return trimmed === '' ? '<br/>' : '<p>' + formattedLine + '</p>';
    });

    if (inList) {
      htmlLines.push('</ul>');
    }

    return htmlLines.join('\n');
  }

  parseMarkdownTable(text: string): TableData | undefined {
    const lines = text.split('\n');
    const tableLines = lines.filter(l => l.trim().startsWith('|') && l.trim().endsWith('|'));
    
    if (tableLines.length < 3) return undefined; // Needs header, divider, and at least one data row

    // Parse headers
    const headers = tableLines[0]
      .split('|')
      .map(h => h.trim())
      .filter(h => h !== '');

    // Skip divider row (index 1)
    const rows: string[][] = [];
    let isChartable = true;
    let valueColumnIdx = -1;
    let labelColumnIdx = 0;

    for (let i = 2; i < tableLines.length; i++) {
      const cells = tableLines[i]
        .split('|')
        .map(c => c.trim())
        .filter(c => c !== '');
      if (cells.length === headers.length) {
        rows.push(cells);
      }
    }

    if (rows.length === 0) return undefined;

    // Find if there is a numeric column to build a chart
    // We assume the first non-label column with numbers is chartable
    for (let col = 1; col < headers.length; col++) {
      const isNum = rows.every(row => !isNaN(Number(row[col].replace(/,/g, ''))));
      if (isNum) {
        valueColumnIdx = col;
        break;
      }
    }

    const chartValues: { label: string; value: number }[] = [];
    if (valueColumnIdx !== -1) {
      rows.forEach(row => {
        const val = Number(row[valueColumnIdx].replace(/,/g, ''));
        chartValues.push({
          label: row[labelColumnIdx],
          value: val
        });
      });
    } else {
      isChartable = false;
    }

    return {
      headers,
      rows,
      chartable: isChartable && chartValues.length > 0,
      chartValues
    };
  }

  removeTableFromText(text: string): string {
    const lines = text.split('\n');
    return lines.filter(l => !(l.trim().startsWith('|') && l.trim().endsWith('|'))).join('\n').trim();
  }

  getMaxChartValue(vals: { label: string; value: number }[]): number {
    return Math.max(...vals.map(v => v.value), 1) * 1.15;
  }

  truncateLabel(label: string): string {
    if (label.length > 12) {
      return label.substring(0, 10) + '..';
    }
    return label;
  }
}
