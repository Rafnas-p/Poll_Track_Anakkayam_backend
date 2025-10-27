import mongoose from "mongoose";
const wardSchema = new mongoose.Schema({
  wardNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  panchayat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Panchayat',
    required: true
   },
  blocks: [{
    type: mongoose.Schema.Types.ObjectId,
   ref: 'Block',
    required: true
  }],
 
  pollingBooth: {
    name: String,
    location: {
      latitude: Number,
      longitude: Number
    }
  }
}, {
  timestamps: true
});

// Add compound index for unique ward number per panchayat
wardSchema.index({ wardNumber: 1, panchayat: 1 }, { unique: true });

// Add compound index for unique ward number per panchayat
wardSchema.index({ wardNumber: 1, panchayat: 1 }, { unique: true })

const Ward =mongoose.model("Ward",wardSchema)
export default  Ward;