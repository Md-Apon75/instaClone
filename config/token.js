import jwt from 'jsonwebtoken'
 
const genToken = async(userID)=>{
    const token =await jwt.sign({userID},process.env.JWT_SECRET,{expiresIn:"10y"})
    return token
}
export default genToken