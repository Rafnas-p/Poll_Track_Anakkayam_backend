import mongoose from "mongoose";

const panchayatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },

  totalWards: {
    type: Number,
    default: 0
  },

  address: {
    type: String
  }
}, {
  timestamps: true
});
const Panchayat=mongoose.model("Panchayat",panchayatSchema)
export default Panchayat