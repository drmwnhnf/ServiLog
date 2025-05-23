import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Set base URL for axios from environment variable
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize auth state from localStorage on mount    
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedAccount = localStorage.getItem('account');
        
        if (storedToken && storedAccount) {
            setToken(storedToken);
            setAccount(JSON.parse(storedAccount));
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            
            // Redirect to dashboard if trying to access auth pages while logged in
            if (['/login', '/register', '/verify'].some(path => location.pathname.startsWith(path))) {
                navigate('/dashboard');
            }
        } else {
            // Redirect to login if trying to access protected pages while not logged in
            const protectedPaths = ['/dashboard', '/vehicle', '/profile'];
            if (protectedPaths.some(path => location.pathname.startsWith(path))) {
                navigate('/login');
            }
        }
        
        setLoading(false);
    }, [location.pathname, navigate]);

    // Update axios default headers when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Intercept 401 responses and log out
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    logout();
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [navigate]);

    const login = (receivedToken, accountData) => {
        setToken(receivedToken);
        setAccount(accountData);
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('account', JSON.stringify(accountData));
    };

    const logout = () => {
        setToken(null);
        setAccount(null);
        localStorage.removeItem('token');
        localStorage.removeItem('account');
    };

    const updateAccount = (updatedAccount) => {
        setAccount(updatedAccount);
        localStorage.setItem('account', JSON.stringify(updatedAccount));
    };

    if (loading) {
        return null; // or a loading spinner
    }

    const value = {
        token,
        account,
        isAuthenticated: !!token,
        login,
        logout,
        updateAccount
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;