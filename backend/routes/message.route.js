import express from "express";

import {
  getGroupMessages,
  insertGroupMessage,
  updateGroupMessage,
  deleteGroupMessage,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

// GET /api/messages/group/:groupId
messageRouter.get("/group/:groupId", getGroupMessages);

// POST /api/messages/group
messageRouter.post("/group/:groupId", insertGroupMessage);

// PUT /api/messages/group/:messageId
messageRouter.put("/group/:messageId", updateGroupMessage);

// DELETE /api/messages/group/:messageId
messageRouter.delete("/group/:messageId", deleteGroupMessage);

export default messageRouter;
