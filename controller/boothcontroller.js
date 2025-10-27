import Booth from "../model/Booth.js";
import Panchayat from "../model/Panchayat.js";
import Ward from "../model/Ward.js";

// ✅ Create new Booth
export const createBlock = async (req, res) => {

  console.log('huuuuuuuuuu');
  
  try {
    const { name, panchayat, ward, code, district, description } = req.body;
console.log(req.body,'req.body');

    // Validate Panchayat
    const existingPanchayat = await Panchayat.findById(panchayat);
    if (!existingPanchayat) {
      return res.status(404).json({ message: "Panchayat not found" });
    }
console.log(existingPanchayat,'existingPanchayat');

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
console.log(Booth,'Booth');

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
console.log(id,'id');

    
    const booth = await Booth.findById(id)
      .populate("panchayat", "name")
      .populate("ward", "wardNumber name");
console.log(booth,'booth');

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
