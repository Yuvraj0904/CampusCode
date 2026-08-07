import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Profile
    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    avatar: {
      type: String,
      default: "",
    },

    // Academic
    college: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      enum: ["CSE", "IT", "ECE", "EEE", "ME", "CE", "Other"],
      default: "Other",
    },

    year: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th", "Passout"],
      default: "1st",
    },

    graduationYear: {
      type: Number,
    },

    // Skills
    skills: [
      {
        type: String,
      },
    ],

    // Social Links
    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    // Social
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    // Community
    points: {
      type: Number,
      default: 0,
    },

    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
    points: {
      type: Number,
      default: 0,
    },

    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    // Authentication
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifyToken: {
      type: String,
    },

    verifyTokenExpires: {
      type: Date,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
