import InquirySchema from "../../models/Inquiry.model.js";

export const submitInquiry = async (req, res) => {
  try {
    const { name, email, phoneNumber, message } = req.body;

    // Basic validation
    if (!name || !email || !phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Save inquiry to DB
    const newInquiry = new InquirySchema({
      name,
      email,
      phoneNumber,
      message,
    });

    await newInquiry.save();

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: newInquiry,
    });
  } catch (error) {
    console.error("Error submitting inquiry:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};