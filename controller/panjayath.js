import Panchayat from "../model/Panchayat.js";

// ✅ Create a new Panchayat
export const createPanchayat = async (req, res) => {
  try {
    const { name, code, totalWards, address } = req.body;

    // Check if Panchayat code already exists
    const existingPanchayat = await Panchayat.findOne({ code });
    if (existingPanchayat) {
      return res.status(400).json({ message: "Panchayat with this code already exists" });
    }

    const newPanchayat = new Panchayat({
      name,
      code,
      totalWards,
      address,
    });

    await newPanchayat.save();

    res.status(201).json({
      message: "Panchayat created successfully",
      data: newPanchayat,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating Panchayat",
      error: error.message,
    });
  }
};

// ✅ Get all Panchayats
export const getAllPanchayats = async (req, res) => {
  try {
    const panchayats = await Panchayat.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All Panchayats fetched successfully",
      data: panchayats,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Panchayats",
      error: error.message,
    });
  }
};

// ✅ Get Panchayat by ID
export const getPanchayatById = async (req, res) => {
  try {
    const { id } = req.params;
    const panchayat = await Panchayat.findById(id);

    if (!panchayat) {
      return res.status(404).json({ message: "Panchayat not found" });
    }

    res.status(200).json({
      message: "Panchayat fetched successfully",
      data: panchayat,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Panchayat",
      error: error.message,
    });
  }
};


export const updatePanchayat = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, totalWards, address } = req.body;

    // Ensure unique code excluding current document
    if (code) {
      const exists = await Panchayat.findOne({ code, _id: { $ne: id } });
      if (exists) {
        return res.status(400).json({ message: "Panchayat with this code already exists" });
      }
    }

    const updated = await Panchayat.findByIdAndUpdate(
      id,
      { name, code, totalWards, address },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Panchayat not found" });
    }

    res.status(200).json({
      message: "Panchayat updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Panchayat",
      error: error.message,
    });
  }
};

export const deletePanchayat = async (req, res) => {
  
  try {
    const { id } = req.params;
    const deleted = await Panchayat.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Panchayat not found" });
    }
    res.status(200).json({ message: "Panchayat deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Panchayat",
      error: error.message,
    });
  }
};