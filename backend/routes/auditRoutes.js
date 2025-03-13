const express = require("express");
const router = express.Router();
const auditController = require("../controllers/auditController");

router.get("/", auditController.getAllLogs);
router.post("/", auditController.createLog); // Caso queira criar logs manualmente

module.exports = router;
