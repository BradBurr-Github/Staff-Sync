// Include packages needed for this application
const inquirer = require('inquirer');
const logo = require('asciiart-logo');
const DB = require('./db');
const { printTable } = require('console-table-printer');  // package to format table data

// Global Variables
let keepRunningApp = true;

// Questions for user to determine what task(s) they want to perform
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
          "View total utilized budget of a department",
          "EXIT APPLICATION"
      ]
  }
];



// Display the Main Menu to ask the user the what action they want to perform
async function loadMainMenuPrompts() {
  const answer = await inquirer.prompt(questionDbTask)
  // .then((response) => {
  //   switch(response.dbTask) {
  //     case 'EXIT APPLICATION':
  //       keepRunningApp = false;
  //       break;
  //       default:
  //         console.log('default');
  //         break;
  //   }
  // });
  return answer.dbTask;
}

// Main function
async function main() {
  
  // Display Staff Sync logo
  const logoText = logo({name: "Staff Sync"}).render();
  console.log(logoText);  

  // Loop through the Main Menu until 'EXIT APPLICATION' is selected
  while (keepRunningApp) {
    const action = await loadMainMenuPrompts();
    if (action === 'EXIT APPLICATION') {
      keepRunningApp = false;
      console.log('Thank you for using Staff Sync.  Goodbye!');
    // } else {
    //   console.log(`You chose ${action}`);
    // }
    }
  }



  // try {
  //  // while( keepRunningApp ) {     
  //     loadMainMenuPrompts();
  //   //}
  // }
  // catch (err) {
  //   console.error('Error executing Main Menu:', err.stack);
  // }
}

// Call the Staff-Sync application
main();