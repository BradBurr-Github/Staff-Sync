module.exports = {
    getAllRows: `
      SELECT *
      FROM depts;
    `,
    getRowById: `
      SELECT *
    FROM depts
    WHERE id = $1;
    `
  };
