import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VerifyAccount = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("loading"); // loading, success, error, alreadyVerified
  const [message, setMessage] = useState("");
  const API_URL = "https://servilog-backend.vercel.app";

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await axios.post(`${API_URL}/account/verify/${id}`);

        if (response.data.success) {
          setStatus("success");
          setMessage("Your account has been successfully verified!");
        } else {
          // Should not reach here due to axios throwing error on non-200 responses
          setStatus("error");
          setMessage("Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);

        if (error.response?.data?.message === "Account already verified") {
          setStatus("alreadyVerified");
          setMessage("This account has already been verified.");
        } else if (error.response?.data?.message === "Account not found") {
          setStatus("error");
          setMessage(
            "Account not found. Please check the verification link or register again."
          );
        } else {
          setStatus("error");
          setMessage(
            "Verification failed. Please try again or contact support."
          );
        }
      }
    };

    verifyAccount();
  }, [id, API_URL]);

  const getIcon = () => {
    switch (status) {
      case "loading":
        return (
          <div className="w-16 h-16 rounded-full border-4 border-[#D52B1E] border-t-transparent animate-spin mx-auto"></div>
        );
      case "success":
        return (
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case "alreadyVerified":
        return (
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-[#D52B1E]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-[#D52B1E] to-[#FECB00]"></div>

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Account Verification
              </h2>
              <div className="h-1 w-16 bg-[#FECB00] mx-auto"></div>
            </div>

            <div className="my-8">{getIcon()}</div>

            <div className="text-center mb-8">
              {status === "loading" ? (
                <p className="text-lg text-gray-600">
                  Verifying your account...
                </p>
              ) : (
                <div>
                  <p
                    className={`text-lg font-medium ${
                      status === "success" || status === "alreadyVerified"
                        ? "text-gray-800"
                        : "text-[#D52B1E]"
                    }`}
                  >
                    {message}
                  </p>

                  {(status === "success" || status === "alreadyVerified") && (
                    <p className="text-gray-600 mt-2">
                      You can now log in to your account and start using
                      ServiLog.
                    </p>
                  )}

                  {status === "error" && (
                    <p className="text-gray-600 mt-2">
                      If you continue to face issues, please contact our support
                      team.
                    </p>
                  )}
                </div>
              )}
            </div>

            {(status === "success" || status === "alreadyVerified") && (
              <Link to="/login">
                <button className="w-full py-3 px-4 bg-[#D52B1E] text-white font-medium rounded-lg hover:bg-[#C42218] transition-colors shadow-md">
                  Log In to Your Account
                </button>
              </Link>
            )}

            {status === "error" && (
              <div className="flex flex-col space-y-3">
                <Link to="/register">
                  <button className="w-full py-3 px-4 bg-[#D52B1E] text-white font-medium rounded-lg hover:bg-[#C42218] transition-colors shadow-md">
                    Register Again
                  </button>
                </Link>
                <Link to="/">
                  <button className="w-full py-3 px-4 border-2 border-[#D52B1E] text-[#D52B1E] font-medium rounded-lg hover:bg-[#D52B1E]/5 transition-colors">
                    Back to Home
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer with support link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a href="#" className="text-[#D52B1E] hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
