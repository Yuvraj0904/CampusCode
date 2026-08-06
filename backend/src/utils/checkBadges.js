import User from "../models/user.models.js";
import Badge from "../models/badge.model.js";
import createNotification from "./createNotification.js";
const checkBadges = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) return;

    const badges = await Badge.find();

    for (const badge of badges) {
      // Already has this badge?
      const alreadyHasBadge = user.badges.some(
        (id) => id.toString() === badge._id.toString(),
      );

      if (alreadyHasBadge) continue;

      // Does user qualify?
  if (user.points >= badge.pointsRequired) {
    user.badges.push(badge._id);

    await createNotification({
      recipient: user._id,
      type: "badge",
      badge: badge._id,
    });

    console.log(`Badge unlocked: ${badge.name}`);
  }
    }

    await user.save();
  } catch (error) {
    console.log(error);
  }
};

export default checkBadges;