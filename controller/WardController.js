import Booth from "../model/Booth.js";
import Panchayat from "../model/Panchayat.js";
import Ward from "../model/Ward.js";


// ✅ Create new Ward
export const createWard = async (req, res) => {
  try {
    const { wardNumber, name, panchayat, pollingBooth } = req.body;

    // Validate Panchayat existence
    const existingPanchayat = await Panchayat.findById(panchayat);
    if (!existingPanchayat) {
      return res.status(404).json({ message: "Panchayat not found" });
    }

    // Check for existing ward number in same Panchayat
    const existingWard = await Ward.findOne({ wardNumber, panchayat });
    if (existingWard) {
      return res.status(400).json({ message: "Ward number already exists in this Panchayat" });
    }

    // Create Ward
    const newWard = await Ward.create({
      wardNumber,
      name,
      panchayat,
      pollingBooth
    });

    res.status(201).json({
      success: true,
      message: "Ward created successfully",
      ward: newWard
    });
  } catch (error) {
    console.error("Error creating ward:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ Fetch all Wards (with Panchayat details)
// ✅ Fetch Wards by Panchayat ID
export const getWardsByPanchayat = async (req, res) => {
  try {
    const { id } = req.params; // Get panchayat ID from URL params
    console.log(id,'id');
    
    // Validate panchayat exists
    const panchayat = await Panchayat.findById(id);
    if (!panchayat) {
      return res.status(404).json({
        success: false,
        message: "Panchayat not found"
      });
    }
console.log(panchayat,'panchayat');

    // Find wards for the specific panchayat
    const wards = await Ward.find({ panchayat: panchayat._id })
      .populate("panchayat", "name location")
      .sort({ wardNumber: 1 }); // Sort by ward number
console.log(wards,'wards');

    res.status(200).json({
      success: true,
      count: wards.length,
      panchayat: {
        id: panchayat._id,
        name: panchayat.name,
        location: panchayat.location
      },
      wards
    });
  } catch (error) {
    console.error("Error fetching wards by panchayat:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ Fetch single Ward by ID
export const getWardById = async (req, res) => {
  try {
    const { id } = req.params;
    const ward = await Ward.findById(id).populate("panchayat", "name location");

    if (!ward) {
      return res.status(404).json({ success: false, message: "Ward not found" });
    }

    res.status(200).json({
      success: true,
      ward
    });
  } catch (error) {
    console.error("Error fetching ward by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};
// Add this function to WardController.js
export const getBoothsByWard = async (req, res) => {
  try {
    const { id } = req.params; // Get ward ID from URL params
    
    // Validate ward exists
    const ward = await Ward.findById(id);
    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found"
      });
    }

    // Find booths for the specific ward
    const booths = await Booth.find({ ward: ward._id })
      .populate("panchayat", "name")
      .populate("ward", "wardNumber name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: booths.length,
      ward: {
        id: ward._id,
        wardNumber: ward.wardNumber,
        name: ward.name,
        panchayat: ward.panchayat
      },
      booths
    });
  } catch (error) {
    console.error("Error fetching booths by ward:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};