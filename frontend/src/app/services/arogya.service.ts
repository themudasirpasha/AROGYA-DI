import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

export interface ChatResponse {
  answer: string;
}

export interface UploadResponse {
  breeding_site_detected: boolean;
  confidence: number;
  reason: string;
  recommended_action: string;
}

export interface TranscribeResponse {
  transcript: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArogyaService {
  private http = inject(HttpClient);
  private baseUrl = 'https://arogya-di-backend-244972601130.us-central1.run.app/api';

  sendChatMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/chat`, { message });
  }

  uploadPhoto(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/upload`, formData).pipe(
      map(res => {
        // If the backend returns a nested 'result' string containing JSON
        if (res && res.result) {
          try {
            let cleanJson = res.result.trim();
            if (cleanJson.startsWith('```json')) {
              cleanJson = cleanJson.substring(7);
            }
            if (cleanJson.endsWith('```')) {
              cleanJson = cleanJson.substring(0, cleanJson.length - 3);
            }
            return JSON.parse(cleanJson.trim()) as UploadResponse;
          } catch (e) {
            console.error('Failed to parse result string JSON:', e);
          }
        }
        // Fallback or return direct if it matches structure
        return res as UploadResponse;
      })
    );
  }

  uploadVoice(file: File): Observable<TranscribeResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<TranscribeResponse>(`${this.baseUrl}/transcribe`, formData);
  }
}
