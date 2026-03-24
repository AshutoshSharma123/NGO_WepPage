import { Router } from "express";
import {
  createImpact,
  createInvolvement,
  createProgram,
  editImpact,
  editInvolvement,
  editProgram,
  getNgoOverview,
  removeImpact,
  removeInvolvement,
  removeProgram
} from "../controllers/ngoController.js";

const router = Router();

router.get("/", getNgoOverview);
router.post("/impact", createImpact);
router.put("/impact/:id", editImpact);
router.delete("/impact/:id", removeImpact);
router.post("/programs", createProgram);
router.put("/programs/:id", editProgram);
router.delete("/programs/:id", removeProgram);
router.post("/involvement", createInvolvement);
router.put("/involvement/:id", editInvolvement);
router.delete("/involvement/:id", removeInvolvement);

export default router;
