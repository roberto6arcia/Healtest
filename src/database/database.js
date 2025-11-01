
require('dotenv').config();
const {Client} = require('pg')

// EN LOCAL
// const connection = new Client({
//   connectionString: 'postgresql://postgres:1993@localhost:5432/healtestdb'
// });

// connection.connect();


// EN LA NUBE
const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

connection.connect()
  .then(() => console.log('Conectado a PostgreSQL en Render 🚀'))
  .catch(err => console.error('Error de conexión', err));

module.exports = { connection };