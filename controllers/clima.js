const axios = require('axios')
const ClimaRepository = require('../repositories/climaRepository')

const climaRepository = new ClimaRepository()
// Obtener clima por coordenadas con filtro
const getClimaPorCoordenadasFiltrado = async (req, res) => {
  const { lon, lat, units = 'metric', lang = 'sp' } = req.query

  if (!lon || !lat) {
    return res.status(400).json({
      msg: 'Se requiere la latitud y la longitud'
    })
  }

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=${units}&lang=${lang}`
    )
    .then((response) => {
      const { main, wind, weather } = response.data
      const filtro = {
        descripcion: weather[0].description,
        temperatura: main.temp,
        temp_minima: main.temp_min,
        temp_maxima: main.temp_max,
        sensacion_termica: main.feels_like,
        humedad: main.humidity,
        viento: wind.speed,
        latitud: lat,
        longitud: lon
      }
      res.status(200).json({
        msg: 'Ok',
        filtro
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

// Obtener clima actual por ciudad
const getClimaActualPorCiudad = async (req, res) => {
  const { ciudad, lang = 'sp' } = req.query

  if (!ciudad) {
    return res.status(400).json({
      error: 'La ciudad es necesaria para continuar.'
    })
  }

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${process.env.API_KEY}&lang=${lang}`
    )
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

// Obtener clima por ciudad con filtro
const getClimaPorCiudadFiltrado = async (req, res) => {
  const { units = 'metric', lang = 'sp' } = req.query
  const { ciudad } = req.params

  if (!ciudad) {
    return res.status(400).json({
      msg: 'Se requiere la ciudad.'
    })
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${process.env.API_KEY}&units=${units}&lang=${lang}`
    )

    const { main, wind, weather } = response.data
    const climaData = {
      nombre_ciudad: ciudad,
      descripcion: weather[0].description,
      temperatura: main.temp,
      temp_minima: main.temp_min,
      temp_maxima: main.temp_max,
      sensacion_termica: main.feels_like,
      humedad: main.humidity,
      viento: wind.speed,
      icono: weather[0].icon
    }

    // 🔹 Verificar si la ciudad ya está en la base de datos
    const existe = await climaRepository.existeCiudad(ciudad)

    if (!existe) {
      await climaRepository.guardarClima(climaData) // Solo guarda si no existe
    } else {
      console.log(`ℹ️ La ciudad "${ciudad}" ya existe en la base de datos, no se guardará nuevamente.`)
    }

    res.status(200).json({
      status: 'ok',
      data: climaData
    })
  } catch (error) {
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
  }
}

module.exports = {
  getClimaPorCoordenadasFiltrado,
  getClimaActualPorCiudad,
  getClimaPorCiudadFiltrado
}
