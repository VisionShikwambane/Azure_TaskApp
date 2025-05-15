import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';  // Added 'info' to the type union
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastState = new BehaviorSubject<ToastState>({
    show: false,
    message: '',
    type: 'success'
  });

  toastState$ = this.toastState.asObservable();

  showSuccess(message: string) {
    this.toastState.next({
      show: true,
      message,
      type: 'success'
    });
  }

  showError(message: string) {
    this.toastState.next({
      show: true,
      message,
      type: 'error'
    });
  }

  showInfo(message: string) {  // Added new method for info toasts
    this.toastState.next({
      show: true,
      message,
      type: 'info'
    });
  }

  hide() {
    this.toastState.next({
      ...this.toastState.value,
      show: false
    });
  }
}