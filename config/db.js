import mongoose from "mongoose";
const connectDb = async()=>{
   try {
    await mongoose.connect(process.env.MONGOOSE_URL)
    console.log("Connect db successfully")
} catch (error) {
    console.log("db error",error)
}
}
export default connectDb