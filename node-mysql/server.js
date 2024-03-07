// Import required modules
const express = require('express');
const mysql = require('mysql2');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const util = require('util');

// Create a Winston logger for Node.js
const nodeLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'node.log' })
  ]
});

// Create a Winston logger for MySQL
const mysqlLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'mysql.log' })
  ]
});


// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'employees',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create Express application
const app = express();

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// Use Morgan for HTTP request logging
app.use(morgan('combined', { stream: accessLogStream }));

// Middleware to parse JSON requests
app.use(express.json());

// CRUD operations

// Create
app.post('/employees', (req, res) => {
  const { name, dept, salary } = req.body;
  const insertQuery = 'INSERT INTO employees (name, dept, salary) VALUES (?, ?, ?)';
  db.query(insertQuery, [name, dept, salary], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Employee added:', result.insertId);
    res.status(201).send('Employee added');
  });
});

// Read
app.get('/employees', (req, res) => {
  const selectQuery = 'SELECT * FROM employees';
  db.query(selectQuery, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(200).json(result);
  });
});

// Update
app.put('/employees/:id', (req, res) => {
  const { name, dept, salary } = req.body;
  const { id } = req.params;
  const updateQuery = 'UPDATE employees SET name=?, dept=?, salary=? WHERE emp_id=?';
  db.query(updateQuery, [name, dept, salary, id], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Employee updated:', id);
    res.status(200).send('Employee updated');
  });
});

// Delete
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM employees WHERE emp_id=?';
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Employee deleted:', id);
    res.status(200).send('Employee deleted');
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

