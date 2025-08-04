import getCityPrefix from "../../utils/getCityPrefix.js";
import PDIRequest from "../../models/PDIRequest.model.js";
import User from "../../models/User.model.js";
import Vehicle from "../../models/Vehicle.model.js";

export const createPDIRequest = async (req, res) => {
  try {
    const {
      brand,
      model,
      variant,
      dealerName,
      address,
      carStatus,
      date,
      notes,
    } = req.body;

    
    const user = await User.findById(req.user.id);

     console.log("user from id ", user);
    if (!user) return res.status(404).json({ error: "Customer not found" });

    const vehicle = await Vehicle.findOne({ brand, model, variant });
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found for this customer" });
    }

    // Generate booking ID
    const bookingId = getCityPrefix();

    const newRequest = new PDIRequest({
    
      customerName: user.name,
      customerMobile: user.mobile,

      brand,
      model,
      variant,

      imageUrl: vehicle.imageUrl,
      transmissionType: vehicle.transmissionType,
      fuelType: vehicle.fuelType,

      dealerName,
      address,
      carStatus,
      date,
      notes,
      bookingId,
    });

    await newRequest.save();

    res.status(201).json({
      message: "PDI Request created successfully",
      request: newRequest,
      vehicleImage: vehicle.imageUrl, 
    });
  } catch (error) {
    console.error("Create request error:", error.message, error.stack);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const updatePDIInspection = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = { ...req.body };

    
    if (req.files?.imagesUrl) {
      updateData.imagesUrl = req.files.imagesUrl.map((file) => file.path);
    }

    const updatedPDIRequest = await PDIRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPDIRequest) {
      return res.status(404).json({ message: "PDI Request not found" });
    }

    res.status(200).json({
      message: "PDI Request updated successfully",
      data: updatedPDIRequest,
    });
  } catch (error) {
    console.error("Update PDI Inspection Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllPDIRequests = async (req, res) => {
  try {
    const requests = await PDIRequest.find();

    console.log("All PDI Requests:", requests);

    res.status(200).json({
      success: true,
      total: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Get All PDI Requests Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching PDI requests",
    });
  }
};

export const assignEngineer = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const trimmedBookingId = bookingId.trim();
    console.log("Assigning engineer to booking ID:", trimmedBookingId);

    const { name, mobile } = req.body;

    // Find engineer
    const engineer = await User.findOne({ name, mobile, role: "engineer" });

    if (!engineer) {
      return res.status(404).json({ message: "Engineer not found" });
    }

    // Update using bookingId instead of _id
    const updatedRequest = await PDIRequest.findOneAndUpdate(
      { bookingId: trimmedBookingId },
      {
        engineer: {
          name: engineer.name,
          number: engineer.mobile,
        },
        status: "Assigned",
      },
      { new: true }
    );

    console.log("updated request" + updatedRequest);

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ message: "PDI Request not found with this bookingId" });
    }

    res.status(200).json({
      message: "Engineer assigned successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Assign Engineer Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
