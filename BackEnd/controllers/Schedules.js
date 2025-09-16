// controllers/schedules.js
const ScheduleModel = require("../models/Schedule");

// --- Obtener todas las citas ---
async function getAllSchedules(req, res) {
  try {
    const schedules = await ScheduleModel.getAllSchedules();
    res.json(schedules);
  } catch (err) {
    console.error("Error obteniendo citas:", err);
    res.status(500).json({ error: "Error al obtener citas" });
  }
}

// --- Crear nueva cita ---
async function createSchedule(req, res) {
  try {
    const { RequestDate, RequestDescription, RequestType, UserId } = req.body;

    if (!RequestDate || !RequestDescription || !RequestType || !UserId) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Validación de tipo
    const validTypes = ["schedule_appointment", "cancel_event", "document_change"];
    if (!validTypes.includes(RequestType)) {
      return res.status(400).json({ error: "Tipo de solicitud inválido" });
    }

    const result = await ScheduleModel.addSchedule({
      RequestDate,
      RequestDescription,
      RequestType,
      UserId,
    });

    res.status(201).json({
      message: "Cita creada correctamente",
      scheduleId: result.insertId,
    });
  } catch (err) {
    console.error("Error creando cita:", err);
    res.status(500).json({ error: "Error al crear la cita" });
  }
}

// --- Actualizar estado de cita ---
async function updateScheduleStatus(req, res) {
  try {
    const { id } = req.params;
    const { RequestStatus } = req.body;

    if (!RequestStatus) {
      return res.status(400).json({ error: "El estado es requerido" });
    }

    const result = await ScheduleModel.updateScheduleStatus(id, RequestStatus);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.json({ message: "Estado de cita actualizado correctamente" });
  } catch (err) {
    console.error("Error actualizando cita:", err);
    res.status(500).json({ error: "Error al actualizar la cita" });
  }
}

// --- Exportar todas las funciones juntas ---
module.exports = { getAllSchedules, createSchedule, updateScheduleStatus };