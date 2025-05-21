// backend/controllers/sala.js
const Sala = require('../models/sala');     // Importa el modelo Sala de Sequelize
const Pelicula = require('../models/pelicula'); // También necesitamos el modelo Pelicula para las inclusiones

const salaController = {
    // Obtener todas las salas con su película asociada
    async getAllSalas(req, res) {
        try {
            const salas = await Sala.findAll({
                include: [
                    {
                        model: Pelicula, // Incluye el modelo Pelicula
                        as: 'pelicula', // Usa el alias 'pelicula' definido en la asociación (Sala.belongsTo)
                        attributes: ['id', 'nombre', 'duracion', 'sinopsis', 'imagen'] // Selecciona solo los campos que necesitas de la película
                    }
                ]
            });
            res.status(200).json(salas);
        } catch (error) {
            console.error('Error al obtener todas las salas:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor al obtener salas.' });
        }
    },

    // Obtener una sala por ID con su película asociada
    async getSalaById(req, res) {
        try {
            const { id } = req.params;
            const sala = await Sala.findByPk(id, {
                include: [
                    {
                        model: Pelicula,
                        as: 'pelicula',
                        attributes: ['id', 'nombre', 'duracion', 'sinopsis', 'imagen']
                    }
                ]
            });

            if (!sala) {
                return res.status(404).json({ mensaje: 'Sala no encontrada.' });
            }
            res.status(200).json(sala);
        } catch (error) {
            console.error('Error al obtener sala por ID:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor.' });
        }
    },

    // Crear una nueva sala
    async createSala(req, res) {
        try {
            const { nombre, filas, columnas, pelicula_id } = req.body;

            if (!nombre || !filas || !columnas) {
                return res.status(400).json({ mensaje: 'Los campos nombre, filas y columnas son obligatorios.' });
            }

            // Opcional: Validar si la pelicula_id existe si se proporciona
            if (pelicula_id) {
                const pelicula = await Pelicula.findByPk(pelicula_id);
                if (!pelicula) {
                    return res.status(400).json({ mensaje: 'La película especificada no existe.' });
                }
            }

            const nuevaSala = await Sala.create({ nombre, filas, columnas, pelicula_id });
            res.status(201).json({ mensaje: 'Sala creada exitosamente.', sala: nuevaSala });
        } catch (error) {
            console.error('Error al crear sala:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor al crear sala.' });
        }
    },

    // Actualizar una sala existente
    async updateSala(req, res) {
        try {
            const { id } = req.params;
            const { nombre, filas, columnas, pelicula_id } = req.body;

            const sala = await Sala.findByPk(id);
            if (!sala) {
                return res.status(404).json({ mensaje: 'Sala no encontrada.' });
            }

            // Opcional: Validar si la pelicula_id existe si se proporciona o si se desasigna (null)
            if (pelicula_id !== undefined) {
                if (pelicula_id !== null) { // Si no es null, debe existir
                    const pelicula = await Pelicula.findByPk(pelicula_id);
                    if (!pelicula) {
                        return res.status(400).json({ mensaje: 'La película especificada no existe.' });
                    }
                }
            }

            // Actualiza los campos y guarda
            sala.nombre = nombre !== undefined ? nombre : sala.nombre;
            sala.filas = filas !== undefined ? filas : sala.filas;
            sala.columnas = columnas !== undefined ? columnas : sala.columnas;
            sala.pelicula_id = pelicula_id !== undefined ? pelicula_id : sala.pelicula_id;

            await sala.save();

            res.status(200).json({ mensaje: 'Sala actualizada exitosamente.', sala });
        } catch (error) {
            console.error('Error al actualizar sala:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor al actualizar sala.' });
        }
    },

    // Eliminar una sala
    async deleteSala(req, res) {
        try {
            const { id } = req.params;
            const resultado = await Sala.destroy({ where: { id } });

            if (resultado === 0) {
                return res.status(404).json({ mensaje: 'Sala no encontrada.' });
            }
            res.status(200).json({ mensaje: 'Sala eliminada exitosamente.' });
        } catch (error) {
            console.error('Error al eliminar sala:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor al eliminar sala.' });
        }
    }
};


module.exports = salaController;
