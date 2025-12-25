import bcrypt from 'bcryptjs'
import genToken from '../config/token.js'
import User from '../models/userModel.js'
import sentMail from '../config/Mail.js'
export const signUp = async(req,res)=>{
try {
  const {name,username,email,password} = req.body
const findByUserName = await User.findOne({username})
if(findByUserName){
  return res.status(400).json({message:"Username is already exists"})
}
const findByEmail = await User.findOne({email})
if(findByEmail){
  return res.status(400).json({message:"Email is already exists"})
}
const passwordHash = await bcrypt.hash(password,10)
const user =await User.create({
  name,
  username,
  email,
  password:passwordHash
}) 

const token = await genToken(user._id)

res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10*365*24*60*60*1000,
      secure: false,
      sameSite: "Strict"
    })
    return res.status(201).json(user)
} catch (error) {
  
}

}
export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" })
    }
    const token = await genToken(user._id)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict"
    })
    return res.status(200).json(user)
  } catch (error) { console.log("signIn ", error)
     res.status(500).json({ message: "Internal server error" })}
} 

export const signOut = async(req,res)=>{
    try { res.clearCookie("token")
        return res.status(200).json({message:"Successfullt logout"})
    } catch (error) {
        console.log("Signout",error)
    }
}

export const setOtp =async (req,res)=>{
  const {email} = req.body
  const user = await User.findOne({email})
  if(!user){
    return res.status(400).json({message:"User not found "})
  }
  const otp = Math.floor(1000 + Math.random()* 9000).toString()
  user.resetOtp = otp,//user er jonno generate kora otp
  user.otpExpires =  Date.now() + 5*60*1000
  user.isOtpVerified = false
  await user.save()
   await sentMail(email,otp)
   return res.status(200).json({message:"Email send successfully"})
}  

export const  verifyOtp = async(req,res)=>{
  const {email,otp} = req.body
  const user = await User.findOne({email})
  if(!user|| user.resetOtp != otp || user.otpExpires < Date.now()){
    return res.status(400).json({message:"invalid otp"})
  }
  user.isOtpVerified = true
  user.resetOtp = undefined
  user.otpExpires = undefined
  await user.save()
  
  return res.status(200).json({message:"Otp verified"})

}

export const resetPassword = async (req,res)=>{
  const {email,password} = req.body
  const user = await User.findOne({email})
  if(!user || !user.isOtpVerified){
    return res.status(400).json({message:"Otp verification required"})
  }
  const hashedPassword = await bcrypt.hash(password,10)
  user.password = hashedPassword
  user.isOtpVerified= false
  await user.save()
  return res.status(200).json({message:"password reset successfully"})
}