import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Setting } from '../../models/Settings';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

activeTab = 'company';
logoPreview: string | null = null;
  
@ViewChild('logoInput') logoInput!: ElementRef;

settings: Setting = new Setting();


  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings() {
    this.settingsService.getAll().subscribe(
      (settings: Setting[]) => {
        if (settings && settings.length > 0) {
          this.settings = settings[0]; // Assuming we get a single settings object
          this.logoPreview = this.settings.companyLogo ? URL.createObjectURL(new Blob([this.settings.companyLogo])) : null;
        }
      },
      (error) => {
        console.error('Failed to load settings', error);
        // Handle error appropriately (e.g., show a message to the user)
      }
    );
  }

  saveSettings() {
 
    console.log('Settings to save', this.settings);
    this.settingsService.saveRecord(this.settings).subscribe(
      (response) => {
        console.log('Setting added successfully', response);
        alert('Settings saved successfully!');
    
      },
      (error) => {
        console.error('Failed to add setting', error);
    
      }
    );
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // For preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Store the file
      this.settings.companyLogo = file;
    }
  }



}
