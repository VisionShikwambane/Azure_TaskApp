import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  credentials = {
    email: '',
    password: ''
  };
  errorMessage: string | null = null;

  constructor(private router: Router) {}

  onSubmit() {
    // Simulate authentication (replace with your actual API call)
    if (this.credentials.email === 'test@example.com' && this.credentials.password === 'password123') {
      this.errorMessage = null;
      // Navigate to the clients page or dashboard
      this.router.navigate(['/clients']);
    } else {
      this.errorMessage = 'Invalid email or password. Please try again.';
    }
  }

}
