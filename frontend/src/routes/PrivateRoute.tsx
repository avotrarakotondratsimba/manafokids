import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

// Define the shape of the component's props
interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({
  children,
}: PrivateRouteProps): React.ReactElement {
  const { authState } = useAuth();

  // Show a loading indicator while checking auth status
  if (authState.isLoading) {
    return <div>Chargement...</div>;
  }

  // If authenticated, render the child components. Otherwise, redirect to the login page.
  return authState.isAuthenticated ? <>{children}</> : <Navigate to="/login2" />;
}
