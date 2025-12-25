import { editProfile, follow, getCurrentUser, getProfile, suggestedUser } from "../controllers/user.js";
import isAuth from "../middleware/isAuth.js";
import express from 'express'
import { upload } from "../middleware/multer.js";

const userRouter= express.Router()


userRouter.get("/current",isAuth,getCurrentUser)
userRouter.get("/suggested",isAuth,suggestedUser)
userRouter.get("/follow/:targetuserId",isAuth,follow)
userRouter.post("/editprofile",isAuth,upload.single("profileImage"),editProfile)
userRouter.get("/getProfile/:username", isAuth, getProfile)

export default userRouter
