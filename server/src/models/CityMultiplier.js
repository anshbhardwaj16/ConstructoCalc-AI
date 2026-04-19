import mongoose from "mongoose";

const cityMultiplierSchema = new mongoose.Schema(
  {
    city_name: { type: String, required: true, unique: true, trim: true },
    multiplier: { type: Number, required: true }
  },
  { timestamps: true }
);

export const CityMultiplier = mongoose.model("CityMultiplier", cityMultiplierSchema);
