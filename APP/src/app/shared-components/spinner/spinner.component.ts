import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="absolute inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div class="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-xl">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <span class="text-gray-800 text-lg font-medium">{{ message }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  @Input() isLoading: boolean = false;
  @Input() message: string = 'Loading...';
}