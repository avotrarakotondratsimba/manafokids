import { PrismaClient } from "../generated/prisma/index.js";

import { errorObject } from "../middlewares/error.middleware.js";

const prisma = new PrismaClient();

// GET /api/messages/group/:groupId
export const getGroupMessages = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    if (!groupId) {
      return errorObject('Le champ "groupId" est requis.', 400);
    }
    if (isNaN(parseInt(groupId, 10))) {
      return errorObject('Le champ "groupId" doit être un nombre.', 400);
    }
    const messages = await prisma.message.findMany({
      where: {
        groupId: parseInt(groupId, 10),
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            userId: true,
            userName: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, message: messages });
  } catch (error) {
    next(error);
  }
};

// POST /api/messages/group/:groupId
export const insertGroupMessage = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;
    if (!groupId || !content) {
      return errorObject('Les champs "groupId" et "content" sont requis.', 400);
    }

    if (isNaN(parseInt(groupId, 10))) {
      return errorObject('Le champ "groupId" doit être un nombre.', 400);
    }

    const message = await prisma.message.create({
      data: {
        groupId: parseInt(groupId, 10),
        text: content,
        senderId: req.user.userId, // Définit dans le middleware d'authentification
      },
      include: {
        sender: {
          select: {
            userId: true,
            userName: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, message: message });
  } catch (error) {
    next(error);
  }
};

// PUT /api/messages/group/:messageId
export const updateGroupMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!messageId || !content) {
      return errorObject(
        'Les champs "messageId" et "content" sont requis.',
        400
      );
    }
    if (isNaN(parseInt(messageId, 10))) {
      return errorObject('Le champ "messageId" doit être un nombre.', 400);
    }

    const existingMessage = await prisma.message.findUnique({
      where: {
        messageId: parseInt(messageId, 10),
      },
    });

    if (!existingMessage) {
      return errorObject("Le message n'existe pas.", 404);
    }

    if (existingMessage.senderId !== req.user.userId) {
      return errorObject(
        "Vous n'êtes pas autorisé à modifier ce message.",
        403
      );
    }

    const updatedMessage = await prisma.message.update({
      where: {
        messageId: parseInt(messageId, 10),
      },
      data: {
        text: content,
      },
      include: {
        sender: {
          select: {
            userId: true,
            userName: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, message: updatedMessage });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/messages/group/:messageId
export const deleteGroupMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return errorObject('Le champ "messageId" est requis.', 400);
    }

    if (isNaN(parseInt(messageId, 10))) {
      return errorObject('Le champ "messageId" doit être un nombre.', 400);
    }

    const existingMessage = await prisma.message.findUnique({
      where: { messageId: parseInt(messageId, 10) },
    });

    if (!existingMessage) {
      return errorObject("Le message n'existe pas.", 404);
    }

    if (existingMessage.senderId !== req.user.userId) {
      return errorObject(
        "Vous n'êtes pas autorisé à supprimer ce message.",
        403
      );
    }

    const deletedMessage = await prisma.message.delete({
      where: {
        messageId: parseInt(messageId, 10),
      },
    });

    res.json({ success: true, message: deletedMessage });
  } catch (error) {
    next(error);
  }
};
