import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './baseService';
import { Task } from '../models/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends BaseService<Task> {

  protected route = 'Task';

  constructor(http: HttpClient) {
    super(http);
  }


}
