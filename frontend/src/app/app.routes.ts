import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ChatComponent } from './components/chat/chat';
import { PhotoComponent } from './components/photo/photo';
import { VoiceComponent } from './components/voice/voice';
import { MapComponent } from './components/map/map';
import { WhatIfSimulatorComponent } from './components/what-if/what-if';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'photo', component: PhotoComponent },
  { path: 'voice', component: VoiceComponent },
  { path: 'map', component: MapComponent },
  { path: 'what-if', component: WhatIfSimulatorComponent },
  { path: '**', redirectTo: 'home' }
];
