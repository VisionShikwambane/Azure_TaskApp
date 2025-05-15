import { Injectable } from '@angular/core';
import { ModernTemplateComponent } from '../invoice-templates/modern-template/modern-template.component';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templates = new Map([
    ['2', {
      id: '2',
      name: 'Modern Minimal',
      component: ModernTemplateComponent,
      preview: 'assets/templates-pictures/morderntemplate.png'
    }]
  ]);

  getTemplate(id: string) {
    return this.templates.get(id);
  }
}