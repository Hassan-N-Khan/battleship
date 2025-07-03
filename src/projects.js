import createTask from "./tasks";

class Project{

    constructor(title) {
        this.title = title;
    }
    
    getTitle() {
        return this.title;
    }
    setTitle(title) {
        this.title = title;
    }
    
    addTask(title, description, dueDate, priority) {
        if (!this.tasks) {
            this.tasks = [];
        }
        const task = new createTask(title, description, dueDate, priority, false); // default completed to false
        this.tasks.push(task);
    }
    getTasks() {
        return this.tasks || [];
    }
    removeTask(index) {
        if (this.tasks && index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
        }
    }
    clearTasks() {
        this.tasks = [];
    }

}

export default Project;