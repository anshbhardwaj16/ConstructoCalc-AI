import mongoose from "mongoose";

const materialItemSchema = new mongoose.Schema(
  {
    quantity: Number,
    rate: Number,
    cost: Number
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    input: {
      plotSize: Number,
      floors: Number,
      quality: String,
      city: String,
      customCity: String,
      materialPreference: String,
      inflationPercent: Number
    },
    result: {
      builtUpArea: Number,
      cityMultiplier: Number,
      qualityMultiplier: Number,
      materialPreferenceMultiplier: Number,
      inflationMultiplier: Number,
      quantities: {
        cement: materialItemSchema,
        steel: materialItemSchema,
        sand: materialItemSchema,
        bricks: materialItemSchema
      },
      materialCost: Number,
      laborCost: Number,
      totalCost: Number
    },
    aiInsights: {
      explanation: String,
      optimization: [String],
      risks: [String]
    },
    reportUrl: String
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
