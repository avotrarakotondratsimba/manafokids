import express from "express";
import {
  getAllModule,
  getModuleById,
  createModule,
  deleteModule,
  updateModule,
  getModulesByTheme,
} from "../controllers/module.controller.js";
const moduleRouter = express.Router();
// GET /api/modules/all
moduleRouter.get("/", getAllModule);

// GET /api/modules/:moduleId
moduleRouter.get("/:moduleId", getModuleById);

// POST /api/modules
moduleRouter.post("/", createModule);

// DELETE /api/modules/:moduleId
moduleRouter.delete("/:moduleId", deleteModule);

// PUT /api/modules/:moduleId
moduleRouter.put("/:moduleId", updateModule);

// GET /api/modules/theme/:themeId
moduleRouter.get("/theme/:themeId", getModulesByTheme);
export default moduleRouter;
