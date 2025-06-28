import axios from "axios";
import { N8N_EMAIL_WEBHOOK_URL } from "../config/env.js";

/**
 * Appelle le service d'envoi d'email de n8n.
 * @param {string} template - Le nom du template à utiliser ('welcome', 'forgot-password', '2fa-code').
 * @param {string} recipientEmail - L'adresse email du destinataire.
 * @param {object} payload - Les données pour le template.
 * @param {string} payload.name - Le nom de l'utilisateur.
 * @param {object} [payload.data] - Données spécifiques comme { code: '123' } ou { resetLink: '...' }.
 */
export const triggerEmailService = async (
  template,
  recipientEmail,
  payload
) => {
  if (!N8N_EMAIL_WEBHOOK_URL) {
    console.error("N8N_EMAIL_WEBHOOK_URL n'est pas configuré.");
    return;
  }

  try {
    // On n'attend pas la réponse, on déclenche et on continue (fire-and-forget)
    axios.post(N8N_EMAIL_WEBHOOK_URL, {
      template,
      email: recipientEmail,
      name: payload.name,
      data: payload.data || {},
    });
  } catch (error) {
    // Il est important de ne pas bloquer le flux principal de l'utilisateur si l'email échoue.
    // On se contente de logger l'erreur.

    console.error(
      `L'email: ${recipientEmail} n'a pas pu être envoyé avec le template ${template}.`
    );
  }
};
