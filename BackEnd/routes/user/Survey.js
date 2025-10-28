const express = require("express");
const router = express.Router();
const surveyController = require("../../controllers/Survey");

// Rutas de la encuesta

router.post("/", surveyController.submitSurvey);

module.exports = router;