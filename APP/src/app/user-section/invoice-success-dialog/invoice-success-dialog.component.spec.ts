import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSuccessDialogComponent } from './invoice-success-dialog.component';

describe('InvoiceSuccessDialogComponent', () => {
  let component: InvoiceSuccessDialogComponent;
  let fixture: ComponentFixture<InvoiceSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceSuccessDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
