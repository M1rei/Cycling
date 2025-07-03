const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'BCsqs9LRp64kVdjgW55w',
  database: 'my_site'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

module.exports = db;
