import { CityMultiplier } from "../models/CityMultiplier.js";
import { MaterialRate } from "../models/MaterialRate.js";
import {
  MATERIAL_PREFERENCE_MULTIPLIERS,
  QUALITY_MULTIPLIERS
} from "../utils/constants.js";

export const calculateEstimate = async ({
  plotSize,
  floors,
  quality,
  city,
  customCity,
  customMultiplier,
  materialPreference = "default",
  inflationPercent = 0
}) => {
  const rates = await MaterialRate.findOne({ isActive: true }).sort({ createdAt: -1 });
  const cityEntry = city === "Custom"
    ? { city_name: customCity || "Custom", multiplier: Number(customMultiplier) || 1 }
    : await CityMultiplier.findOne({ city_name: city });

  const builtUpArea = Number(plotSize) * Number(floors) * 1.2;
  const qualityMultiplier = QUALITY_MULTIPLIERS[quality] || 1;
  const preferenceMultiplier =
    MATERIAL_PREFERENCE_MULTIPLIERS[materialPreference] || MATERIAL_PREFERENCE_MULTIPLIERS.default;
  const inflationMultiplier = 1 + Number(inflationPercent || 0) / 100;

  const quantities = {
    cement: {
      quantity: builtUpArea * 0.4,
      rate: rates.cement_per_bag * qualityMultiplier * preferenceMultiplier,
      cost: 0
    },
    steel: {
      quantity: builtUpArea * 4,
      rate: rates.steel_per_kg * qualityMultiplier * preferenceMultiplier,
      cost: 0
    },
    sand: {
      quantity: builtUpArea * 0.02,
      rate: rates.sand_per_ton * preferenceMultiplier,
      cost: 0
    },
    bricks: {
      quantity: builtUpArea * 8,
      rate: rates.brick_per_unit * qualityMultiplier,
      cost: 0
    }
  };

  Object.values(quantities).forEach((item) => {
    item.cost = item.quantity * item.rate;
  });

  const materialCost = Object.values(quantities).reduce((sum, item) => sum + item.cost, 0) * inflationMultiplier;
  const laborCost = materialCost * rates.labor_percentage;
  const cityMultiplier = cityEntry?.multiplier || 1;
  const totalCost = (materialCost + laborCost) * cityMultiplier;

  return {
    input: {
      plotSize: Number(plotSize),
      floors: Number(floors),
      quality,
      city: cityEntry?.city_name || city,
      customCity,
      materialPreference,
      inflationPercent: Number(inflationPercent || 0)
    },
    result: {
      builtUpArea,
      cityMultiplier,
      qualityMultiplier,
      materialPreferenceMultiplier: preferenceMultiplier,
      inflationMultiplier,
      quantities,
      materialCost,
      laborCost,
      totalCost
    }
  };
};
