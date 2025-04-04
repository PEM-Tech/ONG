const express = require("express");
const router = express.Router();
const anamneseController = require("../controllers/anamneseController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, anamneseController.createAnamnese);
router.get("/", authMiddleware, anamneseController.getAllAnamneses);
router.get("/:id", authMiddleware, anamneseController.getAnamneseById);
router.put("/:id", authMiddleware, anamneseController.updateAnamnese);
router.delete("/:id", authMiddleware, anamneseController.deleteAnamnese);


module.exports = router;
