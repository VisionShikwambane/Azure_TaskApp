import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-invoice-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-invoice-template.component.html',
  styleUrl: './select-invoice-template.component.css'
})
export class SelectInvoiceTemplateComponent {

  constructor(
    private router: Router, 
  ) {
   
  }

  searchTerm = '';
  categories = ['All', 'Professional', 'Creative', 'Simple', 'Modern', 'Classic'];
  selectedCategory = 'All';

  templates: any[] = [
    {
      id: '1',
      name: 'Professional Classic',
      description: 'Clean and professional design for business use',
      preview: 'assets/templates-pictures/proffesional_template.png',
      tags: ['Business', 'Corporate', 'Clean'],
    },
    {
      id: '2',
      name: 'Modern Minimal',
      description: 'Contemporary design with minimal elements',
      preview: 'assets/templates-pictures/morderntemplate.png',
      tags: ['Modern', 'Minimal', 'Sleek'],
    
    }
   
  ];

  get filteredTemplates() {
    return this.templates.filter(template => {
      const matchesSearch = !this.searchTerm || 
        template.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        template.tags.some((tag: string) => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesCategory = this.selectedCategory === 'All' || 
        template.tags.includes(this.selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  useTemplate(template: any) {
    this.router.navigate(['/create-invoice', template.id]);
  }

  goBack(){
    this.router.navigate(['/invoices']);
  }

  selectedTemplate: any = null;

previewTemplate(template: any) {
  this.selectedTemplate = template;
}

closePreview() {
  this.selectedTemplate = null;
}

}
