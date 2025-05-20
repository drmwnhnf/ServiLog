import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://servilog-backend.vercel.app";

  // Password validation regex: at least 8 chars, 1 number, 1 special character
  const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long with at least one number and one special character"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/account/register`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        const accountId = response.data.data?.id;

        setSuccessMessage(
          "Registration successful! Redirecting to verification page..."
        );

        setTimeout(() => {
          navigate(`/verify/${accountId}`);
        }, 2000);
      } else {
        setError(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message === "Email already used") {
        setError(
          "This email is already registered. Please use a different email or login."
        );
      } else if (
        error.response?.data?.message === "Email or password isn't valid"
      ) {
        setError(
          "Please enter a valid email and password (8+ characters with a number and special character)."
        );
      } else {
        setError("Connection error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-[#D52B1E] to-[#FECB00]"></div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Create Account
              </h2>
              <p className="text-gray-600 mt-2">
                Join ServiLog to keep track of your vehicles
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#D52B1E] text-[#D52B1E] rounded">
                <p>{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                <p>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-5">
                <label className="block mb-2 font-medium text-gray-700">
                  Full Name
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/30 focus:border-[#D52B1E]"
                  />
                </div>
              </div>

              <div className="mb-5">
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

              <div className="mb-5">
                <label className="block mb-2 font-medium text-gray-700">
                  Password
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
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters with a number and special
                  character
                </p>
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">
                  Confirm Password
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="flex items-center justify-center mt-8">
                <span className="text-gray-600">Already have an account?</span>
                <Link
                  to="/login"
                  className="ml-2 text-[#D52B1E] hover:underline font-medium"
                >
                  Log in here
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By creating an account, you agree to ServiLog's{" "}
            <a href="#" className="text-[#D52B1E] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#D52B1E] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
