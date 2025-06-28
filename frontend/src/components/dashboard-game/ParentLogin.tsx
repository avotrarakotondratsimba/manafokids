import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Clock, Shield } from "lucide-react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

interface ParentLoginProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

const ParentLogin = ({ onLogin, onBack }: ParentLoginProps) => {
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    childName: "",
    childAge: "",
    childBirthday: "",
    dailyTimeLimit: 2,
    subjects: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);

  const subjects = [
    t("subject_robotics"),
    t("subject_programming"),
    t("subject_mathematics"),
    t("subject_digital_creativity"),
    t(""),
  ];

  const { signUp, googleSignIn, api } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Appel à signUp
      const result = await signUp(
        formData.username,
        formData.email,
        formData.password,
        "",
        ""
      );

      if (typeof result === "string") {
        // Connexion réussie - passer à l'étape 2
        setStep(2);
        toast.success(t("login_success_child_profile_prompt_toast"));
      } else {
        // Gérer la 2FA si nécessaire
        // toast.info(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || t("login_error_toast"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setIsLoading(true);
    try {
      if (!credentialResponse.credential) {
        throw new Error(t("google_login_invalid_response_error"));
      }

      const result = await googleSignIn(credentialResponse.credential);

      if (typeof result === "string") {
        // Connexion réussie - passer à l'étape 2
        setStep(2);
        toast.success(t("google_login_success_child_profile_prompt_toast"));
      } else {
        // Gérer la 2FA si nécessaire
        toast.info(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || t("google_login_failed_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      // 1. Préparer les données pour l'API
      const kidPayload = {
        kidUserName: formData.childName,
        birthDate: formData.childBirthday,
        sessionDuration: formData.dailyTimeLimit,
        avatarUrl: "", // Optionnel
      };

      // 2. Appeler l'API
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/api/kids/`,
        kidPayload
      );

      // 3. Si l'API réussit, stocker dans localStorage
      localStorage.setItem(
        "childData",
        JSON.stringify({
          name: formData.childName,
          age: childAge,
          birthday: formData.childBirthday,
          timeLimit: formData.dailyTimeLimit,
          subjects: formData.subjects,
          // Vous pouvez aussi stocker la réponse de l'API si besoin :
          apiData: response.data,
        })
      );

      toast.success(t("child_profile_saved_success_toast"));
      navigate("/profil-select");
    } catch (error) {
      console.error("Erreur :", error);
      toast.error(t("child_profile_save_error_toast"));
    }
  };

  const [childAge, setChildAge] = useState<number | null>(null);

  useEffect(() => {
    if (formData.childBirthday) {
      const today = new Date();
      const birthDate = new Date(formData.childBirthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setChildAge(age);
    } else {
      setChildAge(null);
    }
  }, [formData.childBirthday]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-white rounded-3xl shadow-2xl border-4 border-blue-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white text-center relative">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Shield className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-2xl font-bold">{t("parent_space_title")}</h2>
            <p className="text-blue-100 mt-2">
              {t("step_indicator")}
              {step}
              {t("sur")}
            </p>
            <div className="flex justify-center mt-4 space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-8">
            {step === 1 && (
              <>
                <div className="mb-8 space-y-4">
                  <div className="w-full [&>div]:w-full [&>div>div]:w-full [&>div>div]:flex [&>div>div]:justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Connexion Google échouée")}
                      shape="rectangular"
                      size="large"
                      theme="outline"
                      text="signin_with"
                      useOneTap={false}
                    />
                  </div>

                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-4 text-gray-500 text-sm">ou</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        {t("username_label")}
                      </label>
                      <Input
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder={t("username_placeholder")}
                        className="text-lg py-4 rounded-2xl border-2 border-blue-200 focus:border-blue-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-blue-500" />
                        {t("email_label")}
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("email_placeholder")}
                        className="text-lg py-4 rounded-2xl border-2 border-blue-200 focus:border-blue-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-blue-500" />
                        {t("password_label")}
                      </label>
                      <Input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={t("password_placeholder")}
                        className="text-lg py-4 rounded-2xl border-2 border-blue-200 focus:border-blue-400"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        !formData.username ||
                        !formData.email ||
                        !formData.password ||
                        isLoading
                      }
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 rounded-2xl text-lg"
                    >
                      {isLoading ? t("logging_in_button") : t("login_button")}
                    </Button>
                  </motion.div>
                </form>
              </>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t("child_info_title")}
                  </h3>
                  <p className="text-gray-600">{t("child_info_description")}</p>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    {t("child_name_label")}
                  </label>
                  <Input
                    name="childName"
                    type="text"
                    value={formData.childName}
                    onChange={handleChange}
                    placeholder={t("child_name_label")}
                    className="text-lg py-4 rounded-2xl border-2 border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      {t("child_birthday_label")}
                    </label>
                    <Input
                      name="childBirthday"
                      type="date"
                      value={formData.childBirthday}
                      onChange={handleChange}
                      className="text-lg py-4 rounded-2xl border-2 border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1 py-3 rounded-2xl"
                  >
                    {t("back_button")}
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      !formData.childName ||
                      !formData.childBirthday ||
                      childAge === null || // ici on vérifie que childAge n'est pas null
                      !(childAge >= 5 && childAge <= 12)
                    }
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 rounded-2xl"
                  >
                    {t("next_button")}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t("parental_control_settings_title")}
                  </h3>
                  <p className="text-gray-600">
                    {t("parental_control_settings_description")}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    {t("daily_time_limit_label")}: {formData.dailyTimeLimit} mn
                    {formData.dailyTimeLimit > 1 ? "s" : ""}
                  </label>
                  <Slider
                    value={[formData.dailyTimeLimit]}
                    onValueChange={(value) =>
                      setFormData({ ...formData, dailyTimeLimit: value[0] })
                    }
                    max={60}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                    <span>40</span>
                    <span>50</span>
                    <span>60</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    {t("subjects_of_interest_label")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {subjects.map((subject) => (
                      <label
                        key={subject}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.subjects.includes(subject)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                subjects: [...formData.subjects, subject],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                subjects: formData.subjects.filter(
                                  (s) => s !== subject
                                ),
                              });
                            }
                          }}
                          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1 py-3 rounded-2xl"
                  >
                    Retour
                  </Button>
                  <Button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 rounded-2xl"
                  >
                    {t("activate_app_button")}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParentLogin;
