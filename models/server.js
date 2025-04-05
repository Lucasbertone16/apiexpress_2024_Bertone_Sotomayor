// models/server.js
const express = require('express')
const cors = require('cors')
const conexionDB = require('../config/conexionDB') // Importa el objeto de conexión

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.conectarDB()
    this.middleware()
    this.rutas()
  }

  conectarDB () {
    try {
      this.connection = conexionDB // ✅ Asigna el objeto de conexión directamente
      console.log('✅ Conectado a la base de datos SQLite')
    } catch (err) {
      console.error('❌ Error conectando a la base de datos:', err)
      process.exit(1)
    }
  }

  middleware () {
    this.app.use(cors())
    this.app.use(express.json()) // ✅ Agregado para parsear JSON
    this.app.use(express.urlencoded({ extended: true })) // ✅ Permite datos en formularios
    this.app.use(express.static('public'))
  }

  rutas () {
    this.app.use('/api/v1/clima', require('../routes/clima'))
    this.app.use('/api/v1/geocoding', require('../routes/geocoding'))
    this.app.use('/api/v1/aire', require('../routes/aire'))
    this.app.use('/api/v1/pronostico', require('../routes/pronostico'))
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log(`🚀 La API está escuchando en http://localhost:${this.port}`)
    })
  }
}

module.exports = Server
