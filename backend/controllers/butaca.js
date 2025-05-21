const Butaca = require('../models/butaca');
const Reservacion = require('../models/reservacion');
const Sala = require('../models/sala'); 

const butaca = {
  async getButacasEstado(req, res) {
    try {
      const { salaId, fecha } = req.params;       
      if (!salaId || !fecha) {
        return res.status(400).json({ mensaje: 'ID de sala y fecha son requeridos.' });
      }

      const sala = await Sala.findById(salaId);
      if (!sala) {
        return res.status(404).json({ mensaje: 'Sala no encontrada.' });
      }

      // Validar que la fecha esté dentro de los 8 días
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); 
      const fechaReserva = new Date(fecha);
      fechaReserva.setHours(0, 0, 0, 0); 
      
      const diffTime = Math.abs(fechaReserva.getTime() - hoy.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (fechaReserva < hoy || diffDays > 7) { 
        return res.status(400).json({ mensaje: 'La fecha de reserva debe ser hoy o en los próximos 7 días.' });
      }

      // 1. Obtener todas las butacas físicas (plano) de la sala
      const todasLasButacas = await Butaca.findBySalaId(salaId);

      // 2. Obtener los asientos que ya están reservados para esta fecha y sala
      const asientosReservadosParaFecha = await Reservacion.findConfirmedBySalaAndFecha(salaId, fecha);
      const reservedKeys = new Set(asientosReservadosParaFecha.map(b => `${b.fila}-${b.columna}`));

      // 3. Determinar el estado de cada butaca para esta fecha
      const butacasConEstado = todasLasButacas.map(butaca => {
        const key = `${butaca.fila}-${butaca.columna}`;
        return {
          id: butaca.id,
          sala_id: butaca.sala_id,
          fila: butaca.fila,
          columna: butaca.columna,
          estado: reservedKeys.has(key) ? 'reservado' : 'disponible',
        };
      });

      res.status(200).json(butacasConEstado);

    } catch (error) {
      console.error('Error al obtener estado de butacas:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  },
};

module.exports = butaca;
