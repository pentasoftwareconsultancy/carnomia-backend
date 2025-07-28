import Lookup from "../../models/Lookup.js";

//all lookups  filtered by type
export const getLookups = async (req, res) => {
      try {
      const type  = req.query.type ? req.query.type.toLowerCase() : null;

      const types = type
        ? type.split(',').map((t) => t.trim().toLowerCase())
        : [];

     
      const query = {};
      if (types.length > 0) {
        query.type = { $in: types };
      }
     
      const lookups = await Lookup.find(query).sort({
        order: 1,
        label: 1,
        value: 1,
      });
      
      const results = lookups.reduce((acc, item) => {
        const key = item.type;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});

      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// };

// GET lookup by ID
export const getLookupById = async (req, res) => {
  try {
    const lookup = await Lookup.findById(req.params.id);
    if (!lookup) return res.status(404).json({ error: "Lookup not found" });
    res.status(200).json(lookup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Add a new lookup
export const addLookup = async (req, res) => {
  const data = Array.isArray(req.body) ? req.body : [req.body];

  try {
    const bulk = data.map(({ type, value, label, order, isActive }) => {
      if (!type || !value) {
        throw new Error('"type" and "value" are required for each item.');
      }

      return {
        type: type.toLowerCase(),
        value,
        label: label || value,
        order: order ?? 0,
        isActive: isActive ?? true,
      };
    });

    const result = await Lookup.insertMany(bulk, { ordered: false });
    res.status(201).json({ message: "Lookup values added!", data: result });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Duplicate value detected" });
    }
    res.status(500).json({ error: err.message });
  }
};

//Update a lookup by ID
export const updateLookup = async (req, res) => {
  try {
    const lookup = await Lookup.findById(req.params.id);
    if (!lookup) return res.status(404).json({ error: "Lookup not found" });

    const { type, value, label, order, isActive } = req.body;

    if (type && type.toLowerCase() !== lookup.type) {
      return res.status(400).json({ error: 'Cannot change "type" once set' });
    }

    lookup.value = value ?? lookup.value;
    lookup.label = label ?? lookup.label;
    lookup.order = order ?? lookup.order;
    lookup.isActive = isActive ?? lookup.isActive;

    await lookup.save();
    res.status(200).json({ message: "Lookup updated successfully!" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Duplicate value" });
    }
    res.status(500).json({ error: err.message });
  }
};

//Delete lookup by ID
export const deleteLookup = async (req, res) => {
  try {
    const deleted = await Lookup.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Lookup not found" });

    res.status(200).json({ message: "Lookup deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
