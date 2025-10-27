import express from "express";
import { createWard, getBoothsByWard, getWardById, getWardsByPanchayat } from "../controller/WardController.js";

const router = express.Router();

router.post("/create-ward", createWard);         // Create Ward
router.get("/get-wards-by-panchayat/:id", getWardsByPanchayat);  // Get Wards by Panchayat ID
router.get("/get-ward-by-id/:id", getWardById);      // Get Ward by ID
router.get("/get-booths-by-ward/:id", getBoothsByWard);  // Add this new route

export default router;
