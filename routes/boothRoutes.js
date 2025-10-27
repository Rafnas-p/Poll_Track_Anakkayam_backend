import express from "express";
import { createBlock, getAllBlocks, getBlockById } from "../controller/boothcontroller.js";

const router = express.Router();

router.post("/create-Booth", createBlock);        // Create Booth
router.get("/get-all-blocks", getAllBlocks);        // Get all Blocks
router.get("/get-Booth-by-id/:id", getBlockById);     // Get Booth by ID

export default router;
