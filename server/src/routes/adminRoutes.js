import express from "express";
import { updateMaterialRates } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, adminOnly);
router.post("/rates", updateMaterialRates);

export default router;
