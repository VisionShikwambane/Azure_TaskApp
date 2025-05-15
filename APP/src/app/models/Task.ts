export class Task {
  id: number;
  categoryID: number;  
  userID: string;
  title: string;
  description?: string;
  dueDate?: Date;
  isCompleted: boolean;
  priorityID: number;
  createdAt: Date;
  updatedAt: Date;
  priority?: Priority;
  user?: AppUser;
  category?: Category;

  constructor() {
    this.id = 0;
    this.categoryID = 0;
    this.userID = '';
    this.title = '';
    this.isCompleted = false;
    this.priorityID = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}


export class Priority {
  id: number;
  name: string;
  
  constructor() {
    this.id = 0;
    this.name = '';
  }
}

export class AppUser {
  id: string;
  constructor() {
    this.id = '';
  }
}

export class Category {
  id: number;
  name: string;
  
  constructor() {
    this.id = 0;
    this.name = '';
  }
}

