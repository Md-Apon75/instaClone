import isAuth from "../middleware/isAuth.js";
import express from 'express'
import { upload } from "../middleware/multer.js";
import { getStoryByUserName, uploadStory, viewStory } from "../controllers/story.js";


const storyRouter= express.Router()



storyRouter.post("/upload",isAuth,upload.single("media"),uploadStory)
storyRouter.get("/getByUserName/:userName",isAuth,getStoryByUserName)
storyRouter.get("/view/:storyId", isAuth, viewStory)


export default storyRouter
