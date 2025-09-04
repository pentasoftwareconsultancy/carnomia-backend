// import jwt from "jsonwebtoken";
// import User from "../models/Customer/userModel.js";

// const authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;
//   console.log("Token from cookies:", token);
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   const decoded = jwt.verify(token, process.env.SECRET_KEY);
//   console.log("Decoded token:", decoded);
//   const user = await User.findById(decoded.userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   if (
//     user.role !== "superadmin" ||
//     user.role !== "admin" ||
//     user.role !== "engineer"
//   ) {
//     return res.status(403).json({
//       succes: false,
//       message: "Access denied, insufficient permissions",
//     });
//   }

//   next();
// };

// export default authMiddleware;


import jwt from "jsonwebtoken";

const authMiddlewares = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log("Authorization header:", authHeader);
  

  // Check if Authorization header is present and starts with 'Bearer '
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    // console.log("Token extracted from header:", token);
    

    try {
      // Verify token
      // console.log("Decoded token:", token);
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // Attach user data to request object
      req.user = {
        id: decoded._id,
        name: decoded.name,
        mobile: decoded.mobile,
        role: decoded.role, 
      };
      
      // req.user= user;
      // console.log("User from token:", req.user);
      next(); // Proceed to the next middleware/controller
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Authorization token missing" });
  }
};

export default authMiddlewares;
