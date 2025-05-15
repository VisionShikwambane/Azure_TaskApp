import { RouterModule, Routes } from '@angular/router';
import { UserSectionComponent } from './user-section/user-section.component';
import { LoginComponent } from './user-section/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: UserSectionComponent,
    children: [
      { path: '', redirectTo: 'invoices', pathMatch: 'full' },
      { path: 'tasks', loadComponent: () => import("./user-section/task-page/task-page.component").then(c => c.TaskPageComponent) },
     // { path: 'clients', loadComponent: () => import("./user-section/clients/clients.component").then(c => c.ClientsComponent) },
      { path: 'dashboard', loadComponent: () => import("./user-section/dashboard/dashboard.component").then(c => c.DashboardComponent) },

    
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
   
  },

 
  
  


];

