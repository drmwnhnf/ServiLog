import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Pages/components/Navbar";
import Footer from "./Pages/components/Footer";

import LandingPage from "./Pages/Landing";
import Dashboard from "./Pages/Dashboard";

import CreateVehicle from "./Pages/Vehicle/createVehicle";
import VehicleDetails from "./Pages/Vehicle/vehicleDetails";
import EditVehicle from "./Pages/Vehicle/editVehicle";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import VerifyAccount from "./Pages/Auth/verify";
import AccountDetails from "./Pages/Auth/accountDetails";

import PartList from "./Pages/Part/partList";
import CreatePart from "./Pages/Part/createPart";
import PartDetails from "./Pages/Part/partDetails";
import EditPart from "./Pages/Part/editPart";

import CreateMileage from "./Pages/Mileage/createMileage";
import EditMileage from "./Pages/Mileage/editMileage";
import MileageList from "./Pages/Mileage/mileageList";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to landing page if not authenticated
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

// Public Route (accessible only when NOT logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout wrapper to conditionally show Navbar and Footer
const AppLayout = () => {
  const location = useLocation();
  const authPages = ["/login", "/register"];
  const hideNavbar = authPages.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}

      <main className={`flex-1 ${hideNavbar ? "" : "py-5"}`}>
        <Routes>
          {/* Public routes - accessible only when not logged in */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Verification route - accessible to everyone */}
          <Route path="/verify/:id" element={<VerifyAccount />} />

          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Account routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountDetails />
              </ProtectedRoute>
            }
          />

          {/* Vehicle routes */}
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles/create"
            element={
              <ProtectedRoute>
                <CreateVehicle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles/:id"
            element={
              <ProtectedRoute>
                <VehicleDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles/edit/:id"
            element={
              <ProtectedRoute>
                <EditVehicle />
              </ProtectedRoute>
            }
          />

          {/* Parts routes */}
          <Route
            path="/parts/vehicle/:vehicleId"
            element={
              <ProtectedRoute>
                <PartList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parts/add/:vehicleId"
            element={
              <ProtectedRoute>
                <CreatePart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parts/edit/:id"
            element={
              <ProtectedRoute>
                <EditPart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parts/:id"
            element={
              <ProtectedRoute>
                <PartDetails />
              </ProtectedRoute>
            }
          />

          {/* Mileage routes */}
          <Route
            path="/mileage"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mileage/add/:vehicleId"
            element={
              <ProtectedRoute>
                <CreateMileage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mileage/edit/:id"
            element={
              <ProtectedRoute>
                <EditMileage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route
            path="*"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
