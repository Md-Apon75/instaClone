import uploadCloudinary from '../config/cloudinary.js';
import Loop from '../models/loopModel.js';
import User from "../models/userModel.js";

export const uploadLoop = async (req, res) => {
    try {
        const { caption } = req.body;
        let mediaType = req.body.mediaType || (req.file?.mimetype.includes("image") ? "image" : "video");
        let media;
        
        if (req.file) {
            media = await uploadCloudinary(req.file.path);
        } else {
            return res.status(400).json({ message: "media must required" });
        }
        
        const loop = await Loop.create({
            caption, 
            media, 
            mediaType, 
            author: req.userId
        });
        
        const user = await User.findById(req.userId);
        user.loops.push(loop._id);
        await user.save();
        
        const populatedLoop = await Loop.findById(loop._id)
            .populate("author", "name userName profileImage");
        
        return res.status(201).json(populatedLoop); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const like = async (req, res) => {
    try {
        const loopId = req.params.loopId;
        console.log("Received loopId:", loopId);
        
        const loop = await Loop.findById(loopId);
        console.log("Found loop:", loop);
        
        if (!loop) {
            return res.status(400).json({ message: "loop not found" });
        }
        
        // Check if already liked
        const userIndex = loop.likes.indexOf(req.userId);
        
        if (userIndex === -1) {
            // Like
            loop.likes.push(req.userId);
        } else {
            // Unlike
            loop.likes.splice(userIndex, 1);
        }
        
        await loop.save();
        
        // Populate and return updated loop
        await loop.populate("author", "name userName profileImage");
        await loop.populate("comments.author", "name userName profileImage");
        
        return res.status(200).json(loop);
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const comment = async (req, res) => {
  try {
    const { loopId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    const loop = await Loop.findById(loopId);
    if (!loop) {
      return res.status(404).json({ message: "Loop not found" });
    }

    loop.comments.push({
      author: userId,
      message,
    });

    await loop.save();

    const populatedLoop = await loop.populate(
      "author comments.author",
      "username profileImage"
    );

    res.status(200).json(populatedLoop);
  } catch (error) {
    res.status(500).json({ message: "Comment failed", error });
  }
};


export const getAllLoops = async (req, res) => {
    try {
        const loops = await Loop.find({})
            .populate("author", "name userName profileImage")
            .populate("comments.author", "name userName profileImage")
            .sort({ createdAt: -1 }); // Latest first
        
        return res.status(200).json(loops);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};