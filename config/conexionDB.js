const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, '../database/api_express.db') // Ruta donde se guardará la BD

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar a SQLite:', err)
  } else {
    console.log('✅ Base de datos SQLite conectada en', dbPath)
  }
})

module.exports = db
