import mysql from 'mysql2'

const db = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  user: 'root',
  password: 'Songebob@123',
  database: 'book_store',
})

export default db
