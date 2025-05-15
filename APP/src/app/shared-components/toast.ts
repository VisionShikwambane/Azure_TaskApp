// toast.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" 
       class="fixed bottom-0 left-0 right-0 z-50 p-4 md:bottom-8 md:right-8 md:left-auto md:max-w-md pointer-events-none">
      <div [class]="containerClasses">
        <div class="flex items-center space-x-3">
          <!-- Success Icon -->
          <svg *ngIf="type === 'success'" class="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          <!-- Error Icon -->
          <svg *ngIf="type === 'error'" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!-- Information Icon -->
          <svg *ngIf="type === 'info'" class="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          <p class="text-sm font-medium">{{ message }}</p>
        </div>
        
        <button 
          (click)="closeToast()"
          [class]="closeButtonClasses"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Close notification</span>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent implements OnInit, OnDestroy {
  show = false;
  message = '';
  type: 'success' | 'error' | 'info' = 'success';
  private subscription!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toastState$.subscribe(state => {
      this.show = state.show;
      this.message = state.message;
      this.type = state.type;

      if (this.show) {
        setTimeout(() => this.closeToast(), 5000); // Auto close after 5 seconds
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get containerClasses(): string {
    const baseClasses = 'flex items-center justify-between w-full p-4 rounded-lg shadow-lg pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100';
    
    switch (this.type) {
      case 'success':
        return `${baseClasses} bg-green-50 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 text-red-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 text-blue-800`;
      default:
        return baseClasses;
    }
  }

  get closeButtonClasses(): string {
    const baseClasses = 'p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity';
    
    switch (this.type) {
      case 'success':
        return `${baseClasses} hover:bg-green-100`;
      case 'error':
        return `${baseClasses} hover:bg-red-100`;
      case 'info':
        return `${baseClasses} hover:bg-blue-100`;
      default:
        return baseClasses;
    }
  }

  closeToast() {
    this.toastService.hide();
  }
}