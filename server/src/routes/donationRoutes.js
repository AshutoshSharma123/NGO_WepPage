import { Router } from "express";
import {
  createDonationOrder,
  getDonations,
  verifyDonationPayment
} from "../controllers/donationController.js";

const router = Router();

router.get("/", getDonations);
router.post("/create-order", createDonationOrder);
router.post("/verify", verifyDonationPayment);

export default router;
