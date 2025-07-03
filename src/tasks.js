class createTask {
  constructor(title, description, dueDate, priority, completed = false) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed; // ✅ added
  }

  getTitle() { return this.title; }
  setTitle(title) { this.title = title; }

  getDescription() { return this.description; }
  setDescription(description) { this.description = description; }

  getDueDate() { return this.dueDate; }
  setDueDate(dueDate) { this.dueDate = dueDate; }

  getPriority() { return this.priority; }
  setPriority(priority) { this.priority = priority; }

  isCompleted() { return this.completed; }
  setCompleted(value) { this.completed = value; }

  toString() {
    return `Task: ${this.title}, Description: ${this.description}, Due Date: ${this.dueDate}, Priority: ${this.priority}`;
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      completed: this.completed,
    };
  }
}

export default createTask;
