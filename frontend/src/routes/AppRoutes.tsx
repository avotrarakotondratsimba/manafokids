// src/router/Approuter.tsx
import { Routes, Route } from "react-router-dom";

// Layouts
import PrivateLayout from "../layout/PrivateLayout";

// Route Protection
import PrivateRoute from "./PrivateRoute";

// Page Components
import Home from "../pages/Home/Home";
import Signup from "../pages/Login/Signup";
import Notfound from "../pages/Notfound/Notfound";
import Profil from "../pages/Profil/Profil";
import Chat from "@/pages/chat/chat";
import Message from "@/pages/message/message";
import CoursModule from "@/pages/Cours/CoursModule";
import CoursChapter from "@/pages/Cours/CourseChapter";
import Sujet3D from "@/pages/Sujet3D/Sujet3D";
import Single3DView from "@/components/model-view-3d/Single3DView";
import AlgoKids from "@/pages/algoKids/AlgoKids";
import ForgotPassword from "@/pages/Login/ForgotPassword";
import ResetPassword from "@/pages/Login/ResetPassword";
import Login from "@/pages/Login/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import ProfilSelect from "@/pages/profil-select/profil-select";
import KidCanvasPage from "@/pages/Paint/KidCanvasPage";
const Approuter = () => {
  return (
    <Routes>
      {/* --- Routes Publiques --- */}

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* --- Routes Privées Protégées par le Layout --- */}
      <Route
        element={
          // <PrivateRoute>
          <PrivateLayout />
          // </PrivateRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/cours" element={<CoursModule />} />
        <Route path="/cours/:id" element={<CoursChapter />} />
        <Route path="/sujet-3d" element={<Sujet3D />} />
        <Route path="/jeu" element={<Dashboard />} />
        <Route path="/kidcanvas" element={<KidCanvasPage />} />
      </Route>
      <Route path="/chat" element={<Chat />} />
      <Route path="/message" element={<Message />} />
      <Route path="/algoKids" element={<AlgoKids />} />
      <Route path="/profil-select" element={<ProfilSelect />} />
      {/* --- Route pour les pages non trouvées --- */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
};

export default Approuter;
