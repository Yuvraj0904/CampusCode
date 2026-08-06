import User from "../models/user.models.js";
import getRank from "../utils/getRank.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts",
        },
      },

      {
        $addFields: {
          totalPosts: {
            $size: "$posts",
          },

          totalFollowers: {
            $size: "$followers",
          },
        },
      },

      {
        $project: {
          name: 1,
          username: 1,
          avatar: 1,
          points: 1,
          totalPosts: 1,
          totalFollowers: 1,
        },
      },

      {
        $sort: {
          points: -1,
        },
      },

      {
        $limit: 50,
      },
    ]);

    const rankedUsers = leaderboard.map((user, index) => ({
      position: index + 1,
      ...user,
      rankTitle: getRank(user.points),
    }));

    return res.status(200).json({
      success: true,
      count: rankedUsers.length,
      leaderboard: rankedUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};