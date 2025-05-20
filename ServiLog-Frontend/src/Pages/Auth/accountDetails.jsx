import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiArrowLeft, FiTrash2 } from "react-icons/fi";

export default function AccountDetails() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  // const API_URL = "https://servilog-backend.vercel.app";
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Extract user ID from JWT token
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        console.error("Error parsing JWT:", e);
        return null;
      }
    };

    const decodedToken = parseJwt(token);
    console.log("Decoded token:", decodedToken);

    if (!decodedToken || !decodedToken.id) {
      setError("Invalid token. Please login again.");
      setLoading(false);
      return;
    }

    // Use the userId directly from the decoded token
    const userId = decodedToken.id;
    console.log("User ID from token:", userId);

    // Make a request to the correct endpoint
    fetch(`${API_URL}/account/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(
            `Error fetching data: ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        if (data.success && data.payload) {
          setUserData(data.payload);
        } else {
          throw new Error(data.message || "Failed to load account data");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch profile data.");
      })
      .finally(() => setLoading(false));
  }, [navigate, token]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this account? This action cannot be undone."
      )
    )
      return;

    try {
      const parseJwt = (token) => {
        try {
          return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
          return null;
        }
      };

      const decodedToken = parseJwt(token);
      if (!decodedToken || !decodedToken.id) {
        throw new Error("Invalid token");
      }

      const userId = decodedToken.id;
      console.log("Deleting account with ID:", userId);

      const res = await fetch(`${API_URL}/account/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Delete response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Delete response data:", data);

      if (data.success) {
        alert("Account successfully deleted!");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/register");
      } else {
        alert(data.message || "Failed to delete account.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the account.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D52B1E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="w-full bg-[#D52B1E] text-white py-3 rounded-lg hover:bg-[#D52B1E]/90 transition"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center text-[#D52B1E] hover:text-[#B01D11] mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#D52B1E] to-[#FECB00]"></div>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Account Profile
          </h2>

          {userData ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-4">
                <div className="flex items-center text-gray-600 w-full md:w-1/3 mb-2 md:mb-0">
                  <FiUser className="mr-3 text-[#D52B1E]" />
                  <span className="font-medium">Name</span>
                </div>
                <div className="w-full md:w-2/3 text-gray-900">
                  {userData.name || "Not provided"}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-4">
                <div className="flex items-center text-gray-600 w-full md:w-1/3 mb-2 md:mb-0">
                  <FiMail className="mr-3 text-[#D52B1E]" />
                  <span className="font-medium">Email</span>
                </div>
                <div className="w-full md:w-2/3 text-gray-900">
                  {userData.email || "Not provided"}
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                >
                  <FiTrash2 className="mr-2" /> Delete Account
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No account data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
