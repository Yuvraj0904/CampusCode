import User from "../models/user.models.js";
import Post from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";
import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import PointHistory from "../models/pointHistory.model.js";
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalComments,
      totalProjects,
      verifiedUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
      Post.countDocuments({ postType: "Project" }),
      User.countDocuments({ isVerified: true }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        totalProjects,
        verifiedUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
    if (post.images.length > 0) {
      for (const image of post.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
    await Comment.deleteMany({
      post: post._id,
    });
    await Notification.deleteMany({
      post: post._id,
    });
    await PointHistory.deleteMany({
      referenceId: post._id,
      referenceModel: "Post",
    });
    await Post.findByIdAndDelete(post._id);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const toggleBanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "You cannot ban another admin.",
      });
    }

    user.isBanned = !user.isBanned;

    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isBanned
        ? "User banned successfully."
        : "User unbanned successfully.",
      isBanned: user.isBanned,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const togglePinPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    post.isPinned = !post.isPinned;

    await post.save();

    return res.status(200).json({
      success: true,
      message: post.isPinned
        ? "Post pinned successfully."
        : "Post unpinned successfully.",
      isPinned: post.isPinned,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const toggleVerifyPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    post.isVerified = !post.isVerified;

    await post.save();

    return res.status(200).json({
      success: true,
      message: post.isVerified
        ? "Project verified successfully."
        : "Project verification removed.",
      isVerified: post.isVerified,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};