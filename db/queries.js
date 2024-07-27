module.exports = {
    getAllRows: `
      SELECT *
      FROM depts;
    `,
    getRowById: `
      SELECT *
    FROM depts
    WHERE id = $1;
    `,
    deleteEmployeeById: `
      DELETE FROM employees
    WHERE id = $1;
    `,
    updateEmployeeById: `
      UPDATE employees
      SET role_id=$1
    WHERE id = $2;
    `
  };
