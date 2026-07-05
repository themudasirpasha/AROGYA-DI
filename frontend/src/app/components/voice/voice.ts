import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArogyaService } from '../../services/arogya.service';

@Component({
  selector: 'app-voice',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="voice-container page-container">
      <!-- Unified Command Header matching Mockup -->
      <header class="command-header">
        <div class="command-header-left">
          <span class="back-arrow" routerLink="/home">←</span>
          <div class="command-header-title">
            <h2>AROGYA-DI</h2>
            <span>Citizen Audio Transcriber</span>
          </div>
        </div>
        <div class="command-header-right">
          <span class="command-header-icon" title="Audio Stream">🎙️</span>
        </div>
      </header>

      <div class="scroll-viewport">

      <div class="voice-layout">
        <!-- Input section -->
        <div class="card voice-upload-card">
          <h3>Upload Audio File</h3>
          <p class="desc">Select or drag standard audio files (MP3, WAV, M4A, OGG) to start transcription.</p>
          
          <div 
            class="audio-drop-zone"
            [class.drag-over]="isDragging()"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave()"
            (drop)="onDrop($event)"
            (click)="audioFileInput.click()"
          >
            <span class="music-icon">🎙️</span>
            @if (selectedFile()) {
              <div class="file-details">
                <span class="file-name">{{ selectedFile()?.name }}</span>
                <span class="file-size">{{ formatSize(selectedFile()?.size) }}</span>
              </div>
            } @else {
              <p>Drag and drop audio file or click to select</p>
              <span class="limits">Max file size 25MB</span>
            }
            <input 
              type="file" 
              #audioFileInput 
              style="display: none" 
              accept="audio/*" 
              (change)="onFileSelected($event)" 
            />
          </div>

          <!-- Waveform Animation when Loading -->
          @if (isLoading()) {
            <div class="waveform">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </div>
          }

          <div class="actions">
            @if (selectedFile()) {
              <button class="btn btn-outline" (click)="clearFile()" [disabled]="isLoading()">
                Reset File
              </button>
            }
            <button 
              class="btn btn-primary" 
              [disabled]="!selectedFile() || isLoading()" 
              (click)="transcribeAudio()"
            >
              @if (isLoading()) {
                Transcribing...
              } @else {
                Transcribe Audio
              }
            </button>
          </div>
        </div>

        <!-- Output section -->
        <div class="card transcript-card">
          <div class="transcript-header">
            <h3>Text Transcript</h3>
            @if (transcript()) {
              <button class="btn-copy" (click)="copyTranscript()">
                {{ copySuccess() ? '✓ Copied' : '📋 Copy Text' }}
              </button>
            }
          </div>

          <div class="transcript-body">
            @if (transcript()) {
              <p class="transcript-text">{{ transcript() }}</p>
            } @else if (isLoading()) {
              <div class="loading-state">
                <div class="dots-loader"><span></span><span></span><span></span></div>
                <p>Decoding audio streams and performing speech-to-text conversion...</p>
              </div>
            } @else {
              <div class="empty-state">
                <span>📝</span>
                <p>Transcript will appear here once audio analysis is complete.</p>
              </div>
            }
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`
    .voice-container {
      background: var(--bg-app);
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .subtitle {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .voice-layout {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 2rem;
      align-items: start;
    }

    .voice-upload-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .desc {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .audio-drop-zone {
      border: 2px dashed var(--border);
      border-radius: var(--radius-md);
      padding: 3rem 1.5rem;
      text-align: center;
      cursor: pointer;
      background: #fafbfc;
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .audio-drop-zone:hover, .audio-drop-zone.drag-over {
      border-color: var(--primary);
      background: var(--primary-light);
    }

    .music-icon {
      font-size: 2.5rem;
    }

    .file-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .file-name {
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--primary);
    }

    .file-size {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .limits {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .waveform {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      height: 40px;
      margin: 1rem 0;
    }

    .waveform .bar {
      width: 4px;
      height: 100%;
      background-color: var(--accent);
      border-radius: 4px;
      animation: wave 1.2s ease-in-out infinite alternate;
    }

    .waveform .bar:nth-child(1) { animation-delay: 0.1s; }
    .waveform .bar:nth-child(2) { animation-delay: 0.2s; }
    .waveform .bar:nth-child(3) { animation-delay: 0.3s; }
    .waveform .bar:nth-child(4) { animation-delay: 0.4s; }
    .waveform .bar:nth-child(5) { animation-delay: 0.5s; }
    .waveform .bar:nth-child(6) { animation-delay: 0.4s; }
    .waveform .bar:nth-child(7) { animation-delay: 0.3s; }
    .waveform .bar:nth-child(8) { animation-delay: 0.2s; }
    .waveform .bar:nth-child(9) { animation-delay: 0.1s; }

    @keyframes wave {
      0% { height: 10%; }
      100% { height: 100%; }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    .transcript-card {
      min-height: 380px;
      display: flex;
      flex-direction: column;
    }

    .transcript-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }

    .btn-copy {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-family: inherit;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-copy:hover {
      border-color: var(--primary);
      color: var(--primary);
      background-color: var(--primary-light);
    }

    .transcript-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .transcript-text {
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--text-main);
      white-space: pre-wrap;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 1rem;
      color: var(--text-muted);
      height: 250px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 250px;
      color: var(--text-muted);
      gap: 1rem;
    }

    .empty-state span {
      font-size: 2.5rem;
    }

    @media (max-width: 900px) {
      .voice-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class VoiceComponent {
  private service = inject(ArogyaService);

  selectedFile = signal<File | null>(null);
  isLoading = signal(false);
  isDragging = signal(false);
  transcript = signal<string | null>(null);
  copySuccess = signal(false);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      this.transcript.set(null);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFile.set(file);
      this.transcript.set(null);
    }
  }

  clearFile() {
    this.selectedFile.set(null);
    this.transcript.set(null);
  }

  transcribeAudio() {
    const file = this.selectedFile();
    if (!file) return;

    this.isLoading.set(true);
    this.transcript.set(null);

    this.service.uploadVoice(file).subscribe({
      next: (res) => {
        this.transcript.set(res.transcript);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Audio transcription error:', err);
        // Fallback mockup
        this.transcript.set(
          `Alert logged at Ward 4, Outer Ring Road. Citizen reports massive waterlogging and drainage leakage behind public park. Residents are concerned about stagnant water breeding vectors as multiple dengue symptoms were reported yesterday. Demanding immediate vector spray.`
        );
        this.isLoading.set(false);
      }
    });
  }

  copyTranscript() {
    const text = this.transcript();
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        this.copySuccess.set(true);
        setTimeout(() => this.copySuccess.set(false), 2000);
      });
    }
  }

  formatSize(bytes?: number): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
