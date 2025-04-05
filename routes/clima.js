const { Router } = require('express')
const { getClimaActualPorCiudad, getClimaPorCoordenadasFiltrado, getClimaPorCiudadFiltrado } = require('../controllers/clima')
const climaController = require('../controllers/climaControllerDB')

const rutas = Router()

// Rutas para obtener datos climáticos desde la API
rutas.get('/ciudad', getClimaActualPorCiudad)
rutas.get('/coordenadas', getClimaPorCoordenadasFiltrado)
rutas.get('/ciudad/:ciudad', getClimaPorCiudadFiltrado)

// Rutas para CRUD en la base de datos
rutas.get('/climaget', climaController.obtenerCiudades)
rutas.post('/climapost', climaController.crearCiudad)
rutas.put('/clima/favorito', climaController.marcarFavorito)
rutas.delete('/climadelete', climaController.eliminarCiudad)

module.exports = rutas
