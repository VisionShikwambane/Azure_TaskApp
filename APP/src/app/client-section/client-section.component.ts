import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-section.component.html',
  styleUrl: './client-section.component.css'
})
export class ClientSectionComponent {

  constructor() { }
  

}
