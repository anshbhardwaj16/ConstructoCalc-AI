import dotenv from "dotenv";
import { connectDb } from "../config/db.js";
import { seedDefaults } from "../services/seedService.js";

dotenv.config();

const run = async () => {
  try {
    await connectDb();
    await seedDefaults();
    console.log("Seed completed");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
};

run();
