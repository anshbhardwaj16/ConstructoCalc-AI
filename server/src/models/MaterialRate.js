import mongoose from "mongoose";

const materialRateSchema = new mongoose.Schema(
  {
    cement_per_bag: { type: Number, required: true },
    steel_per_kg: { type: Number, required: true },
    sand_per_ton: { type: Number, required: true },
    brick_per_unit: { type: Number, required: true },
    labor_percentage: { type: Number, required: true, default: 0.35 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const MaterialRate = mongoose.model("MaterialRate", materialRateSchema);
