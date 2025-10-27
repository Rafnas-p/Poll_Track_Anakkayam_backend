import Booth from "../model/Booth.js";
import Panchayat from "../model/Panchayat.js";
import Ward from "../model/Ward.js";
import Voter from "../model/VoterSchema .js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/voters/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'voter-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: fileFilter
});

// ✅ Create new Voter with image upload
// Update the createVoter function around line 41
export const createVoter = async (req, res) => {
  try {
    const {
      voterId,
      name,
      age,
      gender,
      address,
      ward,
      panchayat,
      booth,
      politicalAffiliation,
      party,
      guardian,
      serialNumber
    } = req.body;
    
    console.log('Request body:', req.body);
    console.log('Ward:', ward, 'Panchayat:', panchayat, 'Booth:', booth);

    // If ward/panchayat not provided, get them from booth
    let wardId = ward;
    let panchayatId = panchayat;

    if (!wardId || !panchayatId) {
      // Get booth details to extract ward and panchayat
      const boothDetails = await Booth.findById(booth).populate('ward panchayat');
      if (!boothDetails) {
        return res.status(404).json({ message: "Booth not found" });
      }
      
      wardId = boothDetails.ward._id;
      panchayatId = boothDetails.panchayat._id;
    }

    // Validate Ward, Panchayat, Booth existence
    const existingWard = await Ward.findById(wardId);
    if (!existingWard) return res.status(404).json({ message: "Ward not found" });

    const existingPanchayat = await Panchayat.findById(panchayatId);
    if (!existingPanchayat) return res.status(404).json({ message: "Panchayat not found" });

    const existingBooth = await Booth.findById(booth);
    if (!existingBooth) return res.status(404).json({ message: "Booth not found" });

    // Check for unique voterId
    const existingVoter = await Voter.findOne({ voterId });
    if (existingVoter) return res.status(400).json({ message: "Voter ID already exists" });

    // Handle image upload
    let photoData = {};
    if (req.file) {
      photoData = {
        url: `/uploads/voters/${req.file.filename}`,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        uploadedAt: new Date()
      };
    }
    console.log(photoData,'photoData');
    
    // Create Voter
    const newVoter = await Voter.create({
      voterId,
      name,
      age,
      gender,
      address: JSON.parse(address),
      guardian: JSON.parse(guardian),
      ward: wardId,
      panchayat: panchayatId,
      booth,
      politicalAffiliation,
      party,
      serialNumber,
      photo: photoData
    });
    console.log(newVoter,'newVoter');

    res.status(201).json({
      success: true,
      message: "Voter created successfully",
      voter: newVoter
    });

  } catch (error) {
    console.error("Error creating voter:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ Get voters by booth
export const getVotersByBooth = async (req, res) => {
  try {
    const { boothId } = req.params;
    
    const voters = await Voter.find({ booth: boothId })
      .populate("ward", "wardNumber name")
      .populate("panchayat", "name")
      .populate("booth", "name code district")
      .sort({ serialNumber: 1 });

    res.status(200).json({
      success: true,
      count: voters.length,
      voters
    });

  } catch (error) {
    console.error("Error fetching voters by booth:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ Fetch all Voters
export const getAllVoters = async (req, res) => {
  try {
    const voters = await Voter.find()
      .populate("ward", "wardNumber name")
      .populate("panchayat", "name")
      .populate("booth", "name code district")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: voters.length,
      voters
    });

  } catch (error) {
    console.error("Error fetching voters:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ Fetch Voter by ID
export const getVoterById = async (req, res) => {
  try {
    const { id } = req.params;
    const voter = await Voter.findById(id)
      .populate("ward", "wardNumber name")
      .populate("panchayat", "name")
      .populate("booth", "name code district");

    if (!voter) return res.status(404).json({ success: false, message: "Voter not found" });

    res.status(200).json({
      success: true,
      voter
    });

  } catch (error) {
    console.error("Error fetching voter by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ Update Voter
export const updateVoter = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle image upload if new image provided
    if (req.file) {
      updateData.photo = {
        url: `/uploads/voters/${req.file.filename}`,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        uploadedAt: new Date()
      };
    }

    const voter = await Voter.findByIdAndUpdate(id, updateData, { new: true })
      .populate("ward", "wardNumber name")
      .populate("panchayat", "name")
      .populate("booth", "name code district");

    if (!voter) return res.status(404).json({ success: false, message: "Voter not found" });

    res.status(200).json({
      success: true,
      message: "Voter updated successfully",
      voter
    });

  } catch (error) {
    console.error("Error updating voter:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ Delete Voter
export const deleteVoter = async (req, res) => {
  try {
    const { id } = req.params;
    
    const voter = await Voter.findByIdAndDelete(id);
    if (!voter) return res.status(404).json({ success: false, message: "Voter not found" });

    // Delete associated image file if exists
    if (voter.photo?.url) {
      const imagePath = `uploads/voters/${voter.photo.url.split('/').pop()}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Voter deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting voter:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};