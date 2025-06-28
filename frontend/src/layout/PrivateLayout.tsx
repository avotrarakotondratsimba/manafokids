// src/layout/PrivateLayout.tsx
import Navbar from "../components/Navbar/Navbar2";
import { Outlet } from "react-router-dom";

const PrivateLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
