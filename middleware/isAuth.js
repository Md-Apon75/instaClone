import jwt from "jsonwebtoken";
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "token is not found" });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userID;
    next();
  } catch (error) {
    console.log("isAuth error", error);
    return res.status(401).json({ message: "invalid or expired token" });
  }
}
export default isAuth

	
