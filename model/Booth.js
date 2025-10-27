import mongoose from "mongoose";
const boothSchema = new mongoose.Schema({
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
   ward:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ward",
    require:true
   },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  district: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});


const Booth=mongoose.model('Booth',boothSchema)
export default Booth;