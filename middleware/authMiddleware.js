import jwt from "jsonwebtoken";
import User from "../models/Customer/userModel.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token from cookies:", token);
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  console.log("Decoded token:", decoded);
  const user = await User.findById(decoded.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    user.role !== "superadmin" ||
    user.role !== "admin" ||
    user.role !== "engineer"
  ) {
    return res.status(403).json({
      succes: false,
      message: "Access denied, insufficient permissions",
    });
  }

  next();
};

export default authMiddleware;
