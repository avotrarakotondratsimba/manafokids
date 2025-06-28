import express from "express";
import {
  getLessonsByModule,
  getLessonById,
  createLesson,
  deleteLesson,
  updateLesson,
  getAllLessons,
} from "../controllers/lesson.controller.js";

const lessonRouter = express.Router();

// GET /api/lessons/
lessonRouter.get("/", getAllLessons);

// GET /api/lessons/module/:moduleId
lessonRouter.get("/module/:moduleId", getLessonsByModule);

// GET /api/lessons/:lessonId
lessonRouter.get("/:lessonId", getLessonById);

// POST /api/lessons
lessonRouter.post("/", createLesson);

// DELETE /api/lessons/:lessonId
lessonRouter.delete("/:lessonId", deleteLesson);

// PUT /api/lessons/:lessonId
lessonRouter.put("/:lessonId", updateLesson);

export default lessonRouter;
