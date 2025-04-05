const axios = require('axios')
const AireRepository = require('../repositories/aireRepository')

const getPolucionFutura = async (req, res) => {
  const { lon, lat, units = 'metric', lang = 'sp' } = req.query

  if (!lon || !lat) {
    return res.status(400).json({
      msg: 'Se requiere la latitud y la longitud'
    })
  }

  axios.get(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=${units}&lang=${lang}`)
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
        res.status(error.response.status).json({
          status: 'error',
          msg: 'Error al obtener datos del clima',
          error: error.response.data.message || error.response.statusText
        })
      } else {
        res.status(500).json({
          status: 'error',
          msg: 'Error inesperado al obtener la información',
          error: error.message
        })
      }
    })
}

const getPolucionAire = async (req, res) => {
  const { lat, lon, units = 'metric', lang = 'sp' } = req.query

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude y Longitud son necesarias.' })
  }

  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&lang=${lang}&units=${units}`
    )

    const { data } = response
    const aireRepository = new AireRepository()

    const resultado = await aireRepository.guardarAire({
      nombre_ciudad: `Lat: ${lat}, Lon: ${lon}`,
      data
    })

    res.status(200).json({
      msg: 'Ok',
      data,
      resultado
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

const getPolucionAireHistorica = async (req, res) => {
  const { lat, lon, start, end, units = 'metric', lang = 'sp' } = req.query

  if (!lat || !lon || !start || !end) {
    return res.status(400).json({
      status: 'error',
      msg: 'Debe completar los parámetros lat, lon, start, end para continuar',
      error: 400
    })
  }

  axios.get(`http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${process.env.API_KEY}&units=${units}&lang=${lang}`)
    .then((response) => {
      const { data } = response
      res.status(200).json({
        status: 'ok',
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

module.exports = {
  getPolucionFutura,
  getPolucionAire,
  getPolucionAireHistorica
}
