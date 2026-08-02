import Post from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
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
    const posts = await Post.find()
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

export const deletePost=async(req,res)=>{
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
}