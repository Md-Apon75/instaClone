import uploadCloudinary from '../config/cloudinary.js'
import User from '../models/userModel.js'
export const getCurrentUser=async(req,res)=>{
    try {
        const userId = req.userId
        const user= await User.findById(userId).populate("posts loops")
        if(!user){
            return res.status(401).json({message:"user not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(`getCurrentUser error ${error}`)
    }
}
export const suggestedUser = async (req,res)=>{
    const users = await User.find({
        _id:{$ne:req.userId}
    }).select("-password")
    return res.status(200).json(users)
}
export const editProfile = async (req, res) => {
    try {
        const { name, username, bio, profession, gender } = req.body;
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const sameUserWithUserName = await User.findOne({ username }).select("-password");
        if (sameUserWithUserName && sameUserWithUserName._id.toString() !== req.userId) {                                                                                             
            return res.status(400).json({ message: "Username already exists" });
        }
        let profileImage;
        if (req.file) {
            profileImage = await uploadCloudinary(req.file.path);
        }
           console.log("Uploaded profileImage URL:", profileImage);
        user.name = name || user.name;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.profession = profession || user.profession;
        if (gender) user.gender = gender.toLowerCase();
        if (profileImage) user.profileImage = profileImage;
        await user.save();
          console.log("User after update:", user);
         return res.status(200).json(user);

    } catch (error) {
        console.log("EditProfile Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getProfile= async(req,res)=>{
    const username = req.params.username
    const user = await User.findOne({username}).select("-password")
    if(!user){
        return res.status(400).json({message:"user is not found"})
    }
    return res.status(200).json(user)
}
export const follow = async (req,res)=>{
    try {
        const currentuserId = req.userId
        const targetuserId = req.params.targetuserId

        if(!targetuserId){
            return res.status(400).json({message:"target user not found"})
        }
        if(currentuserId==targetuserId){
            return res.status(400).json({message:"you can not be follow yourself"})
        }
        const currentUser = await User.findById(currentuserId)
        const targetUser = await User.findById(targetuserId)
       
         const isFollowing = currentUser.following.includes(targetuserId)
         if(isFollowing){
            currentUser.following= currentUser.following.filter(id=>id.toString()!=targetuserId)
            targetUser.followers = targetUser.followers.filter(id=>id.toString()!=currentuserId)
            await currentUser.save()
            await targetUser.save()
            return res.status(200).json({
                following:false,
                message:"unfollow successfullt"
            })
         }else{
            currentUser.following.push(targetuserId)
            targetUser.followers.push(currentuserId)
            await currentUser.save()
            await targetUser.save()
            return res.status(200).json({
                following:true,
                message:"Follow sucessfully"
            })
         }
    } catch (error) {
        console.log("follow error",error)
    }
}        




