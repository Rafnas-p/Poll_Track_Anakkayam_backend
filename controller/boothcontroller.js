import Booth from "../model/Booth.js";
import Panchayat from "../model/Panchayat.js";
import Ward from "../model/Ward.js";

// ✅ Create new Booth
export const createBlock = async (req, res) => {

  
  try {
    const { name, panchayat, ward, code, district, description } = req.body;

    // Validate Panchayat
    const existingPanchayat = await Panchayat.findById(panchayat);
    if (!existingPanchayat) {
      return res.status(404).json({ message: "Panchayat not found" });
    }

    // Validate Ward
    const existingWard = await Ward.findById(ward);
    if (!existingWard) {
      return res.status(404).json({ message: "Ward not found" });
    }

    // Check for unique code
    const existingBlock = await Booth.findOne({ code });
    if (existingBlock) {
      return res.status(400).json({ message: "Booth code must be unique" });
    }

    // Create Booth
    const newBlock = await Booth.create({
      name,
      panchayat,
      ward,
      code,
      district,
      description
    });

    res.status(201).json({
      success: true,
      message: "Booth created successfully",
      Booth: newBlock
    });

  } catch (error) {
    console.error("Error creating Booth:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ Fetch all Blocks (with Panchayat and Ward details)
export const getAllBlocks = async (req, res) => {
  try {
    const blocks = await Booth.find()
      .populate("panchayat", "name")
      .populate("ward", "wardNumber name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blocks.length,
      blocks
    });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ Fetch Booth by ID
export const getBlockById = async (req, res) => {
  try {
    const { id } = req.params;

    
    const booth = await Booth.findById(id)
      .populate("panchayat", "name")
      .populate("ward", "wardNumber name");

    if (!booth) {
      return res.status(404).json({ success: false, message: "Booth not found" });
    }

    res.status(200).json({
      success: true,
      booth
    });
  } catch (error) {
    console.error("Error fetching Booth by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};


// ✅ Update Booth
export const updateBooth = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, panchayat, ward, code, district, description } = req.body;

    // Check if booth exists
    const existingBooth = await Booth.findById(id);
    if (!existingBooth) {
      return res.status(404).json({ 
        success: false, 
        message: "Booth not found" 
      });
    }

    // If panchayat is being updated, validate it exists
    if (panchayat && panchayat !== existingBooth.panchayat.toString()) {
      const panchayatExists = await Panchayat.findById(panchayat);
      if (!panchayatExists) {
        return res.status(404).json({ 
          success: false, 
          message: "Panchayat not found" 
        });
      }
    }

    // If ward is being updated, validate it exists
    if (ward && ward !== existingBooth.ward.toString()) {
      const wardExists = await Ward.findById(ward);
      if (!wardExists) {
        return res.status(404).json({ 
          success: false, 
          message: "Ward not found" 
        });
      }
    }

    // If code is being updated, check for uniqueness
    if (code && code !== existingBooth.code) {
      const codeExists = await Booth.findOne({ code });
      if (codeExists) {
        return res.status(400).json({ 
          success: false, 
          message: "Booth code must be unique" 
        });
      }
    }

    // Update booth
    const updatedBooth = await Booth.findByIdAndUpdate(
      id,
      { name, panchayat, ward, code, district, description },
      { new: true, runValidators: true }
    )
      .populate("panchayat", "name")
      .populate("ward", "wardNumber name");

    res.status(200).json({
      success: true,
      message: "Booth updated successfully",
      booth: updatedBooth
    });

  } catch (error) {
    console.error("Error updating Booth:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ Delete Booth
export const deleteBooth = async (req, res) => {
  
  try {
    const { id } = req.params;

    // Check if booth exists
    const booth = await Booth.findById(id);
    if (!booth) {
      return res.status(404).json({ 
        success: false, 
        message: "Booth not found" 
      });
    }

    // Delete booth
    await Booth.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Booth deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting Booth:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};