import express from "express";
import {
  getProjectReport,
  getProjects,
  saveProject
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/", saveProject);
router.get("/", getProjects);
router.get("/:id/report", getProjectReport);

export default router;
