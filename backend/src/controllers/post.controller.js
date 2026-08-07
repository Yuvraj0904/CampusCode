import Post from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import createNotification from "../utils/createNotification.js";
import User from "../models/user.models.js";
import updatePoints from "../utils/updatePoints.js";
import { POINTS } from "../constants/points.js";
export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      postType,
      tags,
      githubLink,
      liveDemoLink,
      youtubeLink,
    } = req.body;
    // Validation
    if (!title || !content || !postType) {
      return res.status(400).json({
        success: false,
        message: "Title, content and post type are required.",
      });
    }
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "CampusCode/posts",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );

          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const post = await Post.create({
      author: req.user._id,
      title,
      content,
      postType,
      images: uploadedImages,
      tags,
      githubLink,
      liveDemoLink,
      youtubeLink,
    });
    await updatePoints({
      userId: req.user._id,
      points: POINTS.CREATE_POST,
      action: "CREATE_POST",
      referenceId: post._id,
      referenceModel: "Post",
    });
    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//fetch all the posts by all the users..
export const getAllPosts = async (req, res) => {
  try {
    //limit the post fecth at one time from db..
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    //count the total post in db..
    const totalPosts = await Post.countDocuments();
    //total page required ...
    const totalPages = Math.ceil(totalPosts / limit);

    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
  const posts = await Post.find()
    .populate("author", "name username avatar")
    .sort({
      isPinned: -1,
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

    return res.status(200).json({
      success: true,

      currentPage: page,
      totalPages,
      totalPosts,

      hasNextPage,
      hasPreviousPage,

      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//fetch the post of a user

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name username avatar",
    );
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
    post.views += 1;
    await post.save();
    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const {
      title,
      content,
      postType,
      tags,
      githubLink,
      liveDemoLink,
      youtubeLink,
    } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Only owner can edit
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post.",
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.postType = postType || post.postType;
    post.tags = tags || post.tags;
    post.githubLink = githubLink || post.githubLink;
    post.liveDemoLink = liveDemoLink || post.liveDemoLink;
    post.youtubeLink = youtubeLink || post.youtubeLink;

    post.isEdited = true;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      post,
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
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post.",
      });
    }
    // Delete all images from Cloudinary
    for (const image of post.images) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
    // Delete post from MongoDB
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

export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.user._id.toString(),
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString(),
      );

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post unliked successfully.",
        likes: post.likes.length,
      });
    }

    post.likes.push(req.user._id);

    await post.save();

    if (post.author.toString() !== req.user._id.toString()) {
      await updatePoints({
        userId: post.author,
        points: POINTS.RECEIVE_LIKE,
        action: "RECEIVE_LIKE",
        referenceId: post._id,
        referenceModel: "Post",
      });
    }
    await createNotification({
      recipient: post.author,
      sender: req.user._id,
      type: "like",
      post: post._id,
    });

    return res.status(200).json({
      success: true,
      message: "Post liked successfully.",
      likes: post.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleSavePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Get current user
    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedPosts.some((id) => id.toString() === postId);

    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId,
      );

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Post removed from saved posts.",
      });
    }

    user.savedPosts.push(postId);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Post saved successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedPosts",
      populate: {
        path: "author",
        select: "name username avatar",
      },
    });

    return res.status(200).json({
      success: true,
      count: user.savedPosts.length,
      posts: user.savedPosts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const posts = await Post.find({
      $or: [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          content: {
            $regex: q,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: q,
            $options: "i",
          },
        },
      ],
    })
      .populate("author", "name username avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getTrendingPosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $addFields: {
          trendingScore: {
            $add: [
              "$views",
              {
                $multiply: [
                  {
                    $size: "$likes",
                  },
                  3,
                ],
              },
              {
                $multiply: ["$commentsCount", 5],
              },
            ],
          },
        },
      },

      {
        $sort: {
          trendingScore: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    await Post.populate(posts, {
      path: "author",
      select: "name username avatar",
    });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
