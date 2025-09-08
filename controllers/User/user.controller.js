import generateToken from "../../utils/generateToken.js";
import client from "../../utils/twilioClient.js";
import { generateOtp } from "../../utils/generateOtp.js";
import User from "../../models/User.model.js";
import bcrypt from "bcryptjs";

// export const registerUser = async (req, res) => {
//   try {
//     let { name, email, mobile, city, designation, password, role } = req.body;

//     // Detect role by email
//     // let role = "customer";
//     // if (email.endsWith(".admin@drivesta.com")) {
//     //   role = "admin";
//     // } else if (email.endsWith(".engineer@drivesta.com")) {
//     //   role = "engineer";
//     // }

//     // Check for duplicate email
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ error: "Email already exists" });
//     }

//     // Handle password for Admin & Engineer only
//     let hashedPassword = null;
//     // role = 'admin'
//     // password = "123456"
//     if (role !== "customer") {
//       if (!password) {
//         return res
//           .status(400)
//           .json({ error: "Password is required for Admin and Engineer" });
//       }
//       hashedPassword = await bcrypt.hash(password, 10);
//     }

//     const newUser = new User({
//       name,
//       email,
//       mobile,
//       city,
//       role,
//       designation,
//       password: hashedPassword,
//     });

//     const user = await newUser.save();
//     // console.log("User registered:", user);
//     res.status(201).json({id:user._id, message: `${role} registered successfully` });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ error: "Server error", detail: error.message });
//   }
// };
export const registerUser = async (req, res) => {
  try {
    let { name, email, mobile, city, designation, password, role } = req.body;

    // Default role if not provided
    if (!role) {
      role = "customer";
    }

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check for duplicate mobile
    if (mobile) {
      const existingMobile = await User.findOne({ mobile });
      if (existingMobile) {
        return res.status(400).json({ error: "Mobile already exists" });
      }
    }

    // Handle password for Admin & Engineer only
    let hashedPassword = null;

    // if (role !== "customer") {
    //   if (!password) {
    //     return res
    //       .status(400)
    //       .json({ error: "Password is required for Admin and Engineer" });
    //   }
    //   hashedPassword = await bcrypt.hash(password, 10);
    // }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      city,
      role,
      designation,
      password: hashedPassword,
    });

    const user = await newUser.save();
    console.log("User registered:", user);
    res
      .status(201)
      .json({ id: user._id, message: `${role} registered successfully` });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body }; // all fields from request body

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Handle duplicate email
    if (updates.email && updates.email !== user.email) {
      const existingEmail = await User.findOne({ email: updates.email });
      if (existingEmail) {
        return res.status(400).json({ success: false, error: "Email already in use" });
      }
    }

    // Hash password if provided
    if (updates.password && updates.password.trim() !== "" && updates.role !== "customer") {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password; // don't update if blank
    }

    // Merge updates into user document
    Object.keys(updates).forEach(key => {
      user[key] = updates[key]; // assign existing fields or add new fields dynamically
    });

    await user.save();
    res.status(200).json({
      success: true,
      message: `${user.role} updated successfully`,
      user,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, error: "Server error", detail: error.message });
  }
};

// export const loginUser = async (req, res) => {
//   const { name, email, password, mobile, otp } = req.body;

//   // console.log("Login attempt:", { email, mobile, password });

//   try {
//     // Case 1: Admin / Engineer / SuperAdmin login via Email + Password
//     if (email && password) {
//       // Check allowed domain
//       if (!email.endsWith("@carnomia.com")) {
//         return res
//           .status(400)
//           .json({ message: "Please login with mobile number and OTP" });
//       }

//       // const prefix = email.split("@")[0];
//       // const roleGuess = prefix.split(".").pop();
//       // const validRoles = ["engineer", "admin", "superadmin"];
//       // if (!validRoles.includes(roleGuess)) {
//       //   return res
//       //     .status(400)
//       //     .json({ message: "Please login with mobile number and OTP" });
//       // }

//       const user = await User.findOne({ email }).select("+password");

//       // console.log("from login " + user);

//       if (!user) {
//         return res.status(404).json({ message: "User not registered" });
//       }

//       if (!user.password) {
//         return res
//           .status(400)
//           .json({ message: "This account has no password set" });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);

//       if (!isMatch) {
//         return res.status(401).json({ message: "Incorrect password" });
//       }

//       const token = generateToken(user);

