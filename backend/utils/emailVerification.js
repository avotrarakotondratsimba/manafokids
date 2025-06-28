import axios from "axios";

import { ABSTRACT_API_KEY } from "../config/env.js";
import { errorObject } from "../middlewares/error.middleware.js";

const emailVerification = async (email) => {
  try {
    const apiKey = ABSTRACT_API_KEY;
    const apiUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

    // Appel à l'API AbstractAPI
    const response = await axios.get(apiUrl);
    const data = response.data;

    // Vérification du statut
    const isValid =
      data.deliverability === "DELIVERABLE" && // Signifie que l’adresse est censée pouvoir recevoir des emails
      data.is_mx_found.value === true && // Signifie que le domaine a un serveur mail (MX record). Sans cela, l’email ne peut pas recevoir
      data.is_smtp_valid.value === true; // Signifie que l’API a pu faire un test SMTP et confirmer que l’adresse est valide

    if (!isValid)
      errorObject(
        "L'email est invalide ou ne peut pas recevoir de messages",
        401
      );

    return true;
  } catch (error) {
    throw error;
  }
};

export default emailVerification;
