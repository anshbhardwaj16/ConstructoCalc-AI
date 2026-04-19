import { Project } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateProjectPdf } from "../services/pdfService.js";

export const saveProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json(project);
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(projects);
});

export const getProjectReport = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const pdfBuffer = await generateProjectPdf(project);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${project.name.replace(/\s+/g, "_")}.pdf`);
  res.send(pdfBuffer);
});
