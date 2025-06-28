import { PrismaClient } from "../generated/prisma/index.js";
import { errorObject } from "../middlewares/error.middleware.js";

const prisma = new PrismaClient();

// GET /api/lessons?birthDate=YYYY-MM-DD
export const getAllLessons = async (req, res, next) => {
  try {
    const { birthDate } = req.query;

    if (birthDate && isNaN(Date.parse(birthDate))) {
      return errorObject('Le champ "birthDate" est invalide.', 400);
    }

    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();

    const lessons = await prisma.lesson.findMany({
      where: {
        ageGroup: {
          lte: age,
        },
      },
      include: {
        module: true,
        // Inclure le module associé
      },
    });
    res.json({ success: true, data: lessons });
  } catch (error) {
    next(error);
  }
};

// POST /api/lessons
export const createLesson = async (req, res, next) => {
  try {
    const { lessonName, lessonUrl, moduleId } = req.body;

    if (!lessonName || !moduleId) {
      return errorObject(
        'Les champs "lessonName" et "moduleId" sont requis.',
        400
      );
    }

    const newLesson = await prisma.lesson.create({
      data: {
        lessonName,
        lessonUrl,
        moduleId: parseInt(moduleId, 10),
      },
    });

    res.status(201).json({ success: true, data: newLesson });
  } catch (error) {
    next(error);
  }
};
//  GET /api/lessons/:lessonId
export const getLessonById = async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    if (!lessonId || isNaN(parseInt(lessonId, 10))) {
      return errorObject('Le champ "lessonId" est invalide.', 400);
    }

    const lesson = await prisma.lesson.findUnique({
      where: { lessonId: parseInt(lessonId, 10) },
      include: {
        module: true,
      },
    });

    if (!lesson) {
      return errorObject("Leçon non trouvée.", 404);
    }

    res.json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
};
//DELETE /api/lessons/:lessonId
export const deleteLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    if (!lessonId || isNaN(parseInt(lessonId, 10))) {
      return errorObject('Le champ "lessonId" est invalide.', 400);
    }

    const deletedLesson = await prisma.lesson.delete({
      where: { lessonId: parseInt(lessonId, 10) },
    });

    res.json({ success: true, data: deletedLesson });
  } catch (error) {
    next(error);
  }
};
// PUT /api/lessons/:lessonId
export const updateLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { lessonName, lessonUrl } = req.body;

    if (!lessonId || isNaN(parseInt(lessonId, 10))) {
      return errorObject('Le champ "lessonId" est invalide.', 400);
    }

    if (!lessonName && !lessonUrl) {
      return errorObject(
        'Au moins un des champs "lessonName" ou "lessonUrl" est requis.',
        400
      );
    }

    const updatedLesson = await prisma.lesson.update({
      where: { lessonId: parseInt(lessonId, 10) },
      data: {
        lessonName,
        lessonUrl,
      },
    });

    res.json({ success: true, data: updatedLesson });
  } catch (error) {
    next(error);
  }
};
// GET /api/lessons/module/:moduleId
export const getLessonsByModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    if (!moduleId || isNaN(parseInt(moduleId, 10))) {
      return errorObject('Le champ "moduleId" est invalide.', 400);
    }

    const lessons = await prisma.lesson.findMany({
      where: { moduleId: parseInt(moduleId, 10) },
      include: {
        module: true,
      },
    });

    if (lessons.length === 0) {
      return errorObject("Aucune leçon trouvée pour ce module.", 404);
    }

    res.json({ success: true, data: lessons });
  } catch (error) {
    next(error);
  }
};
