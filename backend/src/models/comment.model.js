import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // Which post this comment belongs to
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    // Who wrote the comment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Comment text
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // Edited flag
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
