import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-invoice-success-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './invoice-success-dialog.component.html',
    styleUrl: './invoice-success-dialog.component.css'
})
export class InvoiceSuccessDialogComponent {
  @Input() show = false;
  @Input() invoiceDetails: { number: string; client: string; amount: number; dueDate: Date } = {
    number: 'INV-001',
    client: 'Masingita Pty',
    amount: 1000.00,
    dueDate: new Date()
  };
  @Input() sendInvoiceToEmail = '';
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onAction = new EventEmitter<{ action: string, email?: string }>();

  showEmailInput = false;

  onActionClick(action: string) {
    if (action === 'send') {
      this.showEmailInput = true;
    } else if (action === 'saveDraft' || action === 'download') {
      this.onAction.emit({ action });
      this.showEmailInput = false; // Reset the email input if it was shown
    }
  }

  confirmSend() {
    if (this.isValidEmail(this.sendInvoiceToEmail)) {
      this.onAction.emit({ action: 'send', email: this.sendInvoiceToEmail });
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}