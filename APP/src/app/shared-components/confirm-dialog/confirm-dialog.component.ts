import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

  @Input() title: string = '';
  @Input() message: string = '';
  @Output() confirmClick = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  isConfirmPopupVisible: boolean = false;
  private confirmCallback: (() => void) | null = null;
  private onCloseCallback: (() => void) | null = null;

  show(title: string, message: string, callback: () => void, onClose?: () => void) {
      this.title = title;
      this.message = message;
      this.isConfirmPopupVisible = true;
      this.confirmCallback = callback;
       if(onClose){
           this.onCloseCallback = onClose;
      }

  }

  hide() {
      this.isConfirmPopupVisible = false;
  }

  confirmClicked() {
      if (this.confirmCallback) {
          this.confirmCallback();
      }
      this.hide();
  }

  onPopupHiding() {
      if (this.onCloseCallback) {
          this.onCloseCallback();
          this.onCloseCallback = null;
      }
      this.hide();
  }


}
