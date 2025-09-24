const express = require("express");
const router = express.Router();
const EventResourcesController = require("../../controllers/EventResourceController");


router.get("/:eventId", EventResourcesController.getResourcesByEventId);

module.exports = router;
