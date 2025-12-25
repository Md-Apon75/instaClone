import uploadCloudinary from "../config/cloudinary.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
export const uploadPost = async (req, res) => {
    try {
        const { caption, mediaType } = req.body
        let media;
        if (req.file) {
            media = await uploadCloudinary(req.file.path)
        } else {
            return res.status(400).json({ message: "media must required" })
        }
        const post = await Post.create({                   //postId generate hoi gelo 
            caption, media, mediaType, author: req.userId /*token create hocche req.userId er 
                                                          moode tai ekhn e req.userId holo author */                                 
        })
        const user = await User.findById(req.userId)
        user.posts.push(post._id)
        await user.save()
        const popilatedPost = await Post.findById(post._id).populate("author", "name username profileImage");
        return res.status(201).json(popilatedPost)
    } catch (error) {
        console.log(error)
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const post = await Post.find({})
          .populate("comments.author", "name username profileImage")
           .populate("author", "name username profileImage") 
           .sort({createdAt:-1})
        return res.status(200).json(post)
    } catch (error) {
        console.log(error)
    }
}

export const like = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }
    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate("author", "username profileImage")
      .populate("comments.author", "username profileImage");

    return res.status(200).json(populatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Like failed" });
  }
};


export const comment = async (req, res) => {
    try {
        const { message } = req.body
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found" })
        }
        post.comments.push({
            author: req.userId,
            message
        })
        await post.save()
       await post.populate("author", "name userName profileImage"),
         await   post.populate("comments.author")
        return res.status(200).json(post)
    } catch (error) {
        console.log(error)
    }
}

export const saved = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = await User.findById(req.userId);

    const alreadySaved = user.saved.some(id => id.toString() === postId.toString());

    if (alreadySaved) {
      user.saved = user.saved.filter(id => id.toString() !== postId.toString());
    } else {
      user.saved.push(postId);
    }

    await user.save();
    await user.populate("saved");

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
