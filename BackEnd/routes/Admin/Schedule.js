const express = require("express");
const router = express.Router();
const scheduleController = require("../../controllers/schedules");

// Crear nueva cita
router.post("/", scheduleController.createSchedule);

// Listar todas las citas
router.get("/", scheduleController.getAllSchedules);

// Cambiar estado de la cita
router.put("/:id", scheduleController.updateScheduleStatus);

module.exports = router;