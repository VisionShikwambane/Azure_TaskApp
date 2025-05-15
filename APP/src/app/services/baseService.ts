import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseObject } from '../models/ResponseObject';

@Injectable({
  providedIn: 'root',
})

export abstract class BaseService<T> {



  protected baseUrl =environment.apiUrl;
  protected abstract route: string;

  constructor(protected http: HttpClient) {}

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${this.route}`);
    
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.route}/${id}`);
  }

  saveRecord(model: T): Observable<ResponseObject<T>> {
    return this.http.post<ResponseObject<T>>(`${this.baseUrl}/${this.route}`, model);
  }

  deleteRecord(id: number): Observable<ResponseObject<void>> {
    return this.http.delete<ResponseObject<void>>(`${this.baseUrl}/${this.route}/${id}`);
  }

  customGet(additionalPath: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.route}/${additionalPath}`);
  }

  saveRecords(models: T[]): Observable<ResponseObject<T[]>> {
    return this.http.post<ResponseObject<T[]>>(`${this.baseUrl}/${this.route}/SaveRange`, models);
  }


  deleteRange(ids: number[]): Observable<ResponseObject<void>> {
    return this.http.request<ResponseObject<void>>('delete', `${this.baseUrl}/${this.route}/DeleteRange`, { body: ids });
  }


  
}

