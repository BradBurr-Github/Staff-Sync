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

    // Query to return ALL Departments - Order by Id
    getAllDeptsOrderById() {
        return this.query('SELECT id as "Id", dept_name as "Dept_Name" ' +
                          'FROM depts ORDER BY id');
    }
    // Query to return ALL Departments - Order by Dept_Name
    getAllDeptsOrderByDeptName() {
        return this.query('SELECT id as "Id", dept_name as "Dept_Name" ' +
                          'FROM depts ORDER BY dept_name');
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
    // Query to return ALL managers
    getAllManagers() {
        return this.query('SELECT id, firstName as "mFirstName", lastName as "mLastName" ' +
                          'FROM employees WHERE id in (SELECT DISTINCT manager_id FROM employees) ' +
                          'ORDER BY lastName, firstName');
    }
    // Query to return employees by their Manager
    getEmployeesByManager() {
        return this.query('SELECT manager_id, id, firstName as "eFirstName", lastName as "eLastName" ' +
                          'FROM employees ORDER BY manager_id');
    }
    // Query to return employees by their Departments
    getEmployeesByDept() {
        return this.query('SELECT e.id as "eId", e.firstName as "eFirstName", e.lastName as "eLastName", d.id as "dId", ' +
                          'd.dept_name FROM employees e JOIN roles r ON r.id=e.role_id JOIN depts d ON d.id=r.dept_id ' +
                          'ORDER BY d.dept_name, e.lastName, e.firstName');
    }
    // Query to return <UNASSIGNED> Role
    getUnassignedRole(unassigned) {
        return this.query('SELECT id FROM roles WHERE title=$1 ', unassigned);
    }
    // Query to return <UNASSIGNED> Dept
    getUnassignedDept(unassigned) {
        return this.query('SELECT id FROM depts WHERE dept_name=$1 ', unassigned);
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
    // SQL Statement to update Role's department
    updateSelectedRoleDepartment(udpateRoleDeptArray) {
        return this.query('UPDATE roles SET dept_id=$1 WHERE id=$2', udpateRoleDeptArray);
    }
    // SQL Statement to update Employee's role
    updateSelectedEmployeeRole(updateEmployeeRoleArray) {
        return this.query('UPDATE employees SET role_id=$1 WHERE id=$2', updateEmployeeRoleArray);
    }
    // SQL Statement to update Employee's manager
    updateSelectedEmployeeManager(updateManagerArray) {
        return this.query('UPDATE employees SET manager_id=$1 WHERE id=$2', updateManagerArray);
    }
    // SQL Statement to re-assign Depts of Roles BEFORE deleting Depts
    updatedDeptIdsToUnassigned(updateDeptIdsArray) {
        return this.query('UPDATE roles SET dept_id=$1 WHERE dept_id=$2', updateDeptIdsArray);
    }
    // SQL Statement to delete a Department
    deleteSelectedDept(deptDeleteArray) {
        return this.query('DELETE FROM depts WHERE id=$1', deptDeleteArray);
    }
    // SQL Statement to re-assign Roles of Employees BEFORE deleting Roles
    updatedRoleIdsToUnassigned(updateRoleIdsArray) {
        return this.query('UPDATE employees SET role_id=$1 WHERE role_id=$2', updateRoleIdsArray);
    }
    // SQL Statement to delete a Department
    deleteSelectedRole(roleDeleteArray) {
        return this.query('DELETE FROM roles WHERE id=$1', roleDeleteArray);
    }
}

module.exports = DB;