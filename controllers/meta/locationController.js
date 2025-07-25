import Vehicle from "../../models/Vehicle.model.js";

// Add new vehicle
export const createVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      variant,
      fuelType,
      transmissionType,
      BHPs,
      Airbags,
      Mileage,
      NCAP,
    } = req.body;

    //uploaded image URL from Cloudinary via Multer
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image upload is required." });
    }

    //Prevent duplicates
    const existing = await Vehicle.findOne({ brand, model, variant });

    if (existing) {
      return res.status(400).json({ message: "Vehicle already exists." });
    }

    //Save to MongoDB
    const newVehicle = await Vehicle.create({
      brand,
      model,
      variant,
      fuelType,
      transmissionType,
      BHPs,
      Airbags,
      Mileage,
      NCAP,
      imageUrl,
    });

    // console.log("New vehicle created:", newVehicle);

    res.status(201).json({
      message: "Vehicle added successfully",
      data: newVehicle,
    });
  } catch (error) {
    console.error("createVehicle error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all vehicles from drivesta
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json({
      message: "Vehicles fetched successfully",
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({
      message: "Vehicle fetched successfully",
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
