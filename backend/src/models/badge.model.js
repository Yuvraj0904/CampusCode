import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: "",
    },

    pointsRequired: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
