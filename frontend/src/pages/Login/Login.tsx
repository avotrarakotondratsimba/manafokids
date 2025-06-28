import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Heart } from "lucide-react";
import ParentLogin from "../../components/dashboard-game/ParentLogin";
import { Button } from "@/components/ui/button";

import { useTranslation } from "react-i18next";
type UserMode = "selection" | "parent";
type UserType = "parent" | null;

const Login = () => {
  const { t } = useTranslation("login");
  const [currentMode, setCurrentMode] = useState<UserMode>("selection");
  const [userType, setUserType] = useState<UserType>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLogin = (userData: any, type: UserType) => {
    setCurrentUser(userData);
    setUserType(type);
    // After login, navigate to parent dashboard or other functionality
    console.log("Parent logged in:", userData);
  };

  const handleBack = () => {
    setCurrentMode("selection");
    setUserType(null);
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-20 h-20 bg-yellow-300 rounded-full opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-32 w-16 h-16 bg-green-400 rounded-full opacity-20"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-40 w-24 h-24 bg-purple-400 rounded-full opacity-20"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -180, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentMode === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 py-8"
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg"
                >
                  <Zap className="w-12 h-12 text-white" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl font-bold font-bjola bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                >
                  {t("app_name")}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl text-gray-600 max-w-2xl mx-auto"
                >
                  {t("tagline")}
                </motion.p>
              </div>

              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-3xl shadow-xl p-8 border-4 border-blue-200 hover:border-blue-400 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      {t("parent_login_title")}
                    </h2>
                    <p className="text-gray-600 mb-6 text-lg">
                      {t("parent_login_description")}
                    </p>
                    <div className="flex items-center justify-center space-x-2 mb-6">
                      <Heart className="w-5 h-5 text-red-400 fill-current" />
                      <span className="text-sm text-gray-500">
                        {t("secure_controlled")}
                      </span>
                    </div>
                    <Button
                      onClick={() => setCurrentMode("parent")}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {t("parent_connection_button")}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentMode === "parent" && (
            <ParentLogin
              onLogin={(userData) => handleLogin(userData, "parent")}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
