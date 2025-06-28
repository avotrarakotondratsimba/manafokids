import express from "express";

import { chatResponse } from "../controllers/chatBot.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const chatBotRouter = express.Router();

chatBotRouter.post("/chat", authorize, chatResponse);

export default chatBotRouter;
