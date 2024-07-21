// Include packages needed for this application
const inquirer = require('inquirer');
const logo = require('asciiart-logo');


// Questions for user for the README.md file contents
const questionDbTask = [
    {
        type: 'rawlist',
        name: 'dbTask',
        message: 'Which task do you want to perform?',
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Update employee's manager",
            "View employee by manager",
            "View employee by department",
            "Delete a department",
            "Delete a role",
            "Delete an employee",
            "View total utilized budget of a department"        
        ]
    }
];


const logoText = logo({name: "Staff Sync"}).render();
console.log(logoText);

// Ask the user the NINE questions to create the README.md file
inquirer.prompt(questionDbTask)
.then((response) => {

});

// Function to initialize app
function init() {}

// Function call to initialize app
init();
