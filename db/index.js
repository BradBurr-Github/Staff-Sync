// Include packages needed for this application
const express = require('express');
const { Pool } = require('pg');

// Start express server
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connection to the database
const pool = new Pool(
  {
    user: 'postgres',
    password: 'Brad9',
    host: 'localhost',
    database: 'employees_db'
  },
  console.log(`Connected the employees_db database.`)
)

// Class to encapsulate the Database connection and running Queries
class DB {
    constructor() {}

    async query(sql, args = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(sql, args);
            return result;
        } finally {
            client.release();
        }
    }

    findAllEmployees() {
        return this.query('SELECT e.id, e.firstName, e.lastName, r.title, d.dept_name, r.salary, m.firstName, m.lastName ' +
                          'FROM employees e LEFT JOIN roles r ON r.id=e.role_id ' +
                          'LEFT JOIN depts d ON d.id=r.id LEFT JOIN employees m ON m.id=e.manager_id ' +
                          'ORDER BY e.lastName, e.firstName'
        );
    }
}

module.exports = DB;