import { setupDeleteProjectButtons } from "./buttons.js";
import {projects} from "./buttons.js";
import deleteIcon from '../images/deleteButton.png';
import editIcon from '../images/editIcon.png';
import { getCurrentProject, setCurrentProject } from "./state.js";
import { setupEditProjectButtons, editTask} from "./buttons.js";
import { populateLocalStorage } from "./localStorage.js";

export function displayProjects() {
    const projectList = document.querySelector('.project-list');
    projectList.innerHTML = ""; // clear previous projects
    const projectTitleHeader = document.querySelector('.project-title');

    projects.forEach((element, index) => {
        const projectItem = document.createElement("div");
        projectItem.classList.add("project-item");

        projectItem.innerHTML = `<button id="project${index}" class="project-title-button"><span class="project-title">${element.getTitle()}</span></button>
                <button class="edit-project-button" id="edit-button${index}"><img src="${editIcon}" alt="create-new"/></button>
                <button class="delete-project-button" id="button${index}"><img src="${deleteIcon}"></button>`;
        projectList.appendChild(projectItem);
    });

    document.querySelectorAll('.project-title-button').forEach((button) => {

        button.addEventListener('click', (element) => {
            const button = element.target.closest('button');
            const index = parseInt(button.id.replace('project', ''), 10);
            if (!isNaN(index)) {
                setCurrentProject(projects[index]);

                console.log("Current project:", getCurrentProject().getTitle());
            }


            projectTitleHeader.textContent = getCurrentProject().getTitle(); // Update the project title header
            displayTasks(getCurrentProject()); // Display tasks for the current project
        });
    });

    projectTitleHeader.textContent = getCurrentProject().getTitle(); // Update the project title header
    if(projects.length === 0) {
        projectTitleHeader.textContent = ""; // Set default text if no projects
    }


    populateLocalStorage(projects); // Save updated projects array
    setupEditProjectButtons();
    displayTasks(getCurrentProject()); // Display tasks for the current project
    setupDeleteProjectButtons();
}


export function displayTasks(currentProject) {
    const taskList = document.querySelector('.todo-list');
    taskList.innerHTML = ""; // clear previous tasks
    if (!getCurrentProject() || !getCurrentProject().getTasks()) {
        return; // No tasks to display
    }

    getCurrentProject().getTasks().forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        taskItem.innerHTML = `<ul class="task-card">
                        <div class="taskContainer" data-task-lists="">
                            <div>
                                <input type="checkbox" name="tasks" id="task-${index}" class="checkBoxAlignment" ${task.isCompleted() ? "checked" : ""}>
                                <label for="task-${index}" style="text-decoration: none;">${task.getTitle()}</label>
                                <p id="taskDescription">${task.getDescription()}</p>
                            </div>

                            <div class="taskDatePriority">
                                <p id="taskDueDate">${task.getDueDate()}</p>
                                <p id="taskPriority">${
                                (task.getPriority() || "none").charAt(0).toUpperCase() + (task.getPriority() || "none").slice(1)
                                } Priority</p>
                                <button class="editTaskBtn" data-task-btn="${index}"><img src="${editIcon}"></button>
                                <button class="taskDeleteBtn" data-task-btn="${index}"><img src="${deleteIcon}"></button>
                            </div>
                        </div>
                        </ul>`;
        taskList.appendChild(taskItem);


        const checkbox = taskItem.querySelector(`#task-${index}`);
        checkbox.addEventListener('change', () => {
            task.setCompleted(checkbox.checked);
            populateLocalStorage(projects); // ✅ Save change
        });


    });
    const editTaskButtons = document.querySelectorAll('.editTaskBtn');
    editTaskButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            editTask(index);
        });

    });

    const deleteTaskButtons = document.querySelectorAll('.taskDeleteBtn');
    deleteTaskButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const taskIndex = parseInt(button.getAttribute('data-task-btn'), 10);
            const currentProject = getCurrentProject();
            if (currentProject) {
                currentProject.removeTask(taskIndex);
                displayTasks(currentProject); // Refresh the task list

                populateLocalStorage(projects); // Save updated projects array
            }
        });

    });
}