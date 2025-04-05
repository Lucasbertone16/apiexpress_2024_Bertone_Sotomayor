const db = require('../config/conexionDB')

// Obtener todas las ciudades
const obtenerCiudades = (req, res) => {
  console.log('🟢 obtenerCiudades fue llamado')

  db.all('SELECT * FROM clima', (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta:', err)
      return res.status(500).json({ error: 'Error al obtener las ciudades' })
    }
    res.status(200).json(results)
  })
}

// Crear una ciudad
const crearCiudad = (req, res) => {
  console.log('🟢 crearCiudad fue llamado con datos:', req.body)

  const {
    nombreCiudad,
    descripcion,
    temperatura,
    tempMinima,
    tempMaxima,
    sensacionTermica,
    humedad,
    viento
  } = req.body

  if (
    !nombreCiudad ||
    !descripcion ||
    temperatura == null ||
    tempMinima == null ||
    tempMaxima == null ||
    sensacionTermica == null ||
    humedad == null ||
    viento == null
  ) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  const sql = `
    INSERT INTO clima (nombre_ciudad, descripcion, temperatura, temp_minima, temp_maxima, sensacion_termica, humedad, viento) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.run(sql, [nombreCiudad, descripcion, temperatura, tempMinima, tempMaxima, sensacionTermica, humedad, viento], function (err) {
    if (err) {
      console.error('❌ Error al crear la ciudad:', err)
      return res.status(500).json({ error: 'Error al crear la ciudad' })
    }
    res.status(201).json({ message: 'Ciudad creada correctamente' })
  })
}

// Marcar o desmarcar ciudad como favorita
const marcarFavorito = (req, res) => {
  console.log('🟢 marcarFavorito fue llamado con datos:', req.body)

  const { nombreCiudad } = req.body

  if (!nombreCiudad) {
    return res.status(400).json({ error: 'El nombre de la ciudad es obligatorio' })
  }

  const sqlSelect = 'SELECT es_favorita FROM clima WHERE nombre_ciudad = ?'

  db.get(sqlSelect, [nombreCiudad], (err, row) => {
    if (err) {
      console.error('❌ Error al obtener el estado de la ciudad:', err)
      return res.status(500).json({ error: 'Error al obtener el estado de la ciudad' })
    }

    if (!row) {
      return res.status(404).json({ error: 'Ciudad no encontrada' })
    }

    const nuevoEstado = row.es_favorita ? 0 : 1
    const sqlUpdate = 'UPDATE clima SET es_favorita = ? WHERE nombre_ciudad = ?'

    db.run(sqlUpdate, [nuevoEstado, nombreCiudad], function (err) {
      if (err) {
        console.error('❌ Error al actualizar el estado de la ciudad:', err)
        return res.status(500).json({ error: 'Error al actualizar el estado de la ciudad' })
      }

      const mensaje = nuevoEstado
        ? `Ciudad "${nombreCiudad}" marcada como favorita`
        : `Ciudad "${nombreCiudad}" desmarcada como favorita`

      res.status(200).json({ message: mensaje })
    })
  })
}

// Eliminar una ciudad
const eliminarCiudad = (req, res) => {
  console.log('🟢 eliminarCiudad fue llamado con datos:', req.body)

  const { nombreCiudad } = req.body

  if (!nombreCiudad) {
    return res.status(400).json({ error: 'El nombre de la ciudad es obligatorio' })
  }

  const sql = 'DELETE FROM clima WHERE nombre_ciudad = ?'

  db.run(sql, [nombreCiudad], function (err) {
    if (err) {
      console.error('❌ Error al eliminar la ciudad:', err)
      return res.status(500).json({ error: 'Error al eliminar la ciudad' })
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' })
    }

    res.status(200).json({ message: `Ciudad "${nombreCiudad}" eliminada` })
  })
}

module.exports = { obtenerCiudades, crearCiudad, marcarFavorito, eliminarCiudad }
