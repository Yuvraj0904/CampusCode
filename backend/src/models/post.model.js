import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // Owner
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Details
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    // Images
    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    // Post Type
    postType: {
      type: String,
      enum: [
        "Project",
        "Blog",
        "Interview",
        "Achievement",
        "Hackathon",
        "Question",
      ],
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Tags
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Project Links
    githubLink: {
      type: String,
      default: "",
    },

    liveDemoLink: {
      type: String,
      default: "",
    },

    youtubeLink: {
      type: String,
      default: "",
    },

    // Social
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Statistics
    commentsCount: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },

    // Admin
    isPinned: {
      type: Boolean,
      default: false,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("Post", postSchema);

export default Post;
