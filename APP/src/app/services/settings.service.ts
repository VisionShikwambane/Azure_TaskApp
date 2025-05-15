import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InvoiceDetails } from '../models/InvoiceDetails';
import { BaseService } from './baseService';
import { Setting } from '../models/Settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService extends BaseService<Setting> {

  protected route = 'settings';

  constructor(http: HttpClient) {
    super(http);
  }


}
