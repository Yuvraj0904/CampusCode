import User from "../models/user.models.js";
import PointHistory from "../models/pointHistory.model.js";

const updatePoints = async ({
  userId,
  points,
  action,
  referenceId = null,
  referenceModel = null,
}) => {
  // Update user's total points
  await User.findByIdAndUpdate(userId, {
    $inc: {
      points,
    },
  });

  // Save point history
  await PointHistory.create({
    user: userId,
    action,
    points,
    referenceId,
    referenceModel,
  });
};

export default updatePoints;
