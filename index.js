// Include packages needed for this application
const inquirer = require('inquirer');
const logo = require('asciiart-logo');
const DB = require('./db');
const { Table } = require('console-table-printer');  // package to format table data

// Global Variables
let keepRunningApp = true;
const tasksToPerform = ["View all departments","View all roles","View all employees","Add a department","Add a role",
                        "Add an employee","Update an employee role","Update employee's manager","View employee by manager","View employee by department",
                        "Delete a department","Delete a role","Delete an employee","View total utilized budget of a department","EXIT APPLICATION"]

// Questions for user to determine what task(s) they want to perform
const questionDbTask = [
  {
      type: 'rawlist',
      name: 'dbTask',
      message: 'Which task do you want to perform?',
      choices: [
          tasksToPerform[0],tasksToPerform[1],tasksToPerform[2],tasksToPerform[3],tasksToPerform[4],
          tasksToPerform[5],tasksToPerform[6],tasksToPerform[7],tasksToPerform[8],tasksToPerform[9],
          tasksToPerform[10],tasksToPerform[11],tasksToPerform[12],tasksToPerform[13],tasksToPerform[14]
      ],

//      "What is the name of the Department?"
//      "What is the name of the Role?"
//      "What is the salary of the Role?"
//      "Which Department does the Role belong to?"
//      "What is the employee's First Name?"
//      "What is the employee's Last Name?"
//      "What is the employee's Role?"
//      "Who is the employee's Manager?"
//      "Which Emploee's role do you want to update?"
//      "Which Role do you want to assign the selected employee?"
//      "Which Employee's Manager do you want to update?"
//      "Which Department do you want to delete?"
//      "Which Role do you want to delete?"
//      "Which Employee do you want to delete?"
//      "Which Department do you want to view a total utilized budget for?"

  }
];

  // {
  //   type: 'input',
  //   name: 'salary',
  //   message: 'What is the Salary of the role?', default: '50000'
  // },

// FUNCTIONS TO PRINT QUERIES
// ==========================
// Print ALL Employees
async function printAllEmployees() {
  try {
    let employees = [];
    let manager = '';
    let datatbase = new DB();
    // Query to get ALL employees
    let result = await datatbase.getAllEmployees();
    // Add employees to array
    for(let i=0; i<result.rowCount; i++) {
      if(result.rows[i].mFirstName === null || result.rows[i].mLastName === null ) {
          manager = '';
      } else {
        manager = `${result.rows[i].mFirstName} ${result.rows[i].mLastName}`;
      }
      employees.push({Id:result.rows[i].id, First_Name:result.rows[i].eFirstName,
                      Last_Name:result.rows[i].eLastName, Title:result.rows[i].title,
                      Dept:result.rows[i].dept_name, Salary:result.rows[i].salary,
                      Manager:manager})
    }
    // Print ALL employees to the screen
    const p = new Table();
    p.addRows(employees);
    p.printTable();
  } catch (err) {
    console.error('Error printing ALL employees:', err.stack);
  }
}
// Add a Department
async function addDepartment() {
  try {
    const answer = await inquirer.prompt({type:'input',name:'dept',message:'What is the name of the new department?',
                         validate: function(value) {if (value.trim() !== '') {return true;}return 'Please enter a valid name';}});
    let datatbase = new DB();
    // Add new department that was specified by the user
    const arrayDept = [answer.dept];
    let result = await datatbase.addNewDepartment(arrayDept);
    console.log(`The "${answer.dept}" department was added to the database.`);
  } catch (err) {
    console.error('Error adding a department:', err.stack);
  }
}

// Display the Main Menu to ask the user the what action they want to perform
async function loadMainMenuPrompts() {
  const answer = await inquirer.prompt(questionDbTask)
  return answer.dbTask;
}

// Main function
async function main() {
  try {
    // Display Staff Sync logo
    const logoText = logo({name: "Staff Sync"}).render();
    console.log(logoText);

    // Loop through the Main Menu until 'EXIT APPLICATION' is selected
    while (keepRunningApp) {
      const action = await loadMainMenuPrompts();
      // Check if 'EXIT APPLICATION' (tasksToPerform[14]) was selected
      if (action === tasksToPerform[14]) {
        keepRunningApp = false;
        console.log('Thank you for using Staff Sync.  Goodbye!');
      } else {
        switch(action) {
          case tasksToPerform[0]:     // View all departments
            break;
          case tasksToPerform[1]:     // View all roles
            break;
          case tasksToPerform[2]:     // View all employees
            await printAllEmployees();
            break;
          case tasksToPerform[3]:     // Add a department
            await addDepartment();
            break;
          case tasksToPerform[4]:     // Add a role
            break;
          case tasksToPerform[5]:     // Add an employee
            break;
          case tasksToPerform[6]:     // Update an employee role
            break;
          case tasksToPerform[7]:     // Update employee's manager
            break;
          case tasksToPerform[8]:     // View employee by manager
            break;
          case tasksToPerform[9]:     // View employee by department
            break;
          case tasksToPerform[10]:    // Delete a department
            break;
            case tasksToPerform[11]:  // Delete a role
            break;
            case tasksToPerform[12]:  // Delete an employee
            break;
            case tasksToPerform[13]:  // View total utilized budget of a department
            break;
        }
      }
    }
  } catch (err) {
    console.error('Error selecting a task:', err.stack);
  }
}

// Call the Staff-Sync application
main();