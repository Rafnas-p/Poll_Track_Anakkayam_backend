import express from "express";
import { createBlock, deleteBooth, getAllBlocks, getBlockById, updateBooth } from "../controller/boothcontroller.js";

const router = express.Router();

router.post("/create-Booth", createBlock);        // Create Booth
router.get("/get-all-blocks", getAllBlocks);        // Get all Blocks
router.get("/get-Booth-by-id/:id", getBlockById);     // Get Booth by ID
router.put("/update-booth/:id", updateBooth);
router.delete("/delete-Booth/:id", deleteBooth)
export default router;
