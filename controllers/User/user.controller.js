import generateToken from "../../utils/generateToken.js";
import client from "../../utils/twilioClient.js";
import { generateOtp } from "../../utils/generateOtp.js";
import User from "../../models/User.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, city, password } = req.body;

    // Detect role by email
    let role = "customer";
    if (email.endsWith(".admin@drivesta.com")) {
      role = "admin";
    } else if (email.endsWith(".engineer@drivesta.com")) {
      role = "engineer";
    }

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Handle password for Admin & Engineer only
    let hashedPassword = null;
    if (role !== "customer") {
      if (!password) {
        return res
          .status(400)
          .json({ error: "Password is required for Admin and Engineer" });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = new User({
      name,
      email,
      mobile,
      city,
      role,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, mobile } = req.body;

  console.log("Login attempt:", { email, mobile, password });

  try {
    // Case 1: Admin / Engineer / SuperAdmin login via Email + Password
    if (email && password) {
      // Check allowed domain
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

      const user = await User.findOne({ email }).select("+password");

      console.log("from login " + user);

      if (!user) {
        return res.status(404).json({ message: "User not registered" });
      }

      if (!user.password) {
        return res
          .status(400)
          .json({ message: "This account has no password set" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const token = generateToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({
        message: "Login successful",
        token,
        user: {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
      });
    }

    // Case 2: Customer Login via Mobile OTP
    if (mobile) {
      if (!/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number" });
      }

      const otp = generateOtp();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      let user = await User.findOne({ mobile });

      if (!user) {
        user = new User({
          mobile,
          role: "customer",
        });
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

        return res.status(200).json({
          message: "OTP sent to your mobile number",
          mobile: user.mobile,
        });
      } catch (error) {
        console.error("Twilio Error:", error.message);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
    }

    return res.status(400).json({
      message: "Please provide email & password or mobile number",
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
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
    const users = await User.find({ role: "customer" });
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
