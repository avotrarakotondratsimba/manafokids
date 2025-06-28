import axios from "axios";

import { RECAPTCHA_SECRET_KEY } from "../config/env.js";
import { errorObject } from "../middlewares/error.middleware.js";

const captchaVerification = async (captchaToken) => {
  try {
    const secret = RECAPTCHA_SECRET_KEY;
    const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captchaToken}`;

    // Appel à l'API de reCAPTCHA
    const response = await axios.post(captchaVerifyUrl);
    const data = response.data;

    // Vérification du succès du captcha
    if (!data.success) errorObject("Échec de la vérification du captcha", 401);

    return true;
  } catch (error) {
    throw error;
  }
};

export default captchaVerification;
