import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceDetails } from '../../models/InvoiceDetails';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { SpinnerComponent } from '../../shared-components/spinner/spinner.component';
import { ConfirmDialogComponent } from '../../shared-components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../shared-components/toast';
import { DataService } from '../../services/DataService';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SoundService } from '../../services/sound.service';


interface InvoiceActivity {
  id: string;
  type: 'email_opened' | 'invoice_viewed' | 'invoice_downloaded' | 'reminder_sent' | 'status_changed';
  timestamp: string;
  details?: string;
}

@Component({
  selector: 'app-invoice-page',
  standalone: true,
  imports: [CommonModule, FormsModule, OverlayModule, PortalModule, ConfirmDialogComponent, SpinnerComponent, ToastComponent],
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.css'],
})
export class InvoicePageComponent implements OnInit {
  selectedStatus: string = 'All';
  searchTerm: string = '';
  invoices: InvoiceDetails[] = []
  openDropdownId: string | null = null;
  @ViewChild(CdkOverlayOrigin) overlayOrigin!: CdkOverlayOrigin;
  selectedInvoice: InvoiceDetails | null = null;
  isModalOpen = false;
  loading = false;
  amount!: number;
  showArchived: boolean = false; 
  
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  constructor(
    private router: Router,
    private invoiceService: InvoiceService,
    private toastService: ToastService,
    private dataService: DataService,
    private soundService: SoundService
  ) {

  }
  ngOnInit(): void {
    this.getUserInvoices();
    //this.toastService.showSuccess('Operation completed');
    // this.toastService.showError('Something went wrong');
    this.toastService.showInfo('New updates available');
    
   
  }





  formatAmount(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  onCancelDelete() {
    console.log('Cancelled delete');
  }


  formatActivityTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    return this.formatDate(timestamp);
  }

  getUserInvoices() {
  
    
    this.invoiceService.getAll().subscribe({
      next: (data) => {
       
        
        if (data && Array.isArray(data)) {

          console.log("Retrieved Invoices", data);
          
          this.invoices = data.map((invoice: any) => {
            const subtotal = Array.isArray(invoice.items)
              ? invoice.items.reduce(
                  (acc: number, item: any) => 
                    acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
                  0
                )
              : 0;
              
            // Calculate tax if taxRate exists
            const taxAmount = invoice.taxRate 
              ? subtotal * (Number(invoice.taxRate) / 100) 
              : 0;
              
            const amount = subtotal + taxAmount;
            
            return { ...invoice, amount, subtotal, taxAmount };
          });
          
          console.log("Processed Invoices", this.invoices);
        } else {
          console.warn("No invoices found or invalid data format");
          this.invoices = [];
        }
      },
      error: (error: any) => {
       
        console.error("Error fetching invoices:", error);
       
      },
      complete: () => {
        // Optional: Any cleanup needed when the observable completes
      }
    });
  }
  


  ArchiveInvoice(invoice: InvoiceDetails): void {
  //   invoice.isArchived = !invoice.isArchived;
    
  //   this.invoiceService.archiveInvoice(invoice).subscribe({
  //     next: (response) => {
  //         if (response?.isSuccess) {
  //             this.toastService.showSuccess(response.message);
  //         } else {
  //             invoice.isArchived = !invoice.isArchived; // revert if failed
  //             this.toastService.showError('Failed to archive invoice');
  //         }
  //     },
  //     error: (error: HttpErrorResponse) => {
  //         invoice.isArchived = !invoice.isArchived; // revert if error
  //         console.error('Error archiving invoice:', error);
  //         this.toastService.showError(error.message || 'Failed to archive invoice');
  //     }
  // });
  
  }


  async updateStatus(invoice: InvoiceDetails, status: string) {
  // try {

  //   invoice.status = status;
  //   const response = await lastValueFrom(this.invoiceService.updateStatus(invoice));

  //   if(response?.isSuccess){
  //     this.toastService.showSuccess(response.message);
  //   }
  //   else{

  //     this.toastService.showError('Failed to archive invoice');
  //   }

  // } catch (error) {

  //   console.log('Error archiving invoice:', error);
    
  // }
 
  
}






