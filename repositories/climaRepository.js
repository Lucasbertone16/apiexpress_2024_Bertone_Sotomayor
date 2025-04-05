const db = require('../config/conexionDB') // Importar la conexión a SQLite

class ClimaRepository {
  // 🔹 Método para verificar si la ciudad ya está en la base de datos
  existeCiudad (nombreCiudad) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count FROM clima WHERE nombre_ciudad = ?'

      db.get(query, [nombreCiudad], (err, row) => {
        if (err) {
          console.error('❌ Error al verificar la existencia de la ciudad:', err)
          reject(err)
        } else {
          resolve(row.count > 0) // Devuelve true si la ciudad ya existe
        }
      })
    })
  }

  guardarClima (climaData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO clima (
          nombre_ciudad, descripcion, temperatura, temp_minima, temp_maxima,
          sensacion_termica, humedad, viento, icono
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const values = [
        climaData.nombre_ciudad,
        climaData.descripcion,
        climaData.temperatura,
        climaData.temp_minima,
        climaData.temp_maxima,
        climaData.sensacion_termica,
        climaData.humedad,
        climaData.viento,
        climaData.icono
      ]

      db.run(query, values, function (err) {
        if (err) {
          console.error('❌ Error al guardar los datos del clima:', err)
          reject(err)
        } else {
          console.log('✅ Datos de clima guardados con éxito, ID:', this.lastID)
          resolve({ id: this.lastID })
        }
      })
    })
  }
}

module.exports = ClimaRepository
