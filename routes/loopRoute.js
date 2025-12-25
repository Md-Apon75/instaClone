import isAuth from "../middleware/isAuth.js";
import express from 'express'
import { upload } from "../middleware/multer.js";
import { comment, getAllLoops, like, uploadLoop } from "../controllers/loop.js";

const loopRouter= express.Router()


loopRouter.post("/upload",isAuth,upload.single("media"),uploadLoop)
loopRouter.get("/getAll",isAuth,getAllLoops)
loopRouter.get("/like/:loopId",isAuth,like)
loopRouter.get("/comment",isAuth,comment)
loopRouter.post("/comment/:loopId", isAuth, comment)



export default loopRouter