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

const queries = require('./db/queries.js');
console.log(queries)
// Connect to Pool object

const sql = `SELECT id, dept_name AS DEPT FROM depts`;
async function executeQuery(query, params = []) {
  try {
    // Connect to the PostgreSQL client
    await pool.connect();
    console.log('Connected to the database.');

    // Execute the query
    const res = await pool.query(query, params);
    console.log('Query executed successfully:', res.rows);
  } catch (err) {
    console.error('Error executing query:', err.stack);
  } finally {
    // Close the connection
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Example usage
async function main() {
  // Get all rows
  await executeQuery(queries.getAllRows);

  // Get a row by ID
  const id = 1; // Replace with the actual ID you want to query
  await executeQuery(queries.getRowById, 1);
}

main();






// main.js
//const { Client } = require('pg');
//const query = require('./db/queries.js');
//console.log(query)
// Database connection configuration
// const client = new Client({
//   user: 'your_username',
//   host: 'your_host',
//   database: 'your_database',
//   password: 'your_password',
//   port: 5432, // Default port for PostgreSQL
// });

// async function executeQuery(param) {
//   try {
//     // Connect to the PostgreSQL client
//     //await client.connect();
//     //console.log('Connected to the database.');

//     // Execute the query
//     const res = await pool.query(query, [param]);
//     console.log('Query executed successfully:', res.rows);
//   } catch (err) {
//     console.error('Error executing query:', err.stack);
//   } finally {
//     // Close the connection
//     await client.end();
//     console.log('Database connection closed.');
//   }
// }

// // Example usage
// executeQuery('1');



// Query database
// pool.query('SELECT * FROM depts', function (err, {rows}) {
//   console.log(rows);
// });

// Default response for any other request (Not Found)
// app.use((req, res) => {
//   res.status(404).end();
// });


// pool.query(sql, (err, { rows }) => {
//   if (err) {
//     res.status(500).json({ error: err.message });
//     return;
//   }
//   res.json({
//     message: 'success',
//     data: rows
//   });
// });


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
