import { PrismaClient } from "../generated/prisma/index.js";

import { errorObject } from "../middlewares/error.middleware.js";

const prisma = new PrismaClient();

// GET /api/divisions/:kidId
export const getDivisionsByKidId = async (req, res, next) => {
  try {
    const { kidId } = req.params;

    if (!kidId || isNaN(parseInt(kidId, 10))) {
      errorObject('Le champ "kidId" est invalide.', 400);
    }

    const kidDivision = await prisma.kid.findUnique({
      where: { kidId: parseInt(kidId, 10) },
      select: {
        divisionName: true,
      },
    });

    const ranking = await prisma.kid.findMany({
      where: {
        divisionName: kidDivision.divisionName,
      },
      orderBy: {
        weekXp: "desc",
      },
    });

    res.status(200).json({
      success: true,
      ranking,
    });
  } catch (error) {
    next(error);
  }
};
