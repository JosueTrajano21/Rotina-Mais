const express = require("express");
const router = express.Router();
const atividadesController = require("../controllers/atividadesController");

router.get("/", atividadesController.index);
router.post('/', atividadesController.create);


module.exports = router;
