import express from 'express'
import { resetPassword, setOtp, signIn, signOut, signUp, verifyOtp } from '../controllers/auth.js'
import sentMail from '../config/Mail.js'

const authRouter= express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.post("/sendOtp",setOtp)
authRouter.post("/verifyOtp",verifyOtp)
authRouter.post("/resetPassword",resetPassword)
authRouter.get("/signout",signOut)
export default authRouter