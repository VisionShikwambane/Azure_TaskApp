import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceSuccessDialogComponent } from '../invoice-success-dialog/invoice-success-dialog.component';
import { ReminderSettings } from '../../models/ReminderSettings';
import { EmailSettings } from '../../models/EmailSettings';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceDetails } from '../../models/InvoiceDetails';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../shared-components/toast';
import { DataService } from '../../services/DataService';
import { NgSelectModule } from '@ng-select/ng-select';



@Component({
    selector: 'app-create-invoice',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InvoiceSuccessDialogComponent, ToastComponent, NgSelectModule],
    templateUrl: './create-invoice.component.html',
    styleUrl: './create-invoice.component.css'
})
export class CreateInvoiceComponent implements OnInit {

  invoiceForm!: FormGroup;
  showPreview = false;
  isLoading = false;
  invoiceToEdit: InvoiceDetails | null = null;
  selectedTemplateId!: string;
  showSuccessDialog = false;
  activeTab: 'edit' | 'preview' = 'edit'; // Default to the edit tab
  sendInvoiceToEmail: string = '';
  selectedClient: any

  clients = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567', address: '123 Main St' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 987-6543', address: '456 Oak Ave' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 (555) 555-5555', address: '789 Pine Rd' },
  ];

  onClientSelect(client: any) {
    this.selectedClient = client;
  }


  reminderSettings: ReminderSettings = {
    enabled: true,
    remindWith: 'email',
    reminderType: '24hours'
  };

  emailSettings: EmailSettings = {
    to: '',
    subject: 'Invoice from Your Company',
    message: '',
    scheduleType: 'now',
    scheduledDate: new Date()
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private invoiceService: InvoiceService,
    private dataService: DataService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getInvoiceData();
    this.route.params.subscribe(params => {
      this.selectedTemplateId = params['templateId'];
    });
    

  }


  getInvoiceData() {
    this.dataService.currentData.subscribe(data => {
      this.invoiceToEdit = data;
    console.log("Invoice to edit:", this.invoiceToEdit)
      if (this.invoiceToEdit) {

        while (this.items.length) {
          this.items.removeAt(0);
        }

        const { items, ...mainFormData } = this.invoiceToEdit;
        this.invoiceForm.patchValue(mainFormData);
        // Add form groups for each item
        if (this.invoiceToEdit.items && Array.isArray(this.invoiceToEdit.items)) {
          this.invoiceToEdit.items.forEach(item => {
            const itemGroup = this.fb.group({
              description: [item.description],
              quantity: [item.quantity],
              price: [item.price]
            });

            // Add the valueChanges subscription
            itemGroup.valueChanges.subscribe(() => this.calculateTotals());

            this.items.push(itemGroup);
          });
        }



        this.invoiceForm.patchValue({
          subtotal: this.invoiceToEdit.subtotal,
          tax: this.invoiceToEdit.tax,
          total: this.invoiceToEdit.total
        });

        this.invoiceForm.get('dueDate')?.setValue(
          this.getFormattedDate(new Date(this.invoiceToEdit.dueDate))
        );
        this.invoiceForm.get('issueDate')?.setValue(
          this.getFormattedDate(new Date(this.invoiceToEdit.issueDate))
        );

        if (this.invoiceToEdit.companyLogo) {
          const logoUrl = `data:image/png;base64,${this.invoiceToEdit.companyLogo}`;
          this.invoiceForm.get('companyLogo')?.setValue(logoUrl);
          this.logoPreview = logoUrl;
        }

        if (this.invoiceToEdit.signatureImage) {
          const signatureUrl = `data:image/png;base64,${this.invoiceToEdit.signatureImage}`;
          this.invoiceForm.get('signatureImage')?.setValue(signatureUrl);
          this.signaturePreview = signatureUrl;
        }
      }
    });

  }






  getCurrentDate(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  options = ['Company A', 'Company B', 'Company C'];
  filteredOptions: string[] = [...this.options];
  showDropdown = false;

  filterDropdown(event?: Event): void {
    const input = (event?.target as HTMLInputElement)?.value || '';
    this.filteredOptions = this.options.filter(option =>
      option.toLowerCase().includes(input.toLowerCase())
    );
  }

  selectOption(option: string): void {
    const inputElement = document.querySelector('input[formControlName="companyName"]') as HTMLInputElement;
    inputElement.value = option;
    this.showDropdown = false;
  }

  hideDropdownWithDelay(): void {
    setTimeout(() => (this.showDropdown = false), 200);
  }

  getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private createForm() {
    this.invoiceForm = this.fb.group({
      id: [0],
      signatureImage: [''],
      signatureDate: [new Date()],
      invoiceNo: ['', Validators.required],
      issueDate: [this.getFormattedDate(new Date()), Validators.required],
      dueDate: ['', Validators.required],
      templateId: [0],
      clientId: [0],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyPhone: ['', Validators.required],
      companyLogo: [''],
      items: this.fb.array([]),
      taxRate: [10, [Validators.required, Validators.min(0), Validators.max(100)]], // Default 10% tax rate
      currency: ['USD', Validators.required],
      notes: [''],
      termsAndConditions: [''],
      subtotal: [0],
      tax: [0],
      total: [0]
    });

    this.addItem();
    this.invoiceForm.get('taxRate')?.valueChanges.subscribe(() => this.calculateTotals());
    this.invoiceForm.get('currency')?.valueChanges.subscribe(() => this.calculateTotals());
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    const itemGroup = this.fb.group({
      id: [0],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      amount: [{ value: 0, disabled: true }]
    });

    itemGroup.valueChanges.subscribe(() => this.calculateTotals());
    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.calculateTotals();
      console.log(this.invoiceForm.value)
    } else {
   
    }
  }

  



  calculateTotals() {
    const items = this.items.getRawValue();
    const taxRate = this.invoiceForm.get('taxRate')?.value || 0; // Get custom tax rate
    const subtotal = items.reduce((sum, item) => {
      const amount = item.quantity * item.price;
      this.items.at(items.indexOf(item)).patchValue({ amount }, { emitEvent: false });
      return sum + amount;
    }, 0);

    const tax = (subtotal * taxRate) / 100; // Use custom tax rate
    const total = subtotal + tax;

    this.invoiceForm.patchValue({
      subtotal,
      tax,
      total
    }, { emitEvent: false });


    console.log(this.invoiceForm)
  }



  togglePreview() {
    this.activeTab = 'preview';
  }

  logoPreview: string | ArrayBuffer | null = null;

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      // FileReader to generate preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result; // Set the preview data
        this.invoiceForm.get('companyLogo')?.setValue(this.logoPreview);
        console.log("Updated form:", this.logoPreview);
      };
      reader.readAsDataURL(file);
    }
  }


  onDetachLogo(fileInput: HTMLInputElement): void {
    this.logoPreview = null;
    fileInput.value = '';
  }






  async saveInvoice() {
    this.sendInvoiceToEmail = this.invoiceForm.get('client.email')?.value;
    if (this.invoiceForm.valid) {
      this.isLoading = true;
      try {
    
        const invoiceData: InvoiceDetails = this.invoiceForm.value;
        invoiceData.templateId = Number(this.selectedTemplateId);
        invoiceData.clientId = this.selectedClient.id;
        invoiceData.userId = 2;
        invoiceData.status = "Draft"
        const companyLogo = invoiceData.companyLogo.split(',')[1];
        const signatureImage = invoiceData.signatureImage.split(',')[1];
        invoiceData.companyLogo = companyLogo;
        invoiceData.signatureImage = signatureImage;

        console.log("Invoice data:", invoiceData);

        // if (this.invoiceToEdit) {
        //   invoiceData.id = this.invoiceToEdit.id;
        // }
        // const response = await this.invoiceService.createInvoice(invoiceData).toPromise();

        // if (response?.isSuccess) {
        //  // this.toast.showSuccess(response.message);

        //   if(this.invoiceToEdit){
        //     this.showSuccessDialog = false;
        //     this.toast.showSuccess("Invoice Draft Updated Successfully");
        //   }
        //   else{
        //     this.toast.showSuccess("Invoice Saved Updated Successfully");
        //     this.showSuccessDialog = true;
        //   }
        

        // } else {

        //   console.error('Failed to save invoice:', response?.message);

        // }
      } catch (error: any) {

        console.error('Error saving invoice:', error.message);

      } finally {

        this.isLoading = false;
      }
    } else {
     
      this.markFormGroupTouched(this.invoiceForm);
    }
  }






  closeSuccessDialog() {
   // this.router.navigate(['/invoices']);
    this.formReset();
    this.activeTab = 'edit';
    this.showSuccessDialog = false;
  }

  private formReset() {
    this.invoiceForm.reset();
    this.createForm();
    this.logoPreview = null;
    this.signaturePreview = null;
    this.dataService.changeData(null);
  }

  handleSuccessFinish(data: { email: EmailSettings }) {

    if (data.email) {
      this.sendInvoiceEmail(data.email);
    }
    this.showSuccessDialog = false;
    this.router.navigate(['/invoices']);
  }


  private async sendInvoiceEmail(emailSettings: any) {
    try {
      // Your email sending logic
      emailSettings.to = this.invoiceForm.get('client.email')?.value;
      console.log('Sending email...', emailSettings);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  printInvoice() {

  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Mock delay for save operation
  private mockSaveDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  goBack() {
    if (this.invoiceToEdit) {
      this.formReset()
      this.router.navigate(['/invoices']);
     

    }
    else {
      this.formReset()
      this.router.navigate(['/templates']);
     
    }

  }



  signaturePreview: string | null = null;

  onSignatureSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.signaturePreview = fileReader.result as string;
        this.invoiceForm.get('signatureImage')?.setValue(this.signaturePreview);

      };
      fileReader.readAsDataURL(input.files[0]);
    }
  }

  onRemoveSignature(input: HTMLInputElement) {
    this.signaturePreview = null;
    input.value = ''; // Clear the file input
  }









}



