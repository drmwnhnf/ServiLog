import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unverifiedAccount, setUnverifiedAccount] = useState(null);
  const navigate = useNavigate();

  const API_URL = "https://servilog-backend.vercel.app";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setUnverifiedAccount(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/account/login`, {
        email,
        password,
      });

      console.log("Login response:", response.data); // For debugging

      if (response.data.success) {
        // Store token and user info in localStorage
        // The structure should match what the backend sends
        localStorage.setItem("token", response.data.payload.token);
        console.log("Token:", response.data.payload.token); // For debugging
        localStorage.setItem("userId", response.data.payload.account.id);
        localStorage.setItem("userName", response.data.payload.account.name);

        // Redirect to dashboard after successful login
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.message === "Account isn't verified") {
        // If the account isn't verified, set unverifiedAccount with the ID
        if (error.response?.data?.accountId) {
          setUnverifiedAccount(error.response.data.accountId);
          setError(
            "Your account is not verified. Please verify your account to continue."
          );
        } else {
          // If no account ID is provided, we'll use the email instead
          setUnverifiedAccount(email);
          setError(
            "Your account is not verified. Please verify your account to continue."
          );
        }
      } else if (
        error.response?.data?.message === "Invalid email or password"
      ) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Connection error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goToVerification = () => {
    if (unverifiedAccount) {
      navigate(`/verify/${unverifiedAccount}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-[#D52B1E]">
              Servi<span className="text-[#FECB00]">Log</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Colored header strip */}
          <div className="h-2 bg-gradient-to-r from-[#D52B1E] to-[#FECB00]"></div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2">
                Log in to manage your vehicles
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#D52B1E] text-[#D52B1E] rounded">
                <p>{error}</p>
                {unverifiedAccount && (
                  <button
                    onClick={goToVerification}
                    className="mt-2 text-sm font-medium text-[#D52B1E] hover:underline"
                  >
                    Go to verification page →
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/30 focus:border-[#D52B1E]"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-gray-700">Password</label>
                  <a
                    href="#"
                    className="text-sm text-[#D52B1E] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/30 focus:border-[#D52B1E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${
                  loading
                    ? "bg-[#D52B1E]/70 cursor-not-allowed"
                    : "bg-[#D52B1E] hover:bg-[#C42218]"
                }`}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <div className="flex items-center justify-center mt-8">
                <span className="text-gray-600">Don't have an account?</span>
                <Link
                  to="/register"
                  className="ml-2 text-[#D52B1E] hover:underline font-medium"
                >
                  Register here
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Having trouble logging in?{" "}
            <a href="#" className="text-[#D52B1E] hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
