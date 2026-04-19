import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateEstimate } from "../services/calculationService.js";

export const calculateProject = asyncHandler(async (req, res) => {
  const estimate = await calculateEstimate(req.body);
  res.json(estimate);
});
