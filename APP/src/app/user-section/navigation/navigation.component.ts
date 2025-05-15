import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('menuAnimation', [
      state('open', style({
        height: '*',
        opacity: 1
      })),
      state('closed', style({
        height: '0',
        opacity: 0
      })),
      transition('closed <=> open', [
        animate('0.3s ease-in-out')
      ])
    ]),
    trigger('linkAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ],
  template: `
    <!-- Navigation Bar -->
    <nav class="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-sm shadow-sm z-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Task Manager
          </div>
          

          
          <!-- Notification and Profile -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- Notifications -->
            <div class="relative">
              <i class="fas fa-bell text-indigo-500 text-xl cursor-pointer hover:text-indigo-600 transition-colors duration-300"></i>
              <span *ngIf="notificationCount > 0" 
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {{ notificationCount > 9 ? '9+' : notificationCount }}
              </span>
            </div>
            
            <!-- Profile -->
            <div class="flex items-center cursor-pointer hover:bg-indigo-50 py-1 px-2 rounded-lg transition-colors duration-300">
              <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-2">
                {{ profileInitials }}
              </div>
              <span class="text-gray-800">{{ profileName }}</span>
              <i class="fas fa-chevron-down text-xs text-gray-600 ml-2"></i>
            </div>
          </div>
          
          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center space-x-3">
            <!-- Mobile Notification -->
            <div class="relative">
              <i class="fas fa-bell text-indigo-500 text-xl cursor-pointer hover:text-indigo-600 transition-colors duration-300"></i>
              <span *ngIf="notificationCount > 0" 
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {{ notificationCount > 9 ? '9+' : notificationCount }}
              </span>
            </div>
            
            <button class="p-2 hover:bg-indigo-200 rounded-lg transition-colors duration-300" 
                    (click)="toggleMobileMenu()">
              <div class="w-6 h-4 flex flex-col justify-between relative">
                <span class="w-full h-0.5 bg-gray-800 rounded-full transform transition-all duration-300"
                      [class.rotate-45]="isOpen"
                      [class.translate-y-1.5]="isOpen">
                </span>
                <span class="w-full h-0.5 bg-gray-800 rounded-full transition-opacity duration-300"
                      [class.opacity-0]="isOpen">
                </span>
                <span class="w-full h-0.5 bg-gray-800 rounded-full transform transition-all duration-300"
                      [class.-rotate-45]="isOpen"
                      [class.-translate-y-1.5]="isOpen">
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Dropdown Menu -->
      <div [@menuAnimation]="isOpen ? 'open' : 'closed'" class="md:hidden overflow-hidden">
        <div class="px-4 py-2 space-y-1 bg-indigo-50">
          
          <!-- Mobile Profile -->
          <div class="flex items-center px-4 py-2 border-t border-indigo-200 mt-2">
            <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
              {{ profileInitials }}
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-medium">{{ profileName }}</span>
              <span class="text-xs text-gray-600">{{ profileEmail }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Content Spacer -->
    <div class="h-16"></div>
    
    <!-- Main Content -->
    <main class="w-full">
      <ng-content></ng-content>
    </main>
  `
})
export class NavigationComponent {
  isOpen = false;
  links = [
    // { text: 'Dashboard', href: 'dashboard', icon: 'fas fa-chart-line' },
    // { text: 'Invoices', href: 'invoices', icon: 'fas fa-file-invoice' },
    // { text: 'Clients', href: 'clients', icon: 'fas fa-users' },
    // //{ text: 'Items', href: 'items', icon: 'fas fa-boxes' },
    // { text: 'Settings', href: 'settings', icon: 'fas fa-cog' }
  ];

  profileName = 'John Doe';
  profileEmail = 'john.doe@example.com';
  profileInitials = 'JD';
  notificationCount = 3;

  toggleMobileMenu() {
    this.isOpen = !this.isOpen;
  }
}