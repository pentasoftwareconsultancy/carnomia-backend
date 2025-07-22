import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import twilio from "twilio";

dotenv.config();

// Connect to MongoDB
connectDB();

// Start server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
