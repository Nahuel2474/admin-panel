const mysql = require("mysql");
require('dotenv').config()
var connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password:process.env.PASS,
  database: process.env.DB,
  port: 3306,
  debug: false,
  multipleStatements: true
});
connection.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
  }

  if (connection) connection.release();
  console.log('DB is Connected');

  return;
});

module.exports = connection;