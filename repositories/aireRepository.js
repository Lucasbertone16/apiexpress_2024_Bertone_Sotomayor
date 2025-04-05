const db = require('../config/conexionDB')

class AireRepository {
  // 🔹 Verificar si ya existe un registro en la BD
  existeAire (nombreCiudad, fecha) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count FROM aire WHERE nombre_ciudad = ? AND fecha = ?'

      db.get(query, [nombreCiudad, fecha], (err, row) => {
        if (err) {
          console.error('❌ Error al verificar calidad del aire:', err)
          reject(err)
        } else {
          resolve(row.count > 0) // Devuelve true si ya está guardado
        }
      })
    })
  }

  // 🔹 Guardar datos de calidad del aire si no existen
  async guardarAire (aireData) {
    const fecha = new Date().toISOString().split('T')[0] // 🔹 Fecha actual en formato YYYY-MM-DD
    const nombreCiudad = aireData.nombre_ciudad || 'Desconocido'
    const calidadAire = aireData.data.list[0].main.aqi
    const componentes = aireData.data.list[0].components

    const values = [
      nombreCiudad,
      fecha,
      calidadAire,
      componentes.co,
      componentes.no,
      componentes.no2,
      componentes.o3,
      componentes.so2,
      componentes.pm2_5,
      componentes.pm10,
      componentes.nh3
    ]

    // Verificar si ya existe un registro para esa ciudad en esa fecha
    const existe = await this.existeAire(nombreCiudad, fecha)

    if (!existe) {
      const query = `
        INSERT INTO aire (
          nombre_ciudad, fecha, calidad_aire, co, no, no2, o3, so2, pm2_5, pm10, nh3
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      return new Promise((resolve, reject) => {
        db.run(query, values, function (err) {
          if (err) {
            console.error('❌ Error al guardar los datos del aire:', err)
            reject(err)
          } else {
            console.log('✅ Datos de aire guardados con éxito, ID:', this.lastID)
            resolve({ id: this.lastID })
          }
        })
      })
    } else {
      console.log(`ℹ️ Datos de calidad del aire para "${nombreCiudad}" en la fecha "${fecha}" ya existen.`)
      return { msg: 'Los datos ya están guardados en la BD' }
    }
  }
}

module.exports = AireRepository
