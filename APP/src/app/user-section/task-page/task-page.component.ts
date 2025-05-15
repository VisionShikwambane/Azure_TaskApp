import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/Task.service';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { SpinnerComponent } from '../../shared-components/spinner/spinner.component';
import { ConfirmDialogComponent } from '../../shared-components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../shared-components/toast';
import { DataService } from '../../services/DataService';

import { Category, Priority, Task } from '../../models/Task';




interface InvoiceActivity {
  id: string;
  type: 'email_opened' | 'invoice_viewed' | 'invoice_downloaded' | 'reminder_sent' | 'status_changed';
  timestamp: string;
  details?: string;
}

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [CommonModule, FormsModule, OverlayModule, PortalModule, ConfirmDialogComponent, SpinnerComponent, ToastComponent],
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css'],
})
export class TaskPageComponent implements OnInit {
  selectedStatus: string = 'All';
  searchTerm: string = '';

  openDropdownId: string | null = null;
  @ViewChild(CdkOverlayOrigin) overlayOrigin!: CdkOverlayOrigin;
  isModalOpen = false;
  loading = false;
  amount!: number;
  showArchived: boolean = false;
  totalPages: number = 0;
  currentPage: number = 1;
  filteredTasks: any[] = [];
  paginatedTasks: any[] = [];
  taskToEdit: Task | null = null;
  isAddTaskPopupOpen: boolean = false;
  tasks: Task[] = [];
  newTask: Task = new Task();
  showValidation: boolean = false;
  dueDateString: string = '';


  priorities: Priority[] = [
    { id: 1, name: 'Low' },
    { id: 2, name: 'Medium' },
    { id: 3, name: 'High' },
  ];

  categories: Category[] = [
    { id: 1, name: 'Work' },
    { id: 2, name: 'Personal' },
    { id: 3, name: 'Urgent' },
  ];

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private toastService: ToastService,
    private dataService: DataService,

  ) {
    this.filteredTasks = this.tasks;
  }
  ngOnInit(): void {

   
    this.getTasks();


  }

  createTask = () => {
    this.taskToEdit = null;
    this.newTask = new Task();
    this.dueDateString = '';
    this.newTask.categoryID = 0;
    this.isAddTaskPopupOpen = true;

  }

  onTaskCreated(task: any) {
    this.filteredTasks.push(task);
    this.paginatedTasks.push(task);
    //this.updatePagination();
  }

  nextPage() {

  }
  previousPage() {

  }


  getTasks() {
    this.loading = true;
    this.taskService.getAll().subscribe(
      (tasks: Task[]) => {
        console.log('Raw tasks from API:', tasks);
        this.tasks = tasks.map(task => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          priority: this.priorities.find(p => p.id === task.priorityID) || undefined,
          category: this.categories.find(c => c.id === task.categoryID) || undefined,
        }));
        console.log('Mapped tasks:', this.tasks[0].category);
        this.filteredTasks = this.tasks;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        this.loading = false;
      }
    );
  }

  onSearch(event: Event): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter(task =>
      task.id.toString().includes(term) ||
      task.title.toLowerCase().includes(term) ||
      (task.description?.toLowerCase().includes(term) || false) ||
      (task.category?.name.toLowerCase().includes(term) || false)
    );
  }


editTask(task: Task) {
  // Create a copy of the task for editing
  this.taskToEdit = task;
  this.newTask = new Task();
  Object.assign(this.newTask, task);
  
  // Format the date string for the date input
  if (task.dueDate) {
    // Convert the date to YYYY-MM-DD format required by the date input
    const date = new Date(task.dueDate);
    
    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    this.dueDateString = `${year}-${month}-${day}`;
  } else {
    this.dueDateString = '';
  }
  
  this.showValidation = false;
  this.isAddTaskPopupOpen = true;
}



  confirmDelete(task: Task) {
    const confirmed = confirm(`Are you sure you want to delete the task: "${task.title}"?`);

    if (confirmed) {
      this.deleteTask(task);
    } else {
      console.log('Deletion cancelled.');
    }
  }


  toggleCompleted = () => {

  }

  closeTaskModal() {
    this.isAddTaskPopupOpen = false;
    this.taskToEdit = null;
    this.newTask = new Task();
    this.dueDateString = '';
    this.showValidation = false;
  }

  onSubmitTask() {
    if (!this.newTask.title) {
      this.showValidation = true;
      this.toastService.showError('Title is required');
      return;
    }

    this.newTask.dueDate = this.dueDateString ? new Date(this.dueDateString) : undefined;
    if (this.newTask.dueDate && isNaN(this.newTask.dueDate.getTime())) {
      this.newTask.dueDate = undefined;
    }

    // Convert string IDs to numbers
    this.newTask.priorityID = this.newTask.priorityID ? Number(this.newTask.priorityID) : 0;
    this.newTask.categoryID = this.newTask.categoryID ? Number(this.newTask.categoryID) : 0;

    // Set user ID for new tasks
    if (!this.newTask.id) {
      this.newTask.userID = "testUser";
    }

    console.log('Submitting task:', this.newTask);
    this.loading = true;

    // Determine if we're updating an existing task or creating a new one
    const isEditing = !!this.newTask.id;

    this.taskService.saveRecord(this.newTask).subscribe(
      (response) => {
        const savedTask: Task = response.data;

   
        // Add priority and category objects to the saved task
        const processedTask = {
          ...savedTask,
          priority: this.priorities.find(p => p.id === savedTask.priorityID) || undefined,
          category: this.categories.find(c => c.id === savedTask.categoryID) || undefined,
        };

        if (isEditing) {
          // Update the existing task in the arrays
          this.tasks = this.tasks.map(task =>
            task.id === savedTask.id ? processedTask : task
          );
          this.filteredTasks = this.filteredTasks.map(task =>
            task.id === savedTask.id ? processedTask : task
          );
          this.toastService.showSuccess('Task updated successfully');
        } else {

          this.tasks.push(processedTask);
          this.filteredTasks = [...this.tasks];
          this.toastService.showSuccess('Task created successfully');
        }

        this.closeTaskModal();
        this.loading = false;
      },
      (error) => {
        this.toastService.showError(isEditing ? 'Failed to update task' : 'Failed to create task');
        console.error(isEditing ? 'Error updating task:' : 'Error creating task:', error);
        this.loading = false;
      }
    );
  }








  deleteTask(task: Task) {
    this.loading = true;
    this.taskService.deleteRecord(task.id).subscribe(
      () => {

        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.filteredTasks = this.filteredTasks.filter(t => t.id !== task.id);

        // Show success message
        this.toastService.showSuccess('Task deleted successfully');
        this.loading = false;
      },
      (error) => {
        console.error('Error deleting task:', error);
        this.toastService.showError('Failed to delete task');
        this.loading = false;
      }
    );
  }







}
