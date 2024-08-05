// Include packages needed for this application
const inquirer = require('inquirer');
const logo = require('asciiart-logo');
const DB = require('./db');
const { Table } = require('console-table-printer');  // package to format table data

// Global Variables
let keepRunningApp = true;
const unassigned = '<UNASSIGNED>';
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
      ]
  }
];
 
// ==========================
// DATABASE FUNCTIONS
// ==========================
// Print ALL Departments
async function printAllDepartments() {
  try {
    const datatbase = new DB();
    // Query to get ALL departments
    const resDepts = await datatbase.getAllDepts();
    // Print ALL departments to the screen
    const p = new Table();
    p.addRows(resDepts.rows);
    p.printTable();
  } catch (err) {
    console.error('Error viewing ALL departments:', err.stack);
  }
}
// Print ALL Roles
async function printAllRoles() {
  try {
    const datatbase = new DB();
    // Query to get ALL roles
    const resRoles = await datatbase.getAllRoles();
    // Print ALL roles to the screen
    const p = new Table();
    p.addRows(resRoles.rows);
    p.printTable();
  } catch (err) {
    console.error('Error viewing ALL roles:', err.stack);
  }
}
// Print ALL Employees
async function printAllEmployees() {
  try {
    let employees = [];
    let manager = '';
    const datatbase = new DB();
    // Query to get ALL employees
    const resEmps = await datatbase.getAllEmployees();
    // Add employees to array
    for(let i=0; i<resEmps.rowCount; i++) {
      if(resEmps.rows[i].mFirstName === null || resEmps.rows[i].mLastName === null ) {
          manager = '';
      } else {
        manager = `${resEmps.rows[i].mFirstName} ${resEmps.rows[i].mLastName}`;
      }
      employees.push({Id:resEmps.rows[i].id, First_Name:resEmps.rows[i].eFirstName,
                      Last_Name:resEmps.rows[i].eLastName, Title:resEmps.rows[i].title,
                      Dept:resEmps.rows[i].dept_name, Salary:resEmps.rows[i].salary,
                      Manager:manager})
    }
    // Print ALL employees to the screen
    const p = new Table();
    p.addRows(employees);
    p.printTable();
  } catch (err) {
    console.error('Error viewing ALL employees:', err.stack);
  }
}
// Add a Department
async function addDepartment() {
  try {
    const answer = await inquirer.prompt({type:'input',name:'dept',message:'What is the name of the new department?',
                         validate: function(value) {if (value.trim() !== '') {return true;} return 'Please enter a valid name.';}});
    const datatbase = new DB();
    // Add new department that was specified by the user
    const arrayDept = [answer.dept];
    await datatbase.addNewDepartment(arrayDept);
    console.log(`The "${answer.dept}" department was added to the database.`);
  } catch (err) {
    console.error('Error adding a department:', err.stack);
  }
}
// Add a Role
async function addRole() {
  try {
    let i = 0;
    let depts = [];
    const datatbase = new DB();
    // Run query to get all Departments
    const resDepts = await datatbase.getAllDepts();
    // Add departments to array
    for(i=0; i<resDepts.rowCount; i++) {
      depts.push(resDepts.rows[i].Dept_Name);
    }
    // Put 3 questions into an array
    const questionsAddRole = [
      {
        type: 'input',
        name: 'role',
        message:'What is the name of the new role?',
        validate: function(value) {if (value.trim() !== '') {return true;}return 'Please enter a valid name.';}
      },
      {
        type: 'input',
        name: 'salary',
        message:'What is the salary of the new role?',
        validate: function(value) {
          const valid = !isNaN(parseInt(value)) && isFinite(value);
          return valid || 'Please enter a valid number';
        }
      },
      {
        type: 'rawlist',
        name: 'dept',
        message: 'Which department does the new role belong to?',
        choices: depts
      }
    ];
    // Ask user the 3 questions needed for adding a new role
    const answer = await inquirer.prompt(questionsAddRole);
    // Find the Id of the Department that was selected by the user
    let deptSelected = 1;
    for(i=0; i<resDepts.rowCount; i++) {
      if( resDepts.rows[i].Dept_Name === answer.dept ) {
        deptSelected = resDepts.rows[i].Id;
        break;
      }
    }
    const arrayAnswers = [answer.role, answer.salary, deptSelected];
    // Add new role
    await datatbase.addNewRole(arrayAnswers);
    console.log(`The "${answer.role}" role was added to the database.`);
  } catch (err) {
    console.error('Error adding a role:', err.stack);
  }
}
// Add an Employee
async function addEmployee() {
  try {
    let i = 0;
    let roles = [];
    let managers = [];
    const datatbase = new DB();
    // Run query to get all Roles
    const resRoles = await datatbase.getAllRoles();
    // Add roles to array
    for(i=0; i<resRoles.rowCount; i++) {
      roles.push(resRoles.rows[i].Title);
    }
    // Run query to get all Employees
    const resEmployees = await datatbase.getAllEmployees();
    // Add employees to array
    managers.push('None');
    for(i=0; i<resEmployees.rowCount; i++) {
      managers.push(`${resEmployees.rows[i].eFirstName} ${resEmployees.rows[i].eLastName}`);
    }
    // Put 3 questions into an array
    const questionsAddEmployee = [
      {
        type: 'input',
        name: 'firstName',
        message:"What is the employee's first name?",
        validate: function(value) {if (value.trim() !== '') {return true;}return 'Please enter a valid first name.';}
      },
      { type: 'input',
        name: 'lastName',
        message:"What is the employee's last name?",
        validate: function(value) {if (value.trim() !== '') {return true;}return 'Please enter a valid last name.';}
      },
      {
        type: 'rawlist',
        name: 'role',
        message: "What is the employee's role?",
        choices: roles
      },
      {
        type: 'rawlist',
        name: 'manager',
        message: "Who is the employee's Manager?",
        choices: managers
      }
    ];
    // Ask user the 3 questions needed for adding a new employee
    const answer = await inquirer.prompt(questionsAddEmployee);
    // Find the Id of the Role that was selected by the user
    let roleSelected = 1;
    for(i=0; i<resRoles.rowCount; i++) {
      if( resRoles.rows[i].Title === answer.role ) {
        roleSelected = resRoles.rows[i].Id;
        break;
      }
    }
    // Find the Id of the Employee that was selected by the user as the 'Manager'
    let employeeSelected = null;
    let currEmployee = '';
    for(i=0; i<resEmployees.rowCount; i++) {
      currEmployee = `${resEmployees.rows[i].eFirstName} ${resEmployees.rows[i].eLastName}`;
      if(currEmployee === answer.manager) {
        employeeSelected = resEmployees.rows[i].id;
        break;
      }
    }
    const arrayAnswers = [answer.firstName, answer.lastName, roleSelected, employeeSelected];
    // Add new employee
    await datatbase.addNewEmployee(arrayAnswers);
    console.log(`Employee "${answer.firstName} ${answer.lastName}" was added to the database.`);
  } catch (err) {
    console.error('Error adding employee:', err.stack);
  }
}
// Update Employee's Role
async function updateEmployeeRole() {
  try {
    let i = 0;
    let roles = [];
    let employees = [];
    const datatbase = new DB();
    // Run query to get all Roles
    const resRoles = await datatbase.getAllRoles();
    // Add roles to array
    for(i=0; i<resRoles.rowCount; i++) {
      roles.push(resRoles.rows[i].Title);
    }
    // Run query to get all Employees
    const resEmployees = await datatbase.getAllEmployees();
    // Add employees to array
    for(i=0; i<resEmployees.rowCount; i++) {
      employees.push(`${resEmployees.rows[i].eFirstName} ${resEmployees.rows[i].eLastName}`);
    }
    // Put 2 questions into an array
    const questionsUpdateEmployeeRole = [
      {
        type: 'rawlist',
        name: 'employee',
        message: "Which employee's role do you want to update?",
        choices: employees
      },
      {
        type: 'rawlist',
        name: 'role',
        message: "Which role do you want to assign the selected employee?",
        choices: roles
      }
    ];
    // Ask user the 2 questions needed for updating employee's role
    const answer = await inquirer.prompt(questionsUpdateEmployeeRole);
    // Find the Id of the Role that was selected by the user
    let roleSelected = 1;
    for(i=0; i<resRoles.rowCount; i++) {
      if( resRoles.rows[i].Title === answer.role ) {
        roleSelected = resRoles.rows[i].Id;
        break;
      }
    }
    // Find the Id of the Employee that was selected
    let employeeSelected = 1;
    let currEmployee = '';
    for(i=0; i<resEmployees.rowCount; i++) {
      currEmployee = `${resEmployees.rows[i].eFirstName} ${resEmployees.rows[i].eLastName}`;
      if(currEmployee === answer.employee) {
        employeeSelected = resEmployees.rows[i].id;
        break;
      }
    }
    const arrayAnswers = [roleSelected, employeeSelected];
    // Update employee's role
    await datatbase.updateSelectedEmployeeRole(arrayAnswers);
    console.log(`Employee "${answer.employee}" is now assigned the role of "${answer.role}".`);
  } catch (err) {
    console.error("Error updating employee's role:", err.stack);
  }
}
// Update Employee's Manager
async function updateEmployeeManager() {
  try {
    let i = 0;
    let employees = [];
    let managers = [];
    const datatbase = new DB();
    // Run query to get all Employees
    const resEmployees = await datatbase.getAllEmployees();
    // Add employees to array
    for(i=0; i<resEmployees.rowCount; i++) {
      employees.push(`${resEmployees.rows[i].eFirstName} ${resEmployees.rows[i].eLastName}`);
    }
    // Ask user which employee's manager they want to update
    const answer = await inquirer.prompt({type:'rawlist', name:'employee', message: "Which employee's manager do you want to update?", choices: employees});
    // Find the Id of the Employee that was selected
    let employeeSelected = 1;
    let currEmployee = '';
    for(i=0; i<resEmployees.rowCount; i++) {
      currEmployee = `${resEmployees.rows[i].eFirstName} ${resEmployees.rows[i].eLastName}`;
      if(currEmployee === answer.employee) {
        employeeSelected = resEmployees.rows[i].id;
        break;
      }
    }
    // Add employees to Managers array (excluding employee that was selected previously)
    managers.push('None');
    for(i=0; i<resEmployees.rowCount; i++) {
      if(resEmployees.rows[i].id === employeeSelected)
        continue;
      managers.push(`${resEmployees.rows[i].eFirstName} ${resEmployees.rows[i].eLastName}`);
    }
    const answerManager = await inquirer.prompt({type:'rawlist', name:'manager', message: "Who is the new manager of the selected employee?", choices: managers});
    // Find the Id of the 'Manager' that was selected
    let managerSelected = null;
    currEmployee = '';
    for(i=0; i<resEmployees.rowCount; i++) {
      currEmployee = `${resEmployees.rows[i].eFirstName} ${resEmployees.rows[i].eLastName}`;
      if(currEmployee === answer.manager) {
        managerSelected = resEmployees.rows[i].id;
        break;
      }
    }
    const arrayAnswers = [managerSelected, employeeSelected];
    // Update employee's manager
    await datatbase.updateSelectedEmployeeManager(arrayAnswers);
    console.log(`The manager of "${answer.employee}" is now "${answerManager.manager}".`);
  } catch (err) {
    console.error("Error updating employee's manager:", err.stack);
  }
}
// View Employee By Manager
async function printEmployeeByManager() {
  try {
    let i = 0;
    let currEmployee = '';
    let currManager = '';
    let employeesByManagers = [];
    const datatbase = new DB();
    // Run query to get all Managers
    const resManagers = await datatbase.getAllManagers();
    // Run query to get all employees ordered by their Managers
    const resEmployeesByManager = await datatbase.getEmployeesByManager();
    // Add all employees who do NOT have manages first
    for(i=0; i<resEmployeesByManager.rowCount; i++) {
      if(resEmployeesByManager.rows[i].manager_id === null) {
        currEmployee = `${resEmployeesByManager.rows[i].eFirstName} ${resEmployeesByManager.rows[i].eLastName}`;
        employeesByManagers.push({Manager_Id:'<NONE>', Manager:'<NONE>', Employee_Id:resEmployeesByManager.rows[i].id, Employee:currEmployee});
      }
    }
    // Loop through all managers and list their employees
    for(i=0; i<resManagers.rowCount; i++) {
      if(resManagers.rows[i].manager_id === null) {
        continue;
      }
      else {
        for(let j=0; j<resEmployeesByManager.rowCount; j++) {
          if(resEmployeesByManager.rows[j].manager_id === resManagers.rows[i].id) {
            currManager = `${resManagers.rows[i].mFirstName} ${resManagers.rows[i].mLastName}`;
            currEmployee = `${resEmployeesByManager.rows[j].eFirstName} ${resEmployeesByManager.rows[j].eLastName}`;
            employeesByManagers.push({Manager_Id:resManagers.rows[i].id, Manager:currManager, Employee_Id:resEmployeesByManager.rows[j].id, Employee:currEmployee});
          }
        }
      }
    }
    // Print ALL employees by their manager to the screen
    const p = new Table();
    p.addRows(employeesByManagers);
    p.printTable();
  } catch (err) {
    console.error("Error viewing employee by their manager:", err.stack);
  }
}
// View Employee By Department
async function printEmployeeByDept() {
  try {
    let i = 0;1
    
    let currEmployee = '';
    let employeesWithRoles = [];
    const datatbase = new DB();
    // Run query to get '<UNASSIGNED>' Role and Dept
    const resUnassignedRoleId = await datatbase.getUnassignedRole([unassigned]);
    const resUnassignedDeptId = await datatbase.getUnassignedDept([unassigned]);
    // Run query to get all employees by Department
    const resEmpsByDept = await datatbase.getEmployeesByDept();
    // Add all employees who do NOT have Depts first
    for(i=0; i<resEmpsByDept.rowCount; i++) {
      if(resEmpsByDept.rows[i].dId === resUnassignedDeptId.rows[0].id) {
        currEmployee = `${resEmpsByDept.rows[i].eFirstName} ${resEmpsByDept.rows[i].eLastName}`;
        employeesWithRoles.push({Dept_Id:unassigned, Dept:unassigned, Employee_Id:resEmpsByDept.rows[i].eId, Employee:currEmployee});
      }
    }
    // Add the rest of employees
    for(i=0; i<resEmpsByDept.rowCount; i++) {
      currEmployee = `${resEmpsByDept.rows[i].eFirstName} ${resEmpsByDept.rows[i].eLastName}`;
      employeesWithRoles.push({Dept_Id:resEmpsByDept.rows[i].dId, Dept:resEmpsByDept.rows[i].dept_name, Employee_Id:resEmpsByDept.rows[i].eId, Employee:currEmployee});
    }
    // Print ALL employees by their Dept to the screen
    const p = new Table();
    p.addRows(employeesWithRoles);
    p.printTable();
  } catch (err) {
    console.error("Error viewing employee by dept:", err.stack);
  }
}
//      
//      
//      
//      "Which Department do you want to delete?"
//      "Which Role do you want to delete?"
//      "Which Employee do you want to delete?"
//      "Which Department do you want to view a total utilized budget for?"



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
            await printAllDepartments();
            break;
          case tasksToPerform[1]:     // View all roles
            await printAllRoles();
            break;
          case tasksToPerform[2]:     // View all employees
            await printAllEmployees();
            break;
          case tasksToPerform[3]:     // Add a department
            await addDepartment();
            break;
          case tasksToPerform[4]:     // Add a role
            await addRole();
            break;
          case tasksToPerform[5]:     // Add an employee
            await addEmployee();
            break;
          case tasksToPerform[6]:     // Update an employee role
            await updateEmployeeRole();
            break;
          case tasksToPerform[7]:     // Update employee's manager
            await updateEmployeeManager();
            break;
          case tasksToPerform[8]:     // View employee by manager
            await printEmployeeByManager();
            break;
          case tasksToPerform[9]:     // View employee by department
            await printEmployeeByDept();
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