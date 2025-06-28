import express from "express";
import {
  getThemes,
  getThemeById,
  createTheme,
  deleteTheme,
  updateTheme,
} from "../controllers/theme.controller.js";

const themeRouter = express.Router();

themeRouter.get("/", getThemes);

themeRouter.get("/:themeId", getThemeById);

themeRouter.delete("/:themeId", deleteTheme);

themeRouter.put("/:themeId", updateTheme);

themeRouter.post("/", createTheme);

export default themeRouter;
