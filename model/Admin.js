import mongoose from "mongoose";

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  refreshToken: { type: String }, // Store refresh token
  role: {
    type: String,
    enum: ['super_admin', 'district_admin', 'block_admin', 'panchayat_admin','admin'],
    default: 'panchayat_admin'
  },
  assignedArea: {
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Block'
    },
    panchayat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Panchayat'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});
const Admin = mongoose.model("Admin", adminSchema);

export default Admin;