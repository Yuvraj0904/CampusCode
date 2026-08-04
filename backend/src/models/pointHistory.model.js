import mongoose from "mongoose";

const pointHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    points: {
      type: Number,
      required: true,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceModel",
    },
    referenceModel: {
      type: String,
      enum: ["Post", "Comment", "User", "Badge", "Hackathon"],
    },
  },
  {
    timestamps: true,
  },
);

const PointHistory = mongoose.model("PointHistory", pointHistorySchema);

export default PointHistory;
