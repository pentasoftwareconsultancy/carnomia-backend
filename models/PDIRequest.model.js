import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: { type: String }, 
    customerMobile: { type: String },

    brand: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String, required: true },

    imageUrl: { type: String }, // from Vehicle
    transmissionType: { type: String }, // from Vehicle
    fuelType: { type: String }, // from Vehicle

    dealerName: { type: String },
    address: { type: String },
    carStatus: { type: String },
    date: { type: Date, default: Date.now },
    notes: { type: String },

    bookingId: { type: String, unique: true },

    status: {
      type: String,
      enum: [
        "Pending",
        "Reject",
        "Waiting for Approval",
        "Assigned",
        "Ongoing",
        "Completed",
      ],
      default: "Pending",
    },

    engineer: {
      name: { type: String },
      number: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("PDIRequest", requestSchema);
