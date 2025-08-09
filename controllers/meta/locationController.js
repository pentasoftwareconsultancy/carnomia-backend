import Location from "../../models/Location.model.js";

// Create a new location entry (array) or push into existing one
export const createLocation = async (req, res) => {
  try {
    let { name, locations } = req.body;

    console.log("Location", locations);

    let newLocations = [];
    if (name) {
      newLocations.push(name);
    } else if (Array.isArray(locations) && locations.length > 0) {
      newLocations = locations;
    } else {
      return res.status(400).json({ message: "Location name(s) are required" });
    }

    let locationDoc = await Location.findOne();

    if (!locationDoc) {
      const newLocationDoc = new Location({ locations: newLocations });
      await newLocationDoc.save();
      return res.status(201).json({
        message: "Location list created",
        locations: newLocationDoc,
      });
    }

    let addedLocations = [];
    for (let loc of newLocations) {
      if (!locationDoc.locations.includes(loc)) {
        locationDoc.locations.push(loc);
        addedLocations.push(loc);
      }
    }

    if (addedLocations.length > 0) {
      await locationDoc.save();
      return res.status(200).json({
        message: "Locations added successfully",
        added: addedLocations,
        locations: locationDoc,
      });
    } else {
      return res.status(400).json({ message: "All locations already exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all locations
// Modified getLocations
export const getLocations = async (req, res) => {
  try {
    const locationDoc = await Location.findOne();
    if (!locationDoc) {
      return res.status(200).json({ locations: [] });
    }
    res.status(200).json({ locations: locationDoc.locations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a location name inside the array
export const updateLocation = async (req, res) => {
  try {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res
        .status(400)
        .json({ message: "Both old and new names are required" });
    }

    let locationDoc = await Location.findOne();
    if (!locationDoc) {
      return res.status(404).json({ message: "No locations found" });
    }

    const index = locationDoc.locations.indexOf(oldName);
    if (index === -1) {
      return res.status(404).json({ message: "Old location name not found" });
    }

    // Replace old name with new one
    locationDoc.locations[index] = newName;
    await locationDoc.save();

    res
      .status(200)
      .json({ message: "Location updated", locations: locationDoc });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a location name from array
export const deleteLocation = async (req, res) => {
  try {
    const name = req.params.name; 

    if (!name) {
      return res.status(400).json({ message: "Location name is required" });
    }

    let locationDoc = await Location.findOne();
    if (!locationDoc) {
      return res.status(404).json({ message: "No locations found" });
    }

    const initialLength = locationDoc.locations.length;
    locationDoc.locations = locationDoc.locations.filter((loc) => loc !== name);

    if (locationDoc.locations.length === initialLength) {
      return res.status(404).json({ message: "Location not found" });
    }

    await locationDoc.save();

    res
      .status(200)
      .json({ message: "Location deleted", locations: locationDoc });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
