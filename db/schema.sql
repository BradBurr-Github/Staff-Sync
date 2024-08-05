DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

\c employees_db;

CREATE TABLE depts (
  id SERIAL PRIMARY KEY,
  dept_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    dept_id INT NOT NULL,
    FOREIGN KEY (dept_id)
    REFERENCES depts(id)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
);