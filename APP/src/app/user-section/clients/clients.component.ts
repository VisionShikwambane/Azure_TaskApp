import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})




export class ClientsComponent {



  // Client data
  clients: Client[] = [];
  filteredClients: Client[] = [];

  // Search and sorting
  searchQuery: string = '';
  sortOption: string = 'nameAsc';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // Modal state
  showClientModal: boolean = false;
  editingClient: boolean = false;
  currentClient: Client = this.getEmptyClient();

  // For template use
  Math = Math;

  constructor() { }

  ngOnInit(): void {
    this.loadClients();
    this.filterClients();
  }

  loadClients(): void {
    // In a real app, this would load from an API or service
    // For demo purposes, we'll use some sample data
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      try {
        // Parse the JSON string and convert date strings back to Date objects
        const parsedClients = JSON.parse(savedClients);
        this.clients = parsedClients.map((client: any) => ({
          ...client,
          dateAdded: new Date(client.dateAdded)
        }));
      } catch (e) {
        console.error('Error parsing clients from localStorage', e);
        this.clients = this.getSampleClients();
      }
    } else {
      this.clients = this.getSampleClients();
    }
  }

  getSampleClients(): Client[] {
    return [
      {
        id: this.generateId(),
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, Suite 200, New York, NY 10001',
        dateAdded: new Date(2023, 5, 15)
      },
      {
        id: this.generateId(),
        name: 'Global Industries',
        email: 'info@globalindustries.com',
        phone: '+1 (555) 987-6543',
        address: '456 Park Ave, Chicago, IL 60601',
        dateAdded: new Date(2023, 6, 22)
      },
      {
        id: this.generateId(),
        name: 'Tech Solutions Ltd',
        email: 'support@techsolutions.com',
        phone: '+1 (555) 765-4321',
        address: '789 Innovation Way, San Francisco, CA 94105',
        dateAdded: new Date(2023, 7, 3)
      },
      {
        id: this.generateId(),
        name: 'Tech Solutions Ltd',
        email: 'support@techsolutions.com',
        phone: '+1 (555) 765-4321',
        address: '789 Innovation Way, San Francisco, CA 94105',
        dateAdded: new Date(2023, 7, 3)
      }
    ];
  }

  filterClients(): void {
    if (!this.searchQuery) {
      this.filteredClients = [...this.clients];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredClients = this.clients.filter(client => 
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.toLowerCase().includes(query) ||
        client.address.toLowerCase().includes(query)
      );
    }

    this.sortClients();
    this.updatePagination();
  }

  sortClients(): void {
    switch(this.sortOption) {
      case 'nameAsc':
        this.filteredClients.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        this.filteredClients.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'recent':
        this.filteredClients.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
        break;
      default:
        this.filteredClients.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredClients.length / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageArray(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      // Adjust if at the start or end
      if (this.currentPage <= 2) {
        endPage = 4;
      } else if (this.currentPage >= this.totalPages - 1) {
        startPage = this.totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < this.totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  openClientModal(client?: Client): void {
    if (client) {
      // Edit existing client
      this.editingClient = true;
      this.currentClient = { ...client };
    } else {
      // Add new client
      this.editingClient = false;
      this.currentClient = this.getEmptyClient();
    }
    this.showClientModal = true;
  }

  closeClientModal(): void {
    this.showClientModal = false;
  }

  saveClient(): void {
    if (!this.currentClient.name || !this.currentClient.email) {
      return; // Basic validation
    }

    if (this.editingClient) {
      // Update existing client
      const index = this.clients.findIndex(c => c.id === this.currentClient.id);
      if (index !== -1) {
        this.clients[index] = { ...this.currentClient };
      }
    } else {
      // Add new client
      const newClient: Client = {
        ...this.currentClient,
        id: this.generateId(),
        dateAdded: new Date()
      };
      this.clients.push(newClient);
    }

    // Save to localStorage (in a real app, this would be an API call)
    this.saveClientsToStorage();
    
    // Update filtered list and close modal
    this.filterClients();
    this.closeClientModal();
  }

  deleteClient(client: Client): void {
    if (confirm(`Are you sure you want to delete ${client.name}?`)) {
      this.clients = this.clients.filter(c => c.id !== client.id);
      this.saveClientsToStorage();
      this.filterClients();
    }
  }

  saveClientsToStorage(): void {
    localStorage.setItem('clients', JSON.stringify(this.clients));
  }

  getEmptyClient(): Client {
    return {
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      dateAdded: new Date()
    };
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateAdded: Date;
}
