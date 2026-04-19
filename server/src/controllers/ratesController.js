import { CityMultiplier } from "../models/CityMultiplier.js";
import { MaterialRate } from "../models/MaterialRate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getRates = asyncHandler(async (req, res) => {
  const [materialRates, cityMultipliers] = await Promise.all([
    MaterialRate.findOne({ isActive: true }).sort({ createdAt: -1 }),
    CityMultiplier.find().sort({ city_name: 1 })
  ]);

  res.json({ materialRates, cityMultipliers });
});
