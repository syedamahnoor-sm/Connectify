import Post from "../models/Post.js";
import cloudinary from "../config/Cloudinary.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    let mediaUrl = "";
    let mediaType = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      mediaUrl = uploadResult.secure_url;
      mediaType = uploadResult.resource_type;
    }
    if (!content && !media) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }
    const post = await Post.create({
      user: req.user.id,
      content: req.body.content,
      media: mediaUrl,
      mediaType,
    });

    res.status(201).json(post);

  } catch (error) {
    console.log("CREATE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name username profilePic")
      .populate("comments.user", "name username profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.log("GET POSTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

//DELETE POST
export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await post.deleteOne();

  res.json({ message: "Post deleted" });
};

//EDIT POST
export const editPost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  post.content = req.body.content || post.content;

  await post.save();

  res.json(post);
};

//LIKE BUTTON
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);

      const receiver = await User.findById(post.user);

      if (
        post.user.toString() !== userId &&
        receiver.settings?.pushNotifications
      ) {
        await Notification.create({
          recipient: post.user,
          sender: userId,
          type: "like",
          post: post._id,
        });
      }
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "name username profilePic");

    res.json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: req.user.id,
      text: req.body.text,
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("comments.user", "name username profilePic");

    res.json(populatedPost.comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
  const post = await Post.findById(req.params.postId);

  post.comments = post.comments.filter(
    (c) => c._id.toString() !== req.params.commentId
  );

  await post.save();

  res.json(post.comments);
};

// EDIT COMMENT
export const editComment = async (req, res) => {
  const post = await Post.findById(req.params.postId);

  const comment = post.comments.id(req.params.commentId);

  if (!comment) return res.status(404).json({ message: "Not found" });

  comment.text = req.body.text;

  await post.save();

  res.json(post.comments);
};