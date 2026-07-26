import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArogyaService } from '../../services/arogya.service';
import { RouterLink } from '@angular/router';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-doctor-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="doctor-chat-container">
      <!-- Clinical Command Header -->
      <header class="command-header">
        <div class="command-header-left">
          <span class="back-arrow" routerLink="/home">←</span>
          <div class="header-logo-icon" style="margin-left: 0.5rem;">
            <svg class="header-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          </div>
          <div class="command-header-title">
            <h2>AROGYA-DI</h2>
            <span>Doctor Consultation Portal</span>
          </div>
        </div>
        <div class="command-header-right">
          <span class="badge">🩺 Clinical Assistant AI</span>
        </div>
      </header>

      <div class="main-layout">
        <!-- Main Chat Stream -->
        <div class="chat-section">
          <div class="messages-list" #scrollContainer>
            <!-- Medical Welcome -->
            <div class="msg assistant">
              <div class="avatar">🩺</div>
              <div class="bubble-wrapper">
                <div class="bubble clinical-welcome">
                  <h3>Doctor Finder & Availability Portal</h3>
                  <p>
                    I am the <strong>Arogya-DI Doctor Availability Assistant</strong>. I can help you locate healthcare professionals, view their schedules, and check facility coverage in Karnataka.
                  </p>
                  <div class="disclaimer-box">
                    <strong>🔍 Search Scope:</strong> I can search for doctors by specialty, name, or hospital, as well as by district or taluk. I cannot provide clinical advice or symptom diagnostics.
                  </div>
                  <p class="hint">Try asking: <em>"Please tell me which doctor is available in General Medicine"</em> or search by a district or specialty.</p>
                </div>
                <span class="time">Just now</span>
              </div>
            </div>

            <!-- Chat History -->
            @for (msg of messages(); track $index) {
              <div class="msg" [ngClass]="msg.sender">
                <div class="avatar">{{ msg.sender === 'user' ? '👤' : '🩺' }}</div>
                <div class="bubble-wrapper">
                  <div class="bubble" [innerHTML]="formatMessageText(msg.text)"></div>
                  <span class="time">{{ msg.timestamp | date:'shortTime' }}</span>
                </div>
              </div>
            }

            <!-- Loading indicator -->
            @if (isLoading()) {
              <div class="msg assistant">
                <div class="avatar">🩺</div>
                <div class="bubble loading-bubble">
                  <div class="dots-loader">
                    <span></span><span></span><span></span>
                  </div>
                  <span class="loading-text">Searching doctor database...</span>
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
                placeholder="Search doctors, specialties, or facilities (e.g., 'orthopaedic doctors' or 'Ramanagara district')..." 
                [disabled]="isLoading()"
                autocomplete="off"
                class="chat-input-field"
              />
              <button type="submit" class="btn btn-clinical send-btn" [disabled]="!userInput.trim() || isLoading()">
                <span>Search</span> 🩺
              </button>
            </form>
          </div>
        </div>

        <!-- Right side quick info panel -->
        <aside class="clinical-sidebar">
          <div class="sidebar-card">
            <h3>Quick Search</h3>
            <p class="card-desc">Click below to auto-populate common searches</p>
            <div class="quick-links">
              <button (click)="usePreset('Find orthopaedic doctors')" class="preset-btn">🦴 Orthopaedic Doctors</button>
              <button (click)="usePreset('Search for Pediatricians available today')" class="preset-btn">👶 Pediatricians</button>
              <button (click)="usePreset('What are the working hours of General Medicine specialists?')" class="preset-btn">🕒 Working Hours</button>
              <button (click)="usePreset('Which healthcare facilities are covered in Ramanagara district?')" class="preset-btn">📍 Ramanagara Facility Coverage</button>
            </div>
          </div>

          <div class="sidebar-card helpline">
            <h3>Emergency Helplines</h3>
            <ul>
              <li><strong>National Health Portal:</strong> 1800-180-1104</li>
              <li><strong>Dengue/Malaria Hotline:</strong> 104</li>
              <li><strong>Ambulance Support:</strong> 102 / 108</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .doctor-chat-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--bg-app);
      font-family: inherit;
    }

    .main-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .chat-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
    }

    .clinical-sidebar {
      width: 320px;
      background: var(--bg-card);
      border-left: 1px solid var(--border);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      overflow-y: auto;
    }

    .sidebar-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.25rem;
      box-shadow: var(--shadow-sm);
    }

    .sidebar-card h3 {
      font-size: 1rem;
      color: var(--primary);
      margin-top: 0;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    .quick-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .preset-btn {
      text-align: left;
      background: var(--bg-app);
      border: 1px solid var(--border);
      color: var(--text-main);
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }

    .preset-btn:hover {
      background: var(--primary-light);
      color: var(--primary-hover);
      transform: translateX(2px);
    }

    .helpline {
      border-left: 4px solid var(--critical);
    }

    .helpline ul {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.85rem;
    }

    .helpline li {
      color: var(--text-muted);
    }

    .command-header {
      background: var(--primary);
      color: white;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .command-header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .back-arrow {
      font-size: 1.5rem;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.8);
      transition: var(--transition);
    }

    .back-arrow:hover {
      color: white;
    }

    .command-header-title h2 {
      margin: 0;
      font-size: 1.1rem;
      letter-spacing: 0.5px;
      color: white;
    }

    .command-header-title span {
      font-size: 0.75rem;
      color: var(--accent-light);
    }

    .badge {
      background: var(--accent-light);
      color: var(--accent-dark);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
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
      color: white;
      border: none;
    }

    .msg.assistant .avatar {
      background: var(--primary-light);
      color: var(--primary);
    }

    .bubble-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .bubble {
      padding: 1rem 1.25rem;
      border-radius: 12px;
      background: white;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--text-main);
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
    }

    .msg.assistant .bubble ul {
      list-style-type: none;
      padding-left: 0;
      margin-top: 0.75rem;
      margin-bottom: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .msg.assistant .bubble li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--text-main);
    }

    .msg.assistant .bubble li::before {
      content: "✦";
      position: absolute;
      left: 0;
      color: var(--accent);
      font-weight: 700;
    }

    .msg.assistant .bubble strong {
      color: var(--primary-hover);
      font-weight: 700;
    }

    .clinical-welcome {
      background: #f6f4ed !important;
      border-color: #e2dec9 !important;
    }

    .clinical-welcome h3 {
      margin-top: 0;
      color: var(--primary);
    }

    .disclaimer-box {
      background: var(--primary-light);
      border: 1px solid var(--border);
      color: var(--primary-hover);
      padding: 0.75rem 1rem;
      border-radius: 6px;
      margin: 1rem 0;
      font-size: 0.85rem;
    }

    .time {
      font-size: 0.75rem;
      color: var(--text-muted);
      align-self: flex-end;
    }

    .msg.user .time {
      align-self: flex-end;
    }

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
      outline: none;
      font-size: 0.95rem;
      transition: var(--transition);
    }

    .chat-input-field:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }

    .btn-clinical {
      background: var(--primary);
      color: white;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-clinical:hover {
      background: var(--primary-hover);
    }

    .send-btn {
      border-radius: 999px;
      padding-left: 2rem;
      padding-right: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .loading-bubble {
      display: flex;
      align-items: center;
      gap: 1rem;
      border-top-left-radius: 0;
    }

    .dots-loader {
      display: flex;
      gap: 4px;
    }

    .dots-loader span {
      width: 8px;
      height: 8px;
      background: var(--primary);
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }

    .dots-loader span:nth-child(1) { animation-delay: -0.32s; }
    .dots-loader span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DoctorChatComponent {
  private service = inject(ArogyaService);

  userInput = '';
  messages = signal<Message[]>([]);
  isLoading = signal(false);

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

    this.service.sendDoctorChatMessage(userMessageText).subscribe({
      next: (res) => {
        this.messages.update((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: res.answer,
            timestamp: new Date(),
          },
        ]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Doctor Chat error:', err);
        this.messages.update((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: 'Sorry, I am unable to connect to the clinical workspace right now. Please try again later or consult an emergency hotline.',
            timestamp: new Date(),
          },
        ]);
        this.isLoading.set(false);
      },
    });
  }

  usePreset(presetText: string) {
    this.userInput = presetText;
    this.sendMessage();
  }

  formatMessageText(text: string): string {
    const lines = text.split('\n');
    let inList = false;
    const htmlLines = lines.map(line => {
      let trimmed = line.trim();
      
      // Headers
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

      // Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2).trim()
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code style="background:#e2e8f0;padding:2px 4px;border-radius:4px;font-family:monospace;">$1</code>');
        
        if (!inList) {
          inList = true;
          return '<ul><li>' + content + '</li>';
        }
        return '<li>' + content + '</li>';
      }

      // Formatted text
      let formattedLine = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code style="background:#e2e8f0;padding:2px 4px;border-radius:4px;font-family:monospace;">$1</code>');
        
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
}
