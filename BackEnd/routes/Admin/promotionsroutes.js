const express = require("express");
const router = express.Router();
const PromotionController = require("../../controllers/promotionController");

router.get("/", PromotionController.getPromotions);

/**/

module.exports = router;