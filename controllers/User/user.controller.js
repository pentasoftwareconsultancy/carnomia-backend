import generateToken from "../../utils/generateToken.js";
import client from "../../utils/twilioClient.js";
import { generateOtp } from "../../utils/generateOtp.js";
import User from "../../models/User.model.js";

export const registerUser = async (req, res) => {
  const { name, email, mobile, city, designation, password, role } = req.body;

  if (!name || !email || !mobile || !designation || !password || !role) {
    return res
      .status(400)
      .json({ error: "All required fields must be filled" });
  }

  try {
    const existingUser = await Sign.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Sign({
      name,
      email,
      mobile,
      city,
      designation,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


export const loginUser = async (req, res) => {
  const { email, mobile } = req.body;

  // Email login for drivesta roles
  if (email) {
    if (!email.endsWith("@drivesta.com")) {
      return res
        .status(400)
        .json({ message: "Please login with mobile number and OTP" });
    }

    const prefix = email.split("@")[0];
    const roleGuess = prefix.split(".").pop();
    const validRoles = ["engineer", "admin", "superadmin"];
    if (!validRoles.includes(roleGuess)) {
      return res
        .status(400)
        .json({ message: "Please login with mobile number and OTP" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, role: roleGuess });
      await user.save();
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Email login successful",
      token,
      user: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });
  }

  // Mobile number login (Send OTP)
  if (mobile) {
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await userModel.findOne({ mobile });
    if (!user) {
      user = new userModel({ mobile, role: "customer" });
    }

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    try {
      await client.messages.create({
        body: `Your OTP for Drivesta login is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${mobile}`, 
      });

      // console.log("FROM:", process.env.TWILIO_PHONE_NUMBER);

      return res.status(200).json({
        message: "OTP sent to your mobile number : " + otp,
        mobile: user.mobile, 
      });
    } catch (error) {
      console.error("Twilio Error:", error);
      return res.status(500).json({ message: "Failed to send OTP" });
    }
  }

  return res
    .status(400)
    .json({ message: "Please provide email or mobile number" });
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const getusers = async (req, res) => {
  try {
    const users = await userModel.find({ role: "customer" });
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

