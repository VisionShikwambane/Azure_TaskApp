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
    <!-- Mobile Navigation Bar -->
    <nav class="md:hidden fixed top-0 left-0 w-full bg-gradient-to-b from-indigo-100 to-purple-100 backdrop-blur-sm shadow-sm z-50">
      <div class="px-4">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            InvoiceFlow
          </div>
          
          <div class="flex items-center space-x-2">
            <!-- Notifications (Mobile) -->
            <div class="relative">
              <i class="fas fa-bell text-indigo-500 text-xl cursor-pointer hover:text-indigo-600 transition-colors duration-300"></i>
              <span *ngIf="notificationCount > 0" 
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {{ notificationCount > 9 ? '9+' : notificationCount }}
              </span>
            </div>
            
            <!-- Mobile Menu Button -->
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
        
        <!-- Mobile Dropdown Menu -->
        <div [@menuAnimation]="isOpen ? 'open' : 'closed'" class="overflow-hidden">
          <div class="py-2 space-y-1">
            <a *ngFor="let link of links" 
               [href]="link.href"
               class="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-200 
                      hover:text-indigo-600 rounded-lg transition-all duration-300">
              <i class="mr-3 text-indigo-500" [ngClass]="link.icon"></i>
              {{ link.text }}
            </a>
            <!-- Mobile Profile -->
            <div class="flex items-center px-4 py-2 border-t border-indigo-200 mt-2">
              <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
                {{ profileInitials }}
              </div>
              <span class="text-gray-800">{{ profileName }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Desktop Sidebar -->
    <div class="hidden md:block w-64 fixed left-0 top-0 h-full bg-gradient-to-b from-indigo-100 to-purple-100 shadow-sm border-r border-indigo-200 z-10">
      <!-- Sidebar Logo -->
      <div class="h-16 flex items-center px-6 border-b border-indigo-200">
        <div class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          InvoiceFlow
        </div>
      </div>
      
      <!-- Notifications (Desktop) -->
      <div class="px-6 py-2">
        <div class="relative flex items-center">
          <i class="fas fa-bell text-indigo-500 text-xl cursor-pointer hover:text-indigo-600 transition-colors duration-300 mr-4"></i>
          <span class="text-gray-800">Notifications</span>
          <span *ngIf="notificationCount > 0" 
                class="absolute left-4 top-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {{ notificationCount > 9 ? '9+' : notificationCount }}
          </span>
        </div>
      </div>
      
      <!-- Sidebar Nav Links -->
      <div class="py-4">
        <a *ngFor="let link of links" 
           [href]="link.href"
           class="flex items-center px-6 py-3 text-gray-800 hover:bg-indigo-200 
                  hover:text-indigo-600 transition-all duration-300 group">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg mr-3 
                     bg-indigo-50 group-hover:bg-purple-200 transition-colors duration-300">
            <i class="text-indigo-500 group-hover:text-purple-500" [ngClass]="link.icon"></i>
          </div>
          <span>{{ link.text }}</span>
        </a>
      </div>
      
      <!-- Sidebar Profile and Logout -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-200">
        <!-- Profile Section -->
        <div class="flex items-center px-6 py-3 text-gray-800 hover:bg-indigo-200 rounded-lg transition-all duration-300 group">
          <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
            {{ profileInitials }}
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ profileName }}</span>
            <span class="text-xs text-gray-600">{{ profileEmail }}</span>
          </div>
        </div>
        
        <!-- Logout -->
        <a href="#" class="flex items-center px-6 py-3 text-gray-800 hover:bg-indigo-200 
                hover:text-indigo-600 rounded-lg transition-all duration-300 group">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg mr-3 
                     bg-indigo-50 group-hover:bg-purple-200 transition-colors duration-300">
            <i class="fas fa-sign-out-alt text-indigo-500 group-hover:text-purple-500"></i>
          </div>
          <span>Logout</span>
        </a>
      </div>
    </div>
    
    <!-- Content Wrapper -->
    <div class="md:pl-64 w-full">
      <!-- Mobile top spacing -->
      <div class="h-16 md:hidden"></div>
      
      <!-- Main Content -->
      <main class="w-full">
        <ng-content></ng-content>
      </main>
    </div>
  `
})
export class NavigationComponent {
  isOpen = false;
  links = [
    { text: 'Dashboard', href: 'dashboard', icon: 'fas fa-chart-line' },
    { text: 'Invoices', href: 'invoices', icon: 'fas fa-file-invoice' },
    { text: 'Clients', href: 'clients', icon: 'fas fa-users' },
    //{ text: 'Items', href: 'items', icon: 'fas fa-boxes' },
    { text: 'Settings', href: 'settings', icon: 'fas fa-cog' }
  ];

  profileName = 'John Doe';
  profileEmail = 'john.doe@example.com';
  profileInitials = 'JD';
  notificationCount = 3;

  toggleMobileMenu() {
    this.isOpen = !this.isOpen;
  }
}