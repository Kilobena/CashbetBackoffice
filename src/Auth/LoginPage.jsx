import React, { useState } from "react";
import Auth from "../service/Auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../providers/AuthContext'; 
import Cookies from "js-cookie";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, updateUser } = useAuth();
    const navigate = useNavigate();
    const authApi = new Auth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(""); // Clear previous error

        try {
            const response = await authApi.loginUser({ username, password });
            if (response.success) {
                Cookies.set("token", response.token);
                updateUser(response.user);

                if (onLoginSuccess) {
                    onLoginSuccess(response.user);
                }
                navigate("/");
            } else {
                setErrorMessage(response.message || "Login failed. Please try again.");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data.message ||
                "An error occurred during login. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
            <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md w-full border border-yellow-500">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold text-yellow-500 tracking-wide">
                        Cash<span className="text-gray-800">Bet</span>
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm">
                        Login to manage your back-office dashboard
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Username</label>
                        <input
                            type="text"
                            className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <div className="flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </button>
                        </div>
                    </div>
                    {errorMessage && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                            {errorMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        className={`flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full transition duration-200 ${
                            isLoading ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <BiLoaderAlt className="animate-spin" />
                                Logging in...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
                
            </div>
            <footer className="absolute bottom-4 text-gray-500 text-sm">
                © {new Date().getFullYear()} CashBet. All rights reserved.
            </footer>
        </div>
    );
};

export default Login;
