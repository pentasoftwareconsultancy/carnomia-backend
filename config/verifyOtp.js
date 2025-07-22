import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";

export const verifyOtp = async (req, res) => {
  const { email, mobile, otp } = req.body;

  console.log("Verify OTP request:", { email, mobile, otp });
  try {
    const user = await User.findOne({ mobile });

    console.log("user found:", user);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpires < new Date())
      return res.status(400).json({ message: "OTP expired" });

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email || null,
      mobile: user.mobile,
      role: user.role,
    });

    console.log("Generated token from verified:", token);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        userId: user._id,
        email: user.email || null,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
