import mongoose from "mongoose";

const voterSchema = new mongoose.Schema({
  // ക്രമ നമ്പർ (Serial Number)
  serialNumber: {
    type: Number,
    required: true
  },
  
  // ID (Voter ID)
  voterId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  
  // Name
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Age
  age: {
    type: Number,
    required: true
  },
  
  // Guardian (Father/Mother/Husband name)
  guardian: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    relation: {
      type: String,
      enum: ['father', 'mother', 'husband', 'other'],
      default: 'father'
    }
  },
  
  // Address details
  address: {
    // Veetu Number (House Number)
    houseNumber: { 
      type: String,
      required: true
    },
    
    // House Name
    houseName: { 
      type: String,
      required: true
    }
  },
  
  // Sex
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
    lowercase: true
  },
  
  // Photo with file size tracking
  photo: {
    url: {
      type: String
    },
    publicId: {
      type: String
    },
    uploadedAt: {
      type: Date
    },
    fileSize: {
      type: Number, // Size in bytes
      default: 0
    },
    originalName: {
      type: String
    }
  },
  
  // Administrative divisions
  ward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: true
  },
  panchayat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Panchayat',
    required: true
  },

  
  // NEW: Booth reference
  booth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booth',
    required: true
  },
  
  // Political information
  politicalAffiliation: {
    type: String,
    enum: ['supporter', 'neutral', 'opposition', 'unknown'],
    default: 'unknown'
  },
  party: {
    type: String
  },
  
  // Voting status
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedAt: {
    type: Date
  },
  
  // General status and notes
  status: {
    type: String,
    enum: ['active', 'inactive', 'deceased', 'transferred'],
    default: 'active'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
voterSchema.index({ panchayat: 1, ward: 1, booth: 1 });
voterSchema.index({ serialNumber: 1 });
voterSchema.index({ voterId: 1 });
voterSchema.index({ politicalAffiliation: 1 });
voterSchema.index({ hasVoted: 1 });
voterSchema.index({ 'address.houseNumber': 1 });

const Voter = mongoose.model('Voter', voterSchema);
export default Voter;