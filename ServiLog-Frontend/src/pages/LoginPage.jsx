import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(`/account/login`, {
                email,
                password
            });

            if (response.data.success) {
                const { token, account } = response.data.payload;
                login(token, account);
                navigate('/dashboard');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while logging in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-theme-bg">
            <Navbar />
            
            <div className="pt-20 pb-16 md:pt-28 md:pb-24">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-theme-bg shadow-xl rounded-lg p-8 border-2 border-gray-200 dark:border-gray-700">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold font-title text-theme-text mb-2">
                                Welcome Back to <span className="text-primary">Servi</span><span className="text-secondary">Log</span>
                            </h1>
                            <p className="text-theme-text/60 font-body">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-theme-text font-body mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20 outline-none transition-colors font-body text-theme-text"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-theme-text font-body mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20 outline-none transition-colors font-body text-theme-text"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm font-body text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white font-body py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-theme-text/60 font-body">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary hover:text-secondary/80 transition-colors">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;