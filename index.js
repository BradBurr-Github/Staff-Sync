// Include packages needed for this application
const express = require('express');
const inquirer = require('inquirer');
const logo = require('asciiart-logo');

// Import and require Pool (node-postgres)
const { Pool } = require('pg');

// Define port and start express server
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to the database
const pool = new Pool(
  {
    user: 'postgres',
    password: 'Brad9',
    host: 'localhost',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
)

// Connect to Pool object
console.log('before CONNECT')
//pool.connect();
console.log('after CONNECT')

const sql = `SELECT id, dept_name AS DEPT FROM depts`;

//   pool.query(sql, (err, { rows }) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: 'success',
//       data: rows
//     });
//   });


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

// Display Staff Sync logo
const logoText = logo({name: "Staff Sync"}).render();
console.log(logoText);

// Ask the user the NINE questions to create the README.md file
// inquirer.prompt(questionDbTask)
// .then((response) => {

// });

// Function to initialize app
function init() {}

// Function call to initialize app
//init();
