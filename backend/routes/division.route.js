import express from "express";
import { getDivisionsByKidId } from "../controllers/division.controller.js";

const divisionRouter = express.Router();

// GET /api/divisions/:kidId
divisionRouter.get("/", getDivisionsByKidId);

export default divisionRouter;
