const Pelicula = require('../models/pelicula'); 

const peliculaController = {
    // Obtener todas las películas
    async getAllPeliculas(req, res) {
        try {
            const peliculas = await Pelicula.findAll(); 
            res.status(200).json(peliculas);
        } catch (error) {
            console.error('Error al obtener películas:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor al obtener películas.' });
        }
    },

    // Obtener película por ID
    async getPeliculaById(req, res) {
        try {
            const { id } = req.params;
            const pelicula = await Pelicula.findByPk(id); 
            if (!pelicula) {
                return res.status(404).json({ mensaje: 'Película no encontrada.' });
            }
            res.status(200).json(pelicula);
        } catch (error) {
            console.error('Error al obtener película por ID:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor.' });
        }
    },

    // Crear una nueva película
    async createPelicula(req, res) {
        try {
            const { nombre, sinopsis, duracion, imagen } = req.body;
            
            // Validación básica de campos obligatorios
            if (!nombre || !sinopsis || !duracion || !imagen) {
                return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
            }
            
            const nuevaPelicula = await Pelicula.create({ nombre, sinopsis, duracion, imagen });
            
            res.status(201).json({ mensaje: 'Película creada exitosamente.', pelicula: nuevaPelicula });
        } catch (error) {
            console.error('Error al crear película:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor al crear película.' });
        }
    },

    // Actualizar una película existente
    async updatePelicula(req, res) {
        try {
            const { id } = req.params;
            const { nombre, sinopsis, duracion, imagen } = req.body;
            
            // Busca la película por su ID
            const pelicula = await Pelicula.findByPk(id); 
            
            if (!pelicula) {
                return res.status(404).json({ mensaje: 'Película no encontrada.' });
            }

            pelicula.nombre = nombre || pelicula.nombre; 
            pelicula.sinopsis = sinopsis || pelicula.sinopsis;
            pelicula.duracion = duracion !== undefined ? duracion : pelicula.duracion; 
            pelicula.imagen = imagen || pelicula.imagen;

            // Guarda los cambios en la base de datos
            await pelicula.save(); 
            
            res.status(200).json({ mensaje: 'Película actualizada exitosamente.', pelicula });
        } catch (error) {
            console.error('Error al actualizar película:', error); 
            res.status(500).json({ mensaje: 'Error interno del servidor al actualizar película.' });
        }
    },

    // Eliminar una película
    async deletePelicula(req, res) {
        try {
            const { id } = req.params;
            
            const resultado = await Pelicula.destroy({ where: { id } }); 
            
            if (resultado === 0) { 
                return res.status(404).json({ mensaje: 'Película no encontrada.' });
            }
            res.status(200).json({ mensaje: 'Película eliminada exitosamente.' });
        } catch (error) {
            console.error('Error al eliminar película:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor al eliminar película.' });
        }
    },
};

module.exports = peliculaController;