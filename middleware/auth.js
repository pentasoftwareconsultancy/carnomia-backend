import jwt from "jsonwebtoken";
import User from "../models/Customer/userModel.js";

const auth = (role = []) => {
  if (typeof role === "string") role = [role];

  return async (req, res, next) => {
    try {
      const token = req.cookies.token;

      console.log("Token received:", token);
      if (!token) return res.status(401).json({ message: "No token provided" });

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (role.length && !role.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      console.log("Decoded token:", decoded);
      // const user = await User.findById(decoded.userId);
      const user = await User.findOne({ mobile: decoded.mobile });
      console.log("Decoded user:", user);
      if (!user) return res.status(401).json({ message: "User not found" });

      req.customer = user; //So controller can access req.customer._id
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export default auth;
