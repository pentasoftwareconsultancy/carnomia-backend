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

// export const updatePDIInspection = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = { ...req.body };

//     if (req.files?.imagesUrl) {
//       updateData.imagesUrl = req.files.imagesUrl.map((file) => file.path);
//     }

//     const updatedPDIRequest = await PDIRequest.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );

//     if (!updatedPDIRequest) {
//       return res.status(404).json({ message: "PDI Request not found" });
//     }

//     res.status(200).json({
//       message: "PDI Request updated successfully",
//       data: updatedPDIRequest,
//     });
//   } catch (error) {
//     console.error("Update PDI Inspection Error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

export const addInspectionCategoriesWithImages = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Parse inspection array from FormData
    let newCategories;
    try {
      newCategories = JSON.parse(req.body.inspection);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid inspection JSON format.",
      });
    }

    if (!Array.isArray(newCategories) || newCategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Inspection must be a non-empty array of categories.",
      });
    }

    // Step 2: Get existing inspection data
    const existingDoc = await PDIRequest.findById(id);
    if (!existingDoc) {
      return res.status(404).json({
        success: false,
        message: "PDI Request not found",
      });
    }

    const existingInspection = existingDoc.inspection || [];

    // Step 3: Handle image files
    const imageFiles = req.files || [];
    let imageIndex = 0;

    for (let category of newCategories) {
      const newCatName = (category?.categoryName || "").trim().toLowerCase();

      const existingCategory = existingInspection.find(
        (cat) => (cat?.categoryName || "").trim().toLowerCase() === newCatName
      );

      if (existingCategory) {
        // Category exists
        for (let newPart of category.parts || []) {
          const newPartName = (newPart?.partName || "").trim().toLowerCase();

          const existingPart = (existingCategory.parts || []).find(
            (p) => (p?.partName || "").trim().toLowerCase() === newPartName
          );

          const partRef = existingPart || newPart;
          partRef.imagesUrl = [];

          for (let i = 0; i < 5 && imageIndex < imageFiles.length; i++) {
            const image = imageFiles[imageIndex];
            const relativePath = path
              .relative(process.cwd(), image.path)
              .replace(/\\/g, "/");
            const fileUrl = `${req.protocol}://${req.get(
              "host"
            )}/${relativePath}`;
            partRef.imagesUrl.push(fileUrl);
            imageIndex++;
          }

          if (existingPart) {
            // Merge fields only if existing part
            if (!Array.isArray(existingPart.fields)) existingPart.fields = [];
            existingPart.fields.push(...(newPart.fields || []));
          } else {
            existingCategory.parts.push(newPart);
          }
        }
      } else {
        // New category
        for (let part of category.parts || []) {
          part.imagesUrl = [];

          for (let i = 0; i < 5 && imageIndex < imageFiles.length; i++) {
            const image = imageFiles[imageIndex];
            const relativePath = path
              .relative(process.cwd(), image.path)
              .replace(/\\/g, "/");
            const fileUrl = `${req.protocol}://${req.get(
              "host"
            )}/${relativePath}`;
            part.imagesUrl.push(fileUrl);
            imageIndex++;
          }
        }

        existingInspection.push(category);
      }
    }

    // Step 4: Update DB using only $set to avoid conflict
    const updated = await PDIRequest.findByIdAndUpdate(
      id,
      { $set: { inspection: existingInspection } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Inspection categories updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error adding inspection categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding inspection categories",
      error,
    });
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
