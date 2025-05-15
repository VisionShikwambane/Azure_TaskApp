import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audio: HTMLAudioElement | null = null;

  playSound(soundFile: string): void {
    if (this.audio) {
      this.audio.pause(); // Stop any existing sound before playing a new one
      this.audio.currentTime = 0; // Reset to start
    }

    this.audio = new Audio(`assets/sounds/${soundFile}`);
    this.audio.play().catch(error => console.error('Error playing sound:', error));
  }
}