//       res.cookie("token", token, {
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000,
//       });

//       return res.json({
//         message: "Login successful",
//         token,
//         user: {
//           userId: user._id,
//           mobile: user.mobile,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     }

//     // verify OTP 
//     if(otp) {
//       console.log(otp)
//       return await verifyOtp(req, res)
//     }

//     // console.log("Mobile login attempt:", { mobile });
    
//     // Case 2: Customer Login via Mobile OTP
//     if (mobile) {
//       if (!/^\d{10}$/.test(mobile)) {
//         return res.status(400).json({ message: "Invalid mobile number" });
//       }

//       const otp = generateOtp();
//       const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//       let user = await User.findOne({ mobile });

//       if (!user) {
//         user = new User({
//           mobile,
//           role: "customer",
//         });
//       }

//       user.otp = otp;
//       user.otpExpires = otpExpires;
//       await user.save();

//       try {
//         await client.messages.create({
//           body: `Your OTP for Drivesta login is: ${otp}`,
//           from: process.env.TWILIO_PHONE_NUMBER,
//           to: `+91${mobile}`,
//         });

//         return res.status(200).json({
//           message: "OTP sent to your mobile number",
//           mobile: user.mobile,
//         });
//       } catch (error) {
//         console.error("Twilio Error:", error.message);
//         return res.status(500).json({ message: "Failed to send OTP" });
//       }
//     }

//     return res.status(400).json({
//       message: "Please provide email & password or mobile number",
//     });
//   } catch (err) {
//     console.error("Login error:", err.message);
//     return res.status(500).json({
//       error: "Server error",
//       detail: err.message,
//     });
//   }
// };

export const loginUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    // Case 1: Login with Email + Password
    if (email && password) {

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(404).json({ message: "User not registered" });
      }

      if (!user.password) {
        return res
          .status(400)
          .json({ message: "This account has no password set" });
      }

      // Check email domain for role-specific login
      if (
        ["admin", "engineer", "superadmin"].includes(user.role) &&
        !email.endsWith("@carnomia.com")
      ) {
        return res.status(400).json({
          message: "Admins/Engineers/SuperAdmins must login with carnomia.com email",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const token = generateToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.json({
        message: "Login successful",
        token,
        user: {
          userId: user._id,
          mobile: user.mobile,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // Case 2: Login with Mobile + Password
    if (mobile && password) {
      if (!/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number" });
      }

      const user = await User.findOne({ mobile }).select("+password");
      if (!user) {
        return res.status(404).json({ message: "User not registered" });
      }

      console.log("Logged In User: ", user);

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
          mobile: user.mobile,
          name: user.name,
          email: user.email || null,
          role: user.role,
        },
      });
    }

    // No valid input
    return res.status(400).json({
      message: "Please provide email & password or mobile & password",
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
};


// export const verifyOtp = async (req, res) => {
    
//   return new Promise(async (resolved,reject)=>{
        
//       const { mobile, otp } = req.body;

//       console.log("Verify OTP request:", { mobile, otp });

//       try {
//       let user;

//       if (mobile.includes("@")) {
//         user = await User.findOne({ email: mobile });
//       } else {
//         user = await User.findOne({ mobile: mobile });
//       }

//       console.log("user found:", user);

//       if (!user) return res.status(404).json({ message: "User not found" });

//       if (!user.otp || user.otp !== otp)
//         resolved(res.status(400).json({ message: "Invalid OTP" }));

//       if (!user.otpExpires || user.otpExpires < new Date())
//         resolved(res.status(400).json({ message: "OTP expired" }));

//       // Clear OTP
//       user.otp = null;
//       user.otpExpires = null;
//       await user.save();

//       const token = generateToken(user);

//       res.cookie("token", token, {
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000,
//       });

//       resolved(res.status(200).json({
//         message: "OTP verified successfully",
//         token,
//         user: {
//           userId: user._id,
//           email: user.email || null,
//           name: user.name || null,   
//           mobile: user.mobile,
//           role: user.role,
//         },
//       }));
//       } catch (err) {
//       console.error("Verify OTP error:", err);
//         resolved(res.status(500).json({ message: "Server error" }));
//       }
      
//     })
//   };

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


export const getUsersByRoles = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role });
        

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users by role error:", error);
    res.status(500).json({ success: false, message: "Server error", detail: error.message });
  }

};

//delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};
