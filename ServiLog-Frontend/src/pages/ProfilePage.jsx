import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { account, logout, updateAccount, token } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [createdAt, setCreatedAt] = useState("");
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        if (!account) return;
        setForm({ name: account.name, email: account.email, password: "" });
        if (account.created_at) {
            const date = new Date(account.created_at);
            setCreatedAt(date.toLocaleString());
        }
    }, [account]);

    useEffect(() => {
        if (!account) return;
        setChanged(
            form.name !== account.name ||
            form.email !== account.email ||
            (form.password && form.password.length > 0)
        );
    }, [form, account]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!account) return;
        setLoading(true);
        try {
            const res = await axios.put(`/account/${account.id}`, {
                name: form.name,
                email: form.email,
                password: form.password
            }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                logout();
                alert("Account updated! You've been logged out, please log in again.");
                navigate("/login");
            } else {
                alert(res.data.message || "Failed to update account.");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to update account.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleDelete = async () => {
        if (!account) return;
        setLoading(true);
        try {
            const res = await axios.delete(`/account/${account.id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                logout();
                alert("Account deleted!");
                navigate("/");
            } else {
                alert(res.data.message || "Failed to delete account.");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to delete account.");
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    if (!account) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <div className="max-w-md mx-auto mt-24 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#D52B1E]">Profile</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D52B1E] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D52B1E] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D52B1E] dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400"
                            placeholder="Change Password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Created At</label>
                        <input
                            type="text"
                            value={createdAt}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white cursor-not-allowed"
                        />
                    </div>
                    <div className="flex flex-col gap-3 mt-6">
                        <button
                            type="submit"
                            disabled={!changed || loading}
                            className={`w-full px-4 py-2 rounded-md font-bold text-white ${changed ? "bg-[#D52B1E] hover:bg-[#FECB00] hover:text-[#D52B1E]" : "bg-gray-400 cursor-not-allowed"} transition-colors duration-200`}
                        >
                            Update Account
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full px-4 py-2 rounded-md font-bold text-white bg-gray-500 hover:bg-gray-700 transition-colors duration-200"
                        >
                            Logout
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full px-4 py-2 rounded-md font-bold text-white bg-red-600 hover:bg-red-800 transition-colors duration-200"
                        >
                            Delete Account
                        </button>
                    </div>
                </form>
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <div className="mb-4 text-center text-lg">Are you sure you want to delete your account?</div>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-800"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
