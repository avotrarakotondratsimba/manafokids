import { PrismaClient } from "../generated/prisma/index.js";
import axios from "axios";

import { errorObject } from "../middlewares/error.middleware.js";
import { N8N_CHATBOT_WEBHOOK_URL } from "../config/env.js";

const prisma = new PrismaClient();

export const chatResponse = async (req, res, next) => {
  // On récupère maintenant le message ET l'identifiant
  const { message, conversationId } = req.body;

  const N8N_WEBHOOK_URL = N8N_CHATBOT_WEBHOOK_URL;

  if (!message || !conversationId)
    errorObject('Les champs "message" et "conversationId" sont requis.', 400);

  try {
    // On envoie les deux informations à n8n
    const n8nResponse = await axios.post(N8N_WEBHOOK_URL, {
      message: message,
      conversationId: conversationId,
    });

    // console.log(n8nResponse);

    res.json({ success: true, response: n8nResponse.data.output });
  } catch (error) {
    console.error("Erreur lors de l'appel à n8n:", error);
    next(error);
  }
};
