import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import createNotification from "../utils/createNotification.js";
export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const comment = await Comment.create({
      post: post._id,
      user: req.user._id,
      content,
    });
    post.commentsCount += 1;
    await post.save();
    await createNotification({
      recipient: post.author,
      sender: req.user._id,
      type: "comment",
      post: post._id,
      comment: comment._id,
    });
    if (post.author.toString() !== req.user._id.toString()) {
      await updatePoints({
        userId: post.author,
        points: POINTS.RECEIVE_COMMENT,
        action: "RECEIVE_COMMENT",
        referenceId: comment._id,
        referenceModel: "Comment",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate("user", "name username avatar")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "comment content is required ",
      });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    //check the comment owner..
    if (comment.user.toString() != req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this comment.",
      });
    }
    comment.content = content;
    comment.isEdited = true;
    await comment.save();
    return res.status(200).json({
      success: true,
      message: "comment updated sucessfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Only comment owner can delete
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    // Decrease comments count
    const post = await Post.findById(comment.post);

    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save();
    }

    await Comment.findByIdAndDelete(comment._id);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};