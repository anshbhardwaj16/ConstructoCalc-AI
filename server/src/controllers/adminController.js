import { MaterialRate } from "../models/MaterialRate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateMaterialRates = asyncHandler(async (req, res) => {
  const current = await MaterialRate.findOne({ isActive: true }).sort({ createdAt: -1 });
  if (current) {
    current.isActive = false;
    await current.save();
  }

  const newRates = await MaterialRate.create({
    ...req.body,
    isActive: true
  });

  res.status(201).json(newRates);
});
