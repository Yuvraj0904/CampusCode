import mongoose from "mongoose";
import dotenv from "dotenv";

import Badge from "../models/badge.model.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await Badge.deleteMany();

await Badge.insertMany([
  {
    name: "First Post",
    description: "Created your first post.",
    pointsRequired: 10,
  },
  {
    name: "Contributor",
    description: "Earned 100 reputation points.",
    pointsRequired: 100,
  },
  {
    name: "Active Dev",
    description: "Earned 500 reputation points.",
    pointsRequired: 500,
  },
  {
    name: "Core Contributor",
    description: "Earned 1500 reputation points.",
    pointsRequired: 1500,
  },
  {
    name: "Community Lead",
    description: "Earned 5000 reputation points.",
    pointsRequired: 5000,
  },
]);

console.log("Badges Seeded Successfully");

process.exit();
