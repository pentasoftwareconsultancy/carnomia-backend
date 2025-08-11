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
      name: user.name,
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

export const updateInspectionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Destructure fields from body (imageUrls will come as strings or arrays directly)
    const updateData = req.body;

    console.log("data",updateData);
    
    
    const updatedInspection = await PDIRequest.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedInspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    res.json({
      message: "Inspection updated successfully",
      data: updatedInspection
    });
  } catch (error) {
    console.error("Error updating inspection:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getPDIRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    const request = await PDIRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "PDI Request not found" });
    }

    res.status(200).json({
      message: "PDI Request fetched successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error fetching PDI Request by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllPDIRequests = async (req, res) => {
  try {
    const requests = await PDIRequest.find();

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

 export const getPDIRequestsByEngineer = async (req, res) => {
  try {
    const { engineerId } = req.params; // Coming from route like /pdi/engineer/:engineerId

    if (!engineerId) {
      return res.status(400).json({
        success: false,
        message: "Engineer ID is required",
      });
    }

    const requests = await PDIRequest.find({ engineer_id:engineerId });

    res.status(200).json({
      success: true,
      total: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Get PDI Requests by Engineer Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching PDI requests",
    });
  }
};

export const getPDIRequestsByStatuses = async (req, res) => {
  try {
    const  statuses  = req.body; // Pass as array

    if (!Array.isArray(statuses) || statuses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Statuses array is required",
      });
    }

    const requests = await PDIRequest.find({
      status: { $in: statuses }
    });

    res.status(200).json({
      success: true,
      total: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Get PDI Requests by Statuses Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching PDI requests",
    });
  }
};

export const assignEngineer = async (req, res) => {
  try {
    // const { bookingId } = req.params;
    // const requestId = bookingId.trim();
    const { engineerId, location, timeSlot, requestId } = req.body;

    if (!engineerId || !location || !timeSlot) {
      return res.status(400).json({ message: "Engineer ID, location and time slot are required" });
    }

    // Find engineer by _id and role engineer
    const engineer = await User.findOne({ _id: engineerId, role: "engineer" });
    if (!engineer) {
      return res.status(404).json({ message: "Engineer not found" });
    }

    console.log('asss eng', engineer)

    // Update the PDIRequest by bookingId
    const updatedRequest = await PDIRequest.findOneAndUpdate(
      { _id: requestId },
       {
          engineer_id: engineer._id,
          engineer_name: engineer.name,
          engineer_mobile: engineer.mobile,
          engineer_location: location,
          engineer_assignedSlot: timeSlot,
        status: "ASSIGNED_ENGINEER", // or your exact status constant
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "PDI Request not found with this bookingId" });
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


export const getSelectedPDIWithVehicleData = async (req, res) => {
  try {
    const { brand, variant } = req.query;

    // Build match condition dynamically
    const matchStage = {};
    if (brand) matchStage.brand = brand;
    if (variant) matchStage.variant = variant;

    const data = await PDIRequest.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "vehicles",
          let: {
            brand: "$brand",
            model: "$model",
            variant: "$variant",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$brand", "$$brand"] },
                    { $eq: ["$model", "$$model"] },
                    { $eq: ["$variant", "$$variant"] },
                  ],
                },
              },
            },
            {
              $project: {
                BHPs: 1,
                Airbags: 1,
                Mileage: 1,
                NCAP: 1,
                _id: 0,
              },
            },
          ],
          as: "vehicleDetails",
        },
      },
      {
        $unwind: {
          path: "$vehicleDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          brand: 1,
          model: 1,
          variant: 1,
          imageUrl: 1,
          transmissionType: 1,
          fuelType: 1,
          dealerName: 1,
          bookingId: 1,
          BHPs: "$vehicleDetails.BHPs",
          Airbags: "$vehicleDetails.Airbags",
          Mileage: "$vehicleDetails.Mileage",
          NCAP: "$vehicleDetails.NCAP",
        },
      },
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in joined query:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};