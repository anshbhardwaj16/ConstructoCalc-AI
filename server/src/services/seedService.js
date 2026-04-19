import { CityMultiplier } from "../models/CityMultiplier.js";
import { MaterialRate } from "../models/MaterialRate.js";
import { User } from "../models/User.js";
import { defaultCityMultipliers, defaultMaterialRates } from "../seed/defaultData.js";

export const seedDefaults = async () => {
  const rateCount = await MaterialRate.countDocuments();
  if (!rateCount) {
    await MaterialRate.create(defaultMaterialRates);
  }

  const cityCount = await CityMultiplier.countDocuments();
  if (!cityCount) {
    await CityMultiplier.insertMany(defaultCityMultipliers);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: "ConstructoCalc Admin",
        email: adminEmail,
        password: "Admin@123",
        role: "admin"
      });
    }
  }
};
