import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { seedDefaults } from "./services/seedService.js";

dotenv.config();

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb();
    await seedDefaults();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed", error);
    process.exit(1);
  }
};

start();
