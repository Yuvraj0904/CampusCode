import User from "../models/user.models.js";
export const getMyProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      bio,
      college,
      branch,
      year,
      graduationYear,
      skills,
      github,
      linkedin,
      portfolio,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.college = college ?? user.college;
    user.branch = branch ?? user.branch;
    user.year = year ?? user.year;
    user.graduationYear = graduationYear ?? user.graduationYear;
    user.skills = skills ?? user.skills;
    user.github = github ?? user.github;
    user.linkedin = linkedin ?? user.linkedin;
    user.portfolio = portfolio ?? user.portfolio;
    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select(
      "-password -verifyToken -verifyTokenExpires -resetPasswordToken -resetPasswordExpires",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).select(
      "-password -verifyToken -verifyTokenExpires -resetPasswordToken -resetPasswordExpires",
    );

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};