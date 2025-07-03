import { displayProjects } from "./dom.js";
import Project from "./projects.js";
import { displayTasks } from "./dom.js";
import { getCurrentProject, setCurrentProject} from "./state.js";
import { populateLocalStorage } from "./localStorage.js";

export const projects = [];

export function setupAddProjectButton() {
    const addProjectButton = document.querySelector('.add-project-button');
    const projectInput = document.querySelector('.project-input');
    addProjectButton.addEventListener('click', () =>{
        if(projectInput!=null){
            const projectName = projectInput.value.trim();
            if (projectName) {
                const newProject = new Project(projectName); // Create a new project with the name
                projects.push(newProject); // assuming Project is a class that takes a name
                setCurrentProject(newProject); // ✅ set as current
                projectInput.value = '';
                console.log(`Project added: ${projectName}`);

                displayProjects();
                populateLocalStorage(projects); // Save updated projects array
            } else {
                console.log('Please enter a valid project name.');
            }
        }

    });
}

export function setupEditProjectButtons() {
    document.querySelectorAll('.edit-project-button').forEach((button) => {
        button.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            const index = parseInt(button.id.replace('edit-button', ''), 10);
            if (!isNaN(index)) {
                const project = projects[index];
                const input = document.querySelector('#project-title-input');
                const dialogEditTitle = document.querySelector('#edit-title-dialog');
                input.value = project.getTitle();
                dialogEditTitle.showModal();

                const form = document.querySelector('#edit-title-form');
                form.onsubmit = (e) => {
                    e.preventDefault();
                    const newTitle = input.value.trim();
                    if (newTitle) {
                        project.setTitle(newTitle);
                        displayProjects(); // will re-attach listeners
                        dialogEditTitle.close();

                        populateLocalStorage(projects); // Save updated projects array
                    } else {
                        console.log('Invalid title');
                    }
                };

            }
        });
    });
}


export function setupDeleteProjectButtons() {
    document.querySelectorAll('.delete-project-button').forEach((button) => {
        button.addEventListener('click', (element) => {
            const button = element.target.closest('button');
            const index = parseInt(button.id.replace('button', ''), 10);
            if (!isNaN(index)) {
                projects.splice(index, 1);
                displayProjects();
                populateLocalStorage(projects); // Save updated projects array
            }
            if (projects.length === 0) {
                setCurrentProject(null); // Clear current project if no projects left
                displayTasks(null); // Clear tasks display
                populateLocalStorage(projects); // Save updated projects array
            }
            console.log(`Project at index ${index} deleted.`);
        });

    });
}

export function dialogButtons() {
    const addTaskButton = document.querySelector('.add-todo-button');
    const dialog = document.querySelector("#add-todo-dialog");
    const form = document.querySelector("#add-task-form");

    const titleInput = document.querySelector('#todo-title');
    const descriptionInput = document.querySelector('#todo-description');
    const dateInput = document.querySelector('#todo-date');
    const priorityInput = document.querySelector('#priority');

    const editModeInput = document.querySelector('#edit-mode');
    const editIndexInput = document.querySelector('#edit-index');

    addTaskButton.addEventListener('click', () => {
        if (getCurrentProject() == null) {
            alert("Please add a project first.");
            return;
        }

        // Reset form
        form.reset();
        editModeInput.value = "add"; // Set to add mode
        editIndexInput.value = "";

        dialog.showModal();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) return;

        const mode = editModeInput.value;
        const taskTitle = titleInput.value;
        const taskDescription = descriptionInput.value;
        const taskDueDate = dateInput.value;
        const taskPriority = priorityInput.value;

        const currentProject = getCurrentProject();

        if (mode === "edit") {
            const index = parseInt(editIndexInput.value, 10);
            const task = currentProject.getTasks()[index];
            if (task) {
                task.setTitle(taskTitle);
                task.setDescription(taskDescription);
                task.setDueDate(taskDueDate);
                task.setPriority(taskPriority);
            }
        } else {
            // Default mode: add
            currentProject.addTask(taskTitle, taskDescription, taskDueDate, taskPriority);
        }

        form.reset();
        dialog.close();
        displayTasks(currentProject);
        populateLocalStorage(projects); // Save updated projects array
    });

    // Close button
    document.querySelector('#close-dialog-button').addEventListener('click', () => {
        form.reset();
        dialog.close();
    });
}


export function editTask(index) {
    const task = getCurrentProject().getTasks()[index];
    if (!task) return;

    const dialog = document.querySelector('#add-todo-dialog');

    // Prefill form
    document.querySelector('#todo-title').value = task.getTitle();
    document.querySelector('#todo-description').value = task.getDescription();
    document.querySelector('#todo-date').value = task.getDueDate();
    document.querySelector('#priority').value = task.getPriority();

    // ✅ Set mode to edit
    document.querySelector('#edit-mode').value = 'edit';
    document.querySelector('#edit-index').value = index;

    dialog.showModal();

}