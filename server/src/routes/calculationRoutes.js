import express from "express";
import { calculateProject } from "../controllers/calculationController.js";

const router = express.Router();

router.post("/", calculateProject);

export default router;
