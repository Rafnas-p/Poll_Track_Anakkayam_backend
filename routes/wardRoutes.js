import express from "express";
import { createWard, getBoothsByWard, getWardById, getWardsByPanchayat, updateWard, deleteWard } from "../controller/WardController.js";

const router = express.Router();

router.post("/create-ward", createWard);         // Create Ward
router.get("/get-wards-by-panchayat/:id", getWardsByPanchayat);  // Get Wards by Panchayat ID
router.get("/get-ward-by-id/:id", getWardById);      // Get Ward by ID
router.get("/get-booths-by-ward/:id", getBoothsByWard);  // Get Booths by Ward ID
router.put("/update-ward/:id", updateWard);      // Update Ward by ID
router.delete("/delete-Booth/:id", deleteWard);   // Delete Ward by ID

export default router;
