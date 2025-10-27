import express from "express";
import { createPanchayat, getAllPanchayats, getPanchayatById } from "../controller/panjayath.js";

const router = express.Router();

router.post("/create-panchayat", createPanchayat);       // Create new Panchayat
router.get("/get-all-panchayats", getAllPanchayats);       // Get all Panchayats
router.get("/get-panchayat/:id", getPanchayatById);    // Get Panchayat by ID

export default router;
