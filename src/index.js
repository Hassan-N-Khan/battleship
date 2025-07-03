import "./styles.css";
import "./dom.js";
import { dialogButtons, projects, setupAddProjectButton, setupEditProjectButtons } from "./buttons.js";
import Project from "./projects.js";
import { displayProjects } from "./dom.js";
import { setCurrentProject } from "./state.js";
import { loadProjectsFromLocalStorage, populateLocalStorage } from "./localStorage.js";

document.addEventListener('DOMContentLoaded', () => {
    // Load projects from localStorage if they exist, or initialize with default projects
    const savedProjects = loadProjectsFromLocalStorage();
    if (savedProjects.length > 0) {
        // Add the saved projects into the global projects array
        savedProjects.forEach(p => projects.push(p));
        setCurrentProject(projects[0]);
        console.log('Loaded projects:', projects);
    } else {
        // Create a default project if nothing is in localStorage
        const newProject = new Project("Default Project");
        setCurrentProject(newProject);
        newProject.addTask("Sample Task", "This is a sample task description.", "2023-12-31", "Low");
        newProject.addTask("Another Task", "This is another task description.", "2024-01-15", "High");
        newProject.addTask("Third Task", "This is the third task description.", "2024-02-01", "Medium");
        projects.push(newProject); 
        populateLocalStorage(projects); // Save the default project to localStorage
    }

    // Always display the projects
    displayProjects();

    // Setup event listeners for adding, editing projects and tasks
    setupAddProjectButton();
    dialogButtons();
    setupEditProjectButtons();
});
