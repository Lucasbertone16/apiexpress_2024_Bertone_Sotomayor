const axios = require('axios')
const PronosticoRepository = require('../repositories/pronosticoRepository')

const getClima5dias = async (req, res) => {
  const { lat, lon, units = 'metric', lang = 'sp' } = req.query

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude (lat) y Longitud (lon) son necesarias.' })
  }

  axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=${units}&lang=${lang}`)
    .then((response) => {
      const { data } = response
      res.status(200).json({
        msg: 'Ok',
        data
      })
    })
    .catch((error) => {
      console.error(error)
      if (error.response) {
        return res.status(error.response.status).json({
          status: 'error',
          msg: 'Error al obtener datos del clima',
          error: error.response.data.message || error.response.statusText,
          statusCode: error.response.status
        })
      } else {
        res.status(500).json({
          status: 'error',
          msg: 'Error inesperado al obtener la información',
          error: error.message,
          statusCode: 500
        })
      }
    })
}

const getClima5diasPorCiudad = async (req, res) => {
  const { units = 'metric', lang = 'sp' } = req.query
  const { ciudad } = req.params

  if (!ciudad) {
    return res.status(400).json({ error: 'Ingrese la ciudad para poder continuar' })
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${process.env.API_KEY}&lang=${lang}&units=${units}`
    )

    const { list } = response.data

    // Filtrar para obtener solo un resultado por día (hora fija: 12:00)
    const pronosticoSemanal = list.filter((item) => item.dt_txt.includes('12:00:00'))

    // Formatear los datos para incluir solo la información relevante
    const pronosticoFormatado = pronosticoSemanal.map((item) => ({
      nombre_ciudad: ciudad,
      fecha: item.dt_txt.split(' ')[0], // Fecha
      temperatura: item.main.temp, // Temperatura
      descripcion: item.weather[0].description, // Descripción del clima
      icono: item.weather[0].icon, // Ícono del clima
      humedad: item.main.humidity, // Humedad
      viento: item.wind.speed, // Velocidad del viento
      sensacion_termica: item.main.feels_like // Sensación térmica
    }))

    // Guardar en la base de datos solo si no existe
    const pronosticoRepo = new PronosticoRepository()
    await pronosticoRepo.guardarPronosticos(pronosticoFormatado)

    res.status(200).json({
      msg: 'Ok',
      data: pronosticoFormatado
    })
  } catch (error) {
    console.error(error)
    if (error.response) {
      return res.status(error.response.status).json({
        status: 'error',
        msg: 'Error al obtener datos del clima',
        error: error.response.data.message || error.response.statusText,
        statusCode: error.response.status
      })
    } else {
      res.status(500).json({
        status: 'error',
        msg: 'Error inesperado al obtener la información',
        error: error.message,
        statusCode: 500
      })
    }
  }
}

const getClima5diasPorCodigoPostal = async (req, res) => {
  const { zip, country = 'AR', units = 'metric', lang = 'sp' } = req.query

  if (!zip) {
    return res.status(400).json({ error: 'Ingrese el codigo postal para poder continuar' })
  }

  axios.get(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip},${country}&appid=${process.env.API_KEY}&lang=${lang}&units=${units}`)
    .then((response) => {
      const { data } = response
      res.status(200).json({
        msg: 'Ok',
        data
      })
    })
    .catch((error) => {
      console.error(error)
      if (error.response) {
        return res.status(error.response.status).json({
          status: 'error',
          msg: 'Error al obtener datos del clima',
          error: error.response.data.message || error.response.statusText,
          statusCode: error.response.status
        })
      } else {
        res.status(500).json({
          status: 'error',
          msg: 'Error inesperado al obtener la información',
          error: error.message,
          statusCode: 500
        })
      }
    })
}

module.exports = { getClima5dias, getClima5diasPorCiudad, getClima5diasPorCodigoPostal }
