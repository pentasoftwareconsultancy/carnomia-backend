import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      mobile: user.mobile,
      role: user.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};

export default generateToken;
