// Include packages needed for this application
const inquirer = require('inquirer');
const logo = require('asciiart-logo');
const db = require('./db');


//const queries = require('./db/queries.js');
//console.log(queries)
// Connect to Pool object



// Example usage
async function main() {
  // Display Staff Sync logo
  const logoText = logo({name: "Staff Sync"}).render();
  console.log(logoText);  

  try {
    const database = new DB();
    const result = database.findAllEmployees();
    console.log(result);


    //const res = await pool.query(query, params);
//     console.log('Query executed successfully:', res.rows);


  }
  catch (err) {
    console.error('Error executing query:', err.stack);
  }
}

main();


// Get a row by ID
//onst id = [10]; // Replace with the actual ID you want to query
//await executeQuery(queries.getRowById, id);
//await executeQuery(queries.deleteEmployeeById,id);



// Get all rows
  //await executeQuery(queries.getAllRows);
  //await executeQuery(queries.getRowById(2));

//const sql = `SELECT id, dept_name AS DEPT FROM depts`;
// async function executeQuery(query, params = []) {
//   try {
//     // Connect to the PostgreSQL client
//     await pool.connect();
//     console.log('Connected to the database.');

//     // Execute the query
//     const res = await pool.query(query, params);
//     console.log('Query executed successfully:', res.rows);
//   } catch (err) {
//     console.error('Error executing query:', err.stack);
//   } finally {
//     // Close the connection
//     await pool.end();
//     console.log('Database connection closed.');
//   }
// }



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



// Ask the user the NINE questions to create the README.md file
// inquirer.prompt(questionDbTask)
// .then((response) => {

// });

// Function to initialize app
//function init() {}

// Function call to initialize app
//init();