  getStatusClass(status: string): string {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'Paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Sent':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Viewed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Downloaded':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      case 'Draft':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-neutral-100 text-neutral-800`;
    }
  }


  filterByStatus(status: string) {
    this.selectedStatus = status;
    // Implement filtering logic if necessary
  }



 // Change this from true to false

  filterArchived() {
    this.showArchived = !this.showArchived;  // Toggle between archived and non-archived view
    this.currentPage = 1;  // Reset to first page when switching views
  }

  createInvoice() {
    // Logic for creating a new invoice
    this.router.navigate(['/templates']);
  }

  currentPage = 1;
  itemsPerPage = 6; // Show 9 items per page

  get filteredInvoices(): InvoiceDetails[] {
    if (!this.invoices) return [];
  
    return this.invoices.filter(invoice => {
      // First filter by archived status
      if (invoice.isArchived !== this.showArchived) {
        return false;
      }
  
      // Then apply status filter
      if (this.selectedStatus !== 'All' && 
          invoice.status?.toLowerCase() !== this.selectedStatus.toLowerCase()) {
        return false;
      }
  
      // Finally apply search filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return (
          invoice.client?.name?.toLowerCase().includes(searchLower) ||
          invoice.id?.toString().toLowerCase().includes(searchLower) ||
          invoice.total?.toString().toLowerCase().includes(searchLower)
        );
      }
  
      return true;
    });
  }
  
  

  get paginatedInvoices(): InvoiceDetails[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredInvoices.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredInvoices.length / this.itemsPerPage);
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.currentPage = 1; // Reset to first page when searching
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  overlayPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 8
    }
  ];

  toggleDropdown(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  closeDropdown() {
    this.openDropdownId = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.openDropdownId) {
      this.closeDropdown();
    }
  }

  editInvoice(InvoiceDetails: InvoiceDetails) {

    if(InvoiceDetails.status != 'Draft'){
    this.toastService.showInfo('Only Draft invoices can be edited');
    return; 
    }
    //console.log("Invoice Details",InvoiceDetails);
    this.dataService.changeData(InvoiceDetails);
    this.router.navigate([`/create-invoice/${InvoiceDetails.id}`]);
  }

  markAsPaid(invoice: InvoiceDetails) {
    // this.openDropdownId = null;
    // // Update the invoice status
    // this.invoiceService.updateInvoiceStatus(invoice.id, 'paid').subscribe({
    //   next: () => {
    //     // Refresh the invoices list
    //     this.getUserInvoices();
    //   },
    //   error: (error) => {
    //     console.error('Error marking invoice as paid:', error);
    //   }
    // });
  }

  showDialog = false;

  async deleteInvoice(invoice: InvoiceDetails) {
    // try {
    //   const response = await lastValueFrom(this.invoiceService.deleteInvoice(invoice.id));
  
    //   if(response?.isSuccess){
    //     this.invoices = this.invoices.filter(inv => inv.id !== invoice.id);
    //     this.toastService.showSuccess("Invoice Deleted Successfully");
    //   }
    //   else{
  
    //     this.toastService.showError('Failed to archive invoice');
    //   }
  
    // } catch (error) {
  
    //   console.log('Error archiving invoice:', error);
      
    // }
   
  }

  openConfirmationDialog(InvoiceDetails: InvoiceDetails) {
    this.confirmDialog.show(
      'Confirm Delete',
      'Are you sure you want to delete this invoice?',
      () => this.deleteInvoice(InvoiceDetails),
      () => this.cancelClear()
    );
  }
  clear() {
    console.log("Invoice Deleted");
   }
  cancelClear() {""}


  sendReminder(invoice: InvoiceDetails) {
    // this.invoiceService.sendReminder(invoice.id).subscribe({
    //   next: () => {
    //     // You might want to show a success message here
    //     console.log('Reminder sent successfully');
    //   },
    //   error: (error) => {
    //     console.error('Error sending reminder:', error);
    //   }
    // });
  }

  viewInvoiceDetails(invoice: InvoiceDetails) {
    // Add hardcoded activities for demonstration
    const mockActivities: InvoiceActivity[] = [
      {
        id: '1',
        type: 'email_opened' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        details: 'Email opened by client'
      },
      {
        id: '2',
        type: 'invoice_viewed' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        details: 'Invoice viewed online'
      },
      {
        id: '3',
        type: 'invoice_downloaded' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
        details: 'Invoice PDF downloaded'
      },
      {
        id: '4',
        type: 'reminder_sent' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        details: 'Payment reminder email sent'
      },
      {
        id: '5',
        type: 'status_changed' as const,
        timestamp: new Date().toISOString(), // now
        details: 'Invoice status changed to Pending'
      }
    ];

    this.selectedInvoice = {
      ...invoice,
      activities: mockActivities
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedInvoice = null;
  }

  // Get payment status with proper styling
  getPaymentStatusStyle(status: string): { color: string; backgroundColor: string } {
    switch (status.toLowerCase()) {
      case 'paid':
        return { color: 'rgb(34 197 94)', backgroundColor: 'rgb(220 252 231)' };
      case 'pending':
        return { color: 'rgb(234 179 8)', backgroundColor: 'rgb(254 249 195)' };
      case 'overdue':
        return { color: 'rgb(239 68 68)', backgroundColor: 'rgb(254 226 226)' };
      default:
        return { color: 'rgb(107 114 128)', backgroundColor: 'rgb(243 244 246)' };
    }
  }

  getActivityIconClass(type: string): string {
    const baseClass = 'bg-blue-500';
    switch (type) {
      case 'email_opened':
        return 'bg-green-500';
      case 'invoice_viewed':
        return 'bg-blue-500';
      case 'invoice_downloaded':
        return 'bg-purple-500';
      case 'reminder_sent':
        return 'bg-yellow-500';
      case 'status_changed':
        return 'bg-indigo-500';
      default:
        return baseClass;
    }
  }

  getActivityDescription(activity: InvoiceActivity): string {
    // If details are provided, use them
    if (activity.details) {
      return activity.details;
    }

    // Otherwise, use default descriptions
    switch (activity.type) {
      case 'email_opened':
        return 'Invoice email was opened';
      case 'invoice_viewed':
        return 'Invoice was viewed online';
      case 'invoice_downloaded':
        return 'Invoice was downloaded';
      case 'reminder_sent':
        return 'Payment reminder was sent';
      case 'status_changed':
        return 'Invoice status was updated';
      default:
        return 'Activity recorded';
    }
  }


  async downloadInvoicePdf(invoice: InvoiceDetails) {
     

    // if (this.loading) return;
  
    // this.loading = true;
    
    // try {
    //   const blob = await lastValueFrom(this.invoiceService.generateInvoicePdf(invoice.id));
      
    //   const url = window.URL.createObjectURL(blob);
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.download = `invoice-${invoice.id}.pdf`;
    //   document.body.appendChild(link);
    //   link.click();
      
    //   document.body.removeChild(link);
    //   window.URL.revokeObjectURL(url);
      
    //   this.toastService.showSuccess('PDF downloaded successfully');
    // } catch (error) {
    //   console.error('Error downloading PDF:', error);
    //   this.toastService.showError('Failed to download PDF');
    // } finally {
    //   this.loading = false;
    // }
  }

  sendInvoice(Invoice: InvoiceDetails) {
    this.toastService.showInfo('Invoice sent successfully');

  }


}
