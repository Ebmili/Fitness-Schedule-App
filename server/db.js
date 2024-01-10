const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "emila1234",
  host: "localhost",
  port: 5432,
  database: "postgres"
});

module.exports = pool;