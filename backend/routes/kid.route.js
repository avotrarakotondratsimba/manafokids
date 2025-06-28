import express from "express";

import {
  getKids,
  insertKid,
  updateKid,
  deleteKid,
  updateKidXp,
} from "../controllers/kid.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const kidRouter = express.Router();

// GET /api/kids/
kidRouter.get("/", authorize, getKids);

// POST /api/kids/
kidRouter.post("/", authorize, insertKid);

// PUT /api/kids/xp/:kidId
kidRouter.put("/xp/:kidId", authorize, updateKidXp);

// PUT /api/kids/:kidId
kidRouter.put("/:kidId", authorize, updateKid);

// DELETE /api/kids/:kidId
kidRouter.delete("/:kidId", authorize, deleteKid);

export default kidRouter;
