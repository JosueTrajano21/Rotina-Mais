const express = require("express");
const router = express.Router();
const ActivitiesController = require("../controllers/atividadesController");

router.get("/", ActivitiesController.index);

module.exports = router;
