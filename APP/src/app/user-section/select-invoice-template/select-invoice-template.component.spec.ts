import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInvoiceTemplateComponent } from './select-invoice-template.component';

describe('SelectInvoiceTemplateComponent', () => {
  let component: SelectInvoiceTemplateComponent;
  let fixture: ComponentFixture<SelectInvoiceTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInvoiceTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectInvoiceTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
