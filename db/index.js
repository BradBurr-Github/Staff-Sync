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

    // Asyncronous query that accepts arguments
    async query(sql, args = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(sql, args);
            return result;
        } finally {
            client.release();
        }
    }

    // Query to return ALL Departments
    getAllDepartments() {
        return this.query('SELECT id as "Id", dept_name as "Dept_Name" ' +
                          'FROM depts ORDER BY id');
    }
    // Query to return ALL Roles
    getAllRoles() {
        return this.query('SELECT r.id as "Id", r.title as "Title", d.dept_name as "Dept_Name", r.salary as "Salary" ' +
                          'FROM roles r LEFT JOIN depts d ON d.id=r.dept_id ' +
                          'ORDER BY r.id');
    }
    // Query to return ALL employees
    getAllEmployees() {
        return this.query('SELECT e.id, e.firstName as "eFirstName", e.lastName as "eLastName", r.title, ' +
                          'd.dept_name, r.salary, m.firstName as "mFirstName", m.lastName as "mLastName" ' +
                          'FROM employees e LEFT JOIN roles r ON r.id=e.role_id ' +
                          'LEFT JOIN depts d ON d.id=r.dept_id LEFT JOIN employees m ON m.id=e.manager_id ' +
                          'ORDER BY e.lastName, e.firstName');
    }
    // SQL Statement to add a new Department
    addNewDepartment(deptName) {
        return this.query('INSERT INTO depts (dept_name) VALUES ($1)', deptName);
    }
    // SQL Statement to add a new Role
    addNewRole(roleAnswersArray) {
        return this.query('INSERT INTO roles (title, salary, dept_id) VALUES ($1,$2,$3)', roleAnswersArray);
    }
    // SQL Statement to add a new Employee
    addNewEmployee(newEmployeeArray) {
        return this.query('INSERT INTO employees (firstName, lastName, role_id, manager_id) VALUES ($1,$2,$3,$4)', newEmployeeArray);
    }
    // SQL Statement to update Employee's role
    updateSelectedEmployeeRole(updateRoleArray) {
        return this.query('UPDATE employees SET role_id=$1 WHERE id=$2', updateRoleArray);
    }
    // SQL Statement to update Employee's manager
    updateSelectedEmployeeManager(updateManagerArray) {
        return this.query('UPDATE employees SET manager_id=$1 WHERE id=$2', updateManagerArray);
    }
}

module.exports = DB;