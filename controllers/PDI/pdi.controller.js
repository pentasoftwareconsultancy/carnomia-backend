import getCityPrefix from "../../utils/getCityPrefix.js";
import PDIRequest from "../../models/PDIRequest.model.js";
import User from "../../models/User.model.js";
import Vehicle from "../../models/Vehicle.model.js";
import VehicleModel from "../../models/Vehicle.model.js";

export const createPDIRequest = async (req, res) => {
  try {
    let {
      brand,
      model,
      variant,
      dealerName,
      address,
      carStatus,
      date,
      notes,
      customerName,
      customerMobile
    } = req.body;

    if(req.user.role === 'customer') {
      customerName = req.user.name;
      customerMobile = req.user.mobile;
    } else {
      customerName = req.body.customerName || req.user.name;
      customerMobile = req.body.customerMobile || req.user.mobile;
    }

    console.log("Body received:", req.body);

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
    const bookingId = await getCityPrefix();

    const newRequest = new PDIRequest({
      customerId: req.user.id,
      customerName: customerName,
      customerMobile: customerMobile,

      brand,
      model,
      variant,

      imageUrl: vehicle.imageUrl,
      transmissionType: vehicle.transmissionType,
      fuelType: vehicle.fuelType,

      dealerName,
      address,
      carStatus,
      status: "NEW",
      date,
      notes,
      bookingId,
      paymentStatus: "UNPAID",
      paymentMode: "N/A",
      amount: 2500
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

export const deleteInspectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInspection = await PDIRequest.findByIdAndDelete(id);
    if (!deletedInspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }
    res.status(200).json({
      message: "Inspection deleted successfully",
      data: deletedInspection
    });
  } catch (error) {
    console.error("Error deleting inspection:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params; // PDI Request ID
    const { paymentStatus, status } = req.body; // Accept both fields

    if (!paymentStatus || !status) {
      return res.status(400).json({ message: "Both paymentStatus and status are required" });
    }

    const updatedRequest = await PDIRequest.findByIdAndUpdate(
      id,
      { paymentStatus, status }, // Update both fields
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "PDI Request not found" });
    }

    return res.status(200).json({
      message: "Payment and request status updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating payment/request status:", error);
    return res.status(500).json({ message: "Server error" });
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

    let requests = [];
    if(req.user.role === 'customer') {
      console.log("Customer ID:", req.user.id);
      requests = await PDIRequest.find({
        status: { $in: statuses},
        customerId: req.user.id
      });
    } else {
      requests = await PDIRequest.find({
        status: { $in: statuses }
      });
  }

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


export const getPDIRequestCountsByStatuses = async (req, res) => {
  try {
    // Get all requests
    const requests = await PDIRequest.find({});
    // Get all engineers
    const engineers = await User.find({ role: "engineer" });

    const counts = {
      newRequests: requests.filter(r => r.status === "NEW").length,
      assignedJobs: requests.filter(r => r.status === "ASSIGNED_ENGINEER").length,
      completedJobs: requests.filter(r => r.status === "COMPLETED").length,
      allRequests: requests.length,
      activeEngineers: engineers?.length,
      upcomingSchedule: 0 // Placeholder for future logic
    };

    res.status(200).json({
      success: true,
      data: counts
    });
  } catch (error) {
    console.error("Get Dashboard Counts Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard counts"
    });
  }
};


export const getRecentRequestByCustomer = async (req, res) => {
  try {
    const customerMobile  = req.user.mobile; // pass customerId in URL

    if (!customerMobile) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    // Find the most recent request for this customer
    let recentRequest = await PDIRequest.findOne({ customerMobile })
      .sort({ createdAt: -1 }) // sort by createdAt descending
      .lean(); // optional, returns plain JS object

      const vehicleInfo = await VehicleModel.findOne({brand: recentRequest.brand, model: recentRequest.model }).lean();
      recentRequest = {
        ...recentRequest,
        ...vehicleInfo
      }

    if (!recentRequest) {
      return res.status(404).json({
        success: false,
        message: "No requests found for this customer",
      });
    }

    res.status(200).json({
      success: true,
      data: recentRequest,
    });
  } catch (error) {
    console.error("Get Recent Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching recent request",
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