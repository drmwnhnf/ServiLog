import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages_idan/LoginPage";
import RegisterPage from "./pages_idan/RegisterPage";
import EditProfilePage from "./pages_idan/EditProfilePage";
import ProfilePage from "./pages_idan/ProfilePages";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root "/" ke "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
