import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const VerifyPage = () => {
  const { id } = useParams();
  const [verificationStatus, setVerificationStatus] = useState({
    isLoading: true,
    success: false,
    message: ''
  });

  useEffect(() => {
    const verifyAccount = async () => {      try {
        const response = await axios.post(`/account/verify/${id}`);
        setVerificationStatus({
          isLoading: false,
          success: true,
          message: response.data.message
        });
      } catch (err) {
        setVerificationStatus({
          isLoading: false,
          success: false,
          message: err.response?.data?.message || 'Verification failed. Please try again.'
        });
      }
    };

    verifyAccount();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4">
        {verificationStatus.isLoading ? (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D52B1E]"></div>
        ) : (
          <div className={`max-w-md w-full p-6 rounded-lg shadow-lg ${
            verificationStatus.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="text-center">
              {verificationStatus.success ? (
                <svg
                  className="mx-auto h-12 w-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <h2 className={`mt-4 text-xl font-arial font-bold ${
                verificationStatus.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {verificationStatus.success ? 'Verification Successful' : 'Verification Failed'}
              </h2>
              <p className={`mt-2 font-arial ${
                verificationStatus.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {verificationStatus.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;