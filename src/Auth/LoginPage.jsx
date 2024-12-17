import React, { useState } from "react";
import Auth from "../service/Auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../providers/AuthContext'; 

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { updateUser } = useAuth(); 
    const navigate = useNavigate();
    const authApi = new Auth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authApi.loginUser({ username, password });
            if (response.success) {
                updateUser({
                    token: response.token,
                    user: response.user
                });

                if (onLoginSuccess) {
                    onLoginSuccess(response.user);
                }

                setErrorMessage("");
                if (response.user.role === "User") {
                    navigate("/user");
                } else {
                    navigate("/");
                }
            } else {
                setErrorMessage(response.message || "Failed to login. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage(
                error.response?.data.message || "An error occurred during login. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 sm:p-8"> {/* Added responsive padding */}
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && (
                    <div className="text-red-500 mb-4">{errorMessage}</div>
                )}
                <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;