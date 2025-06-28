import { PrismaClient } from "../generated/prisma/index.js";
import { errorObject } from "../middlewares/error.middleware.js";

const prisma = new PrismaClient();

// GET /api/modules?birthDate=YYYY-MM-DD
export const getAllModule = async (req, res, next) => {
  try {
    const { birthDate } = req.query;

    if (birthDate && isNaN(Date.parse(birthDate))) {
      return errorObject('Le champ "birthDate" est invalide.', 400);
    }

    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();

    const modules = await prisma.module.findMany({
      where: {
        ageGroup: {
          lte: age,
        },
      },
      include: {
        theme: true,
        lessons: true, // Inclure les leçons associées
      },
    });

    res.json({ success: true, data: modules });
  } catch (error) {
    next(error);
  }
};

// POST /api/modules
export const createModule = async (req, res, next) => {
  try {
    const { moduleName, moduleUrl, themeId } = req.body;

    if (!moduleName || !themeId) {
      return errorObject(
        'Les champs "moduleName" et "themeId" sont requis.',
        400
      );
    }

    const newModule = await prisma.module.create({
      data: {
        moduleName,
        moduleUrl,
        themeId: parseInt(themeId, 10),
      },
    });

    res.status(201).json({ success: true, data: newModule });
  } catch (error) {
    next(error);
  }
};

// GET /api/modules/:moduleId
export const getModuleById = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    if (!moduleId || isNaN(parseInt(moduleId, 10))) {
      return errorObject('Le champ "moduleId" est invalide.', 400);
    }

    const module = await prisma.module.findUnique({
      where: { moduleId: parseInt(moduleId, 10) },
      include: {
        theme: true,
        lessons: true,
      },
    });

    if (!module) {
      return errorObject("Module non trouvé.", 404);
    }

    res.json({ success: true, data: module });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/modules/:moduleId
export const deleteModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    if (!moduleId || isNaN(parseInt(moduleId, 10))) {
      return errorObject('Le champ "moduleId" est invalide.', 400);
    }

    const deletedModule = await prisma.module.delete({
      where: { moduleId: parseInt(moduleId, 10) },
    });

    res.json({ success: true, data: deletedModule });
  } catch (error) {
    next(error);
  }
};

// PUT /api/modules/:moduleId
export const updateModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const { moduleName, moduleUrl, themeId } = req.body;

    if (!moduleId || isNaN(parseInt(moduleId, 10))) {
      return errorObject('Le champ "moduleId" est invalide.', 400);
    }

    const updatedModule = await prisma.module.update({
      where: { moduleId: parseInt(moduleId, 10) },
      data: {
        moduleName,
        moduleUrl,
        themeId: themeId ? parseInt(themeId, 10) : undefined,
      },
    });

    res.json({ success: true, data: updatedModule });
  } catch (error) {
    next(error);
  }
};

//GET by theme
export const getModulesByTheme = async (req, res, next) => {
  try {
    const { themeId } = req.params;

    if (!themeId || isNaN(parseInt(themeId, 10))) {
      return errorObject('Le champ "themeId" est invalide.', 400);
    }

    const modules = await prisma.module.findMany({
      where: { themeId: parseInt(themeId, 10) },
      include: {
        theme: true,
        lessons: true,
      },
    });

    if (modules.length === 0) {
      return errorObject("Aucun module trouvé pour ce thème.", 404);
    }

    res.json({ success: true, data: modules });
  } catch (error) {
    next(error);
  }
};
