import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InvoiceDetails } from '../models/InvoiceDetails';
import { BaseService } from './baseService';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService extends BaseService<InvoiceDetails> {

  protected route = 'Invoice';

  constructor(http: HttpClient) {
    super(http);
  }


}
