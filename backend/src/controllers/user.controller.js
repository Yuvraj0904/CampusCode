import User from "../models/user.models.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import createNotification from "../utils/createNotification.js";
import PointHistory from "../models/pointHistory.model.js";
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
export const followUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;

    // Cannot follow yourself
    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself.",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const alreadyFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId,
    );

    if (alreadyFollowing) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user.",
      });
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    await createNotification({
      recipient: targetUser._id,
      sender: currentUser._id,
      type: "follow",
    });

    return res.status(200).json({
      success: true,
      message: "User followed successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;

    // Cannot unfollow yourself
    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself.",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    // Check if target user exists
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if current user is following target user
    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId,
    );

    if (!isFollowing) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user.",
      });
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId,
    );

    // Remove from followers
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId.toString(),
    );

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "CampusCode/avatars",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });
    user.avatar = result.secure_url;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully.",
      avatar: user.avatar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getUserActivity = async (req, res) => {
  try {
    const activities = await PointHistory.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "referenceId",
        select: "title content",
      });

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
