import { PrismaClient } from "../generated/prisma/index.js";

import { errorObject } from "../middlewares/error.middleware.js";

const prisma = new PrismaClient();

// GET /api/theme/:themeId
export const getThemeById = async (req, res, next) => {
  try {
    const { themeId } = req.params;
    if (!themeId || isNaN(parseInt(themeId, 10))) {
      return errorObject('Le champ "themeId" est invalide.', 400);
    }

    const theme = await prisma.theme.findUnique({
      where: { themeId: parseInt(themeId, 10) },
      include: {
        modules: true,
      },
    });

    if (!theme) {
      return errorObject("Thème non trouvé.", 404);
    }

    res.json({ success: true, data: theme });
  } catch (error) {
    next(error);
  }
};

// GET /api/themes?birthDate=YYYY-MM-DD
export const getThemes = async (req, res, next) => {
  try {
    const { birthDate } = req.query;

    if (birthDate && isNaN(Date.parse(birthDate))) {
      return errorObject('Le champ "birthDate" est invalide.', 400);
    }

    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();

    const themes = await prisma.theme.findMany({
      where: {
        ageGroup: {
          lte: age,
        },
      },
      include: {
        modules: true,
      },
    });

    res.json({ success: true, data: themes });
  } catch (error) {
    next(error);
  }
};
// POST /api/themes
export const createTheme = async (req, res, next) => {
  try {
    const { themeName, themeUrl } = req.body;

    if (!themeName) {
      return errorObject('Le champ "themeName" est requis.', 400);
    }

    const newTheme = await prisma.theme.create({
      data: {
        themeName,
        themeUrl,
      },
    });

    res.status(201).json({ success: true, data: newTheme });
  } catch (error) {
    next(error);
  }
};

// PUT /api/themes/:themeId
export const updateTheme = async (req, res, next) => {
  try {
    const { themeId } = req.params;
    const { themeName, themeUrl } = req.body;

    if (!themeId || isNaN(parseInt(themeId, 10))) {
      return errorObject('Le champ "themeId" est invalide.', 400);
    }

    if (!themeName) {
      return errorObject('Le champ "themeName" est requis.', 400);
    }

    const updatedTheme = await prisma.theme.update({
      where: { themeId: parseInt(themeId, 10) },
      data: { themeName, themeUrl },
    });

    res.json({ success: true, data: updatedTheme });
  } catch (error) {
    next(error);
  }
};

//DELETE /api/themes/:themeId
export const deleteTheme = async (req, res, next) => {
  try {
    const { themeId } = req.params;

    if (!themeId || isNaN(parseInt(themeId, 10))) {
      return errorObject('Le champ "themeId" est invalide.', 400);
    }

    const deletedTheme = await prisma.theme.delete({
      where: { themeId: parseInt(themeId, 10) },
    });

    res.json({ success: true, data: deletedTheme });
  } catch (error) {
    next(error);
  }
};
