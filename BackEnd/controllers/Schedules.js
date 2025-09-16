const ScheduleModel = require("../models/Schedule");

exports.createSchedule = async (req, res) => {
  try {
    const { RequestDate, RequestDescription, RequestType, UserId } = req.body;
    if (!RequestDate || !RequestDescription || !RequestType || !UserId) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const [result] = await ScheduleModel.addSchedule({
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
};

exports.getAllSchedules = async (req, res) => {
  try {
    const [schedules] = await ScheduleModel.getAllSchedules();
    res.json(schedules);
  } catch (err) {
    console.error("Error obteniendo citas:", err);
    res.status(500).json({ error: "Error al obtener citas" });
  }
};

exports.updateScheduleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { RequestStatus } = req.body;
    if (!RequestStatus) {
      return res.status(400).json({ error: "El estado es requerido" });
    }

    await ScheduleModel.updateScheduleStatus(id, RequestStatus);
    res.json({ message: "Estado de cita actualizado correctamente" });
  } catch (err) {
    console.error("Error actualizando cita:", err);
    res.status(500).json({ error: "Error al actualizar la cita" });
  }
};