const fs = require('fs')
const path = require('path')
const db = require('../config/conexionDB')

const dbPath = path.join(__dirname, '../database/api_express.db')

// Eliminar la base de datos existente si ya existe
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
  console.log('✅ Archivo de base de datos eliminado')
}

// Crear tablas en SQLite
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS clima (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_ciudad TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      temperatura REAL NOT NULL,
      temp_minima REAL NOT NULL,
      temp_maxima REAL NOT NULL,
      sensacion_termica REAL NOT NULL,
      humedad INTEGER NOT NULL,
      viento REAL NOT NULL,
      icono TEXT DEFAULT NULL,
      fecha_consulta TEXT DEFAULT CURRENT_TIMESTAMP,
      es_favorita INTEGER DEFAULT 0
    )`,
    (err) => {
      if (err) console.error('❌ Error al crear la tabla clima:', err)
      else console.log('✅ Tabla "clima" creada correctamente')
    }
  )

  db.run(
    `CREATE TABLE IF NOT EXISTS pronostico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_ciudad TEXT NOT NULL,
      fecha TEXT NOT NULL,
      temperatura REAL NOT NULL,
      descripcion TEXT NOT NULL,
      icono TEXT NOT NULL,
      humedad INTEGER NOT NULL,
      viento REAL NOT NULL,
      sensacion_termica REAL NOT NULL
    )`,
    (err) => {
      if (err) console.error('❌ Error al crear la tabla pronostico:', err)
      else console.log('✅ Tabla "pronostico" creada correctamente')
    }
  )

  db.run(
    `CREATE TABLE IF NOT EXISTS aire (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_ciudad TEXT NOT NULL,
      calidad_aire INTEGER NOT NULL,
      co REAL NOT NULL,
      no REAL NOT NULL,
      no2 REAL NOT NULL,
      o3 REAL NOT NULL,
      so2 REAL NOT NULL,
      pm2_5 REAL NOT NULL,
      pm10 REAL NOT NULL,
      nh3 REAL NOT NULL,
      fecha TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) console.error('❌ Error al crear la tabla aire:', err)
      else console.log('✅ Tabla "aire" creada correctamente')
    }
  )
})

// Cerrar conexión después de crear las tablas
db.close((err) => {
  if (err) console.error('❌ Error al cerrar la conexión:', err)
  else console.log('✅ Conexión cerrada después de la creación de tablas')
})
