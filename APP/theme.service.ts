import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = false;

  constructor() {
    // Check if user previously selected dark mode
    if (localStorage.getItem('darkMode') === 'true') {
      this.setDarkMode(true);
    }
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkMode);
  }

  private setDarkMode(isDark: boolean): void {
    this.isDarkMode = isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }
}