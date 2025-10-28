import express from "express";
import { createPanchayat, deletePanchayat, getAllPanchayats, getPanchayatById, updatePanchayat } from "../controller/panjayath.js";

const router = express.Router();

router.post("/create-panchayat", createPanchayat);       // Create new Panchayat
router.get("/get-all-panchayats", getAllPanchayats);       // Get all Panchayats
router.get("/get-panchayat/:id", getPanchayatById);    // Get Panchayat by ID
router.put("/update-panchayat/:id", updatePanchayat);     // Update Panchayat
router.delete("/delete-panchayat/:id", deletePanchayat);
export default router;
