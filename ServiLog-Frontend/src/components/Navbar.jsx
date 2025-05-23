import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { isAuthenticated } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-theme-bg border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-title font-bold text-primary">
                        <span>Servi</span><span className='text-secondary'>Log</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    className="font-body text-theme-text hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    to="/profile" 
                                    className="font-body text-theme-text hover:text-primary transition-colors"
                                >
                                    Profile
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="font-body text-theme-text hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="font-body text-theme-text hover:text-primary transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                        
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-theme-text hover:text-primary transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;