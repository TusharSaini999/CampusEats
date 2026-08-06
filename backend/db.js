const mysql = require("mysql2");
require('dotenv').config();
const db = mysql.createPool({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.dbport,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: {
    rejectUnauthorized: true
  }
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database');
    connection.release();
  }
});
module.exports = db;
