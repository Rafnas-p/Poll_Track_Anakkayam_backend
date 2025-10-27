import express from "express";
import { 
  createVoter, 
  getAllVoters, 
  getVoterById, 
  getVotersByBooth,
  updateVoter,
  deleteVoter,
  upload
} from "../controller/VoterController.js";

const router = express.Router();

router.post("/create-voter", upload.single('photo'), createVoter);
router.get("/get-all-voters", getAllVoters);
router.get("/get-voter-by-id/:id", getVoterById);
router.get("/get-voters-by-booth/:boothId", getVotersByBooth);
router.put("/update-voter/:id", upload.single('photo'), updateVoter);
router.delete("/delete-voter/:id", deleteVoter);

export default router;