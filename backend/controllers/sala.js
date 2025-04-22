const salaModel = require('../models/sala');

async function crearSala(req, res) {
    try {
        const { nombre, pelicula_id, filas, columnas } = req.body;
        const salaId = await salaModel.crearSala(nombre, pelicula_id, filas, columnas);
        res.status(201).json({ id: salaId, mensaje: 'Sala creada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la sala', error: error.message });
    }
}

async function obtenerSalas(req, res) {
    try {
        const salas = await salaModel.obtenerSalas();
        res.status(200).json(salas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las salas', error: error.message });
    }
}

async function obtenerSalaPorId(req, res) {
    try {
        const { id } = req.params;
        const sala = await salaModel.obtenerSalaPorId(id);
        if (sala) {
            res.status(200).json(sala);
        } else {
            res.status(404).json({ mensaje: 'Sala no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la sala', error: error.message });
    }
}

async function actualizarSala(req, res) {
    try {
        const { id } = req.params;
        const { nombre, pelicula_id, filas, columnas } = req.body;
        const actualizado = await salaModel.actualizarSala(id, nombre, pelicula_id, filas, columnas);
        if (actualizado) {
            res.status(200).json({ mensaje: 'Sala actualizada exitosamente' });
        } else {
            res.status(404).json({ mensaje: 'Sala no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la sala', error: error.message });
    }
}

async function eliminarSala(req, res) {
    try {
        const { id } = req.params;
        const eliminado = await salaModel.eliminarSala(id);
        if (eliminado) {
            res.status(200).json({ mensaje: 'Sala eliminada exitosamente' });
        } else {
            res.status(404).json({ mensaje: 'Sala no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la sala', error: error.message });
    }
}

module.exports = {
    crearSala,
    obtenerSalas,
    obtenerSalaPorId,
    actualizarSala,
    eliminarSala
};
