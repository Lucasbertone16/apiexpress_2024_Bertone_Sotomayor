const db = require('../config/conexionDB') // Importar la conexión a SQLite

class PronosticoRepository {
  // 🔹 Método para verificar si un pronóstico ya está en la base de datos
  existePronostico (nombreCiudad, fecha) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count FROM pronostico WHERE nombre_ciudad = ? AND fecha = ?'

      db.get(query, [nombreCiudad, fecha], (err, row) => {
        if (err) {
          console.error('❌ Error al verificar la existencia del pronóstico:', err)
          reject(err)
        } else {
          resolve(row.count > 0) // Devuelve true si el pronóstico ya existe
        }
      })
    })
  }

  guardarPronosticos (pronosticos) {
    return new Promise((resolve, reject) => {
      if (pronosticos.length === 0) return resolve('No hay pronósticos para guardar.')

      db.serialize(async () => {
        const query = `
          INSERT INTO pronostico (
            nombre_ciudad, fecha, temperatura, descripcion, icono, humedad, viento, sensacion_termica
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `

        let count = 0

        for (const pronostico of pronosticos) {
          const existe = await this.existePronostico(pronostico.nombre_ciudad, pronostico.fecha)

          if (!existe) {
            const values = [
              pronostico.nombre_ciudad,
              pronostico.fecha,
              pronostico.temperatura,
              pronostico.descripcion,
              pronostico.icono,
              pronostico.humedad,
              pronostico.viento,
              pronostico.sensacion_termica
            ]

            db.run(query, values, function (err) {
              if (err) {
                console.error('❌ Error al guardar pronóstico:', err)
                reject(err)
              } else {
                count++
                if (count === pronosticos.length) {
                  console.log(`✅ ${count} pronósticos guardados con éxito.`)
                  resolve({ registros_insertados: count })
                }
              }
            })
          } else {
            console.log(`ℹ️ Pronóstico para "${pronostico.nombre_ciudad}" en la fecha "${pronostico.fecha}" ya existe, no se guardará.`)
          }
        }
      })
    })
  }
}

module.exports = PronosticoRepository
