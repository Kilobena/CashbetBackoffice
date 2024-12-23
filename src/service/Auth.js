import axios from "axios";
import Cookies from "js-cookie"; // Importing js-cookie to manage cookiesl

class Auth {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL || "https://catch-me.bet/",  // Ensure this is your correct backend URL
        });

        // Add an interceptor to handle token refresh
        this.api.interceptors.request.use(
            (config) => {
                const token = Cookies.get("token");
                if (token) {
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Add a response interceptor to handle token refresh
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response && error.response.status === 401) {
                    // Token expired, try to refresh


                    const newToken = await this.refreshToken();
                    if (newToken) {
                        // Retry the original request with the new token
                        error.config.headers["Authorization"] = `Bearer ${newToken}`;
                        return axios(error.config);
                    }
                }
                return Promise.reject(error);
            }
        );
    }




    async refreshToken() {
        try {
            const response = await this.api.post("/auth/refresh-token", {
            }, {
                withCredentials: true, // Optional: Use this if you still want to send cookies
            });


            const newAccessToken = response.data.accessToken;
            Cookies.set("token", newAccessToken); // Save the new token
            return newAccessToken;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            return null;
        }
    }

  async logoutUser() {
        try {
            const response = await this.api.post("/logout", null, {
                withCredentials: true, // Ensure cookies (like refreshToken) are included
            });

            if (response.data.success) {
                Cookies.remove("token"); // Clear the token
                Cookies.remove("refreshToken"); // Clear the refresh token
                Cookies.remove("user"); // Clear user data
                return {
                    success: true,
                    message: response.data.message,
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || "Logout failed.",
                };
            }
        } catch (error) {
            console.error("Error during logout:", error);
            return {
                success: false,
                message: error.response?.data?.message || "An error occurred during logout.",
            };
        }
    }

    
    async registerUser(profile) {
        try {
            const response = await this.api.post("/auth/register", {
                username: profile.username ?? "",
                password: profile.password ?? "",
                role: profile.role ?? "user",
                id: profile.id
            });

            return {
                success: true,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);

            if (error.response) {
                if (error.response.status === 409) {
                    return {
                        success: false,
                        status: 409,
                        message: "Utilisateur déjà enregistré",
                    };
                }
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "Une erreur est survenue lors de l'enregistrement",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }

    // Method to login a user
    async loginUser(credentials) {
        try {
            const response = await this.api.post("/auth/login", {
                username: credentials.username ?? "",
                password: credentials.password ?? ""
            },{
                withCredentials: true,
                }
            );

            // Store the tokens (both access and refresh tokens) in cookies
            Cookies.set('token', response.data.token);

            return {
                success: true,
                status: response.status,
                token: response.data.token,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            console.error("Erreur lors de la connexion de l'utilisateur :", error);

            if (error.response) {
                if (error.response.status === 401) {
                    return {
                        success: false,
                        status: 401,
                        message: "Mot de passe incorrect",
                    };
                }
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data?.message || "Une erreur est survenue lors de la connexion",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }

    // Method to get users by role
    async getUsersByRole(role) {
        try {
            const token = Cookies.get('token');
            const response = await this.api.post("/auth/usersByRole",
                { role: role ?? "" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return {
                success: true,
                status: response.status,
                users: response.data.users,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs par rôle :", error);

            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "Une erreur est survenue lors de la récupération des utilisateurs",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }

    // Method to delete user by username (Include JWT in headers)
    async deleteUserByUsername(username) {
        try {
            const token = Cookies.get('token');
            const response = await this.api.delete("/auth/delete_user", {
                data: { username: username ?? "" },
                headers: { Authorization: `Bearer ${token}` }
            });

            return {
                success: true,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);

            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "Une erreur est survenue lors de la suppression de l'utilisateur",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }

    // 1. New Method to delete user by ID
    async deleteUserById(userId) {
        try {
            const token = Cookies.get('token');
            console.log("Sending DELETE request for user ID:", userId); // Log the userId being deleted
    
            const response = await this.api.delete(`/auth/delete_user/${userId}`, { // Use userId in the URL
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in Authorization header
                }
            });
    
            console.log("Response from delete user API:", response.data); // Log the response from the server
            return {
                success: true,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error("Error deleting user:", error); // Log any error that occurs during the request
    
            if (error.response) {
                console.error("Error response from API:", error.response.data);
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "Error deleting user",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }
    

   
    async getUserById(userId) {
        try {
            const token = Cookies.get('token'); // Get the JWT token from cookies
            if (!token) {
                console.error("No token found in cookies. Redirecting to login.");
                return {
                    success: false,
                    status: 401,
                    message: "Unauthorized. Please log in again.",
                };
            }
    
            console.log("Fetching user with ID:", userId);
            console.log("Using token:", token);
    
            const response = await this.api.get(`/auth/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in Authorization header
                },
            });
    
            console.log("API response for getUserById:", response.data);
    
            return {
                success: true,
                status: response.status,
                user: response.data.user, // Adjust based on actual backend response
            };
        } catch (error) {
            console.error("Error fetching user by ID:", error);
    
            if (error.response) {
                console.error("Error response from API:", error.response.data);
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "An error occurred while retrieving the user.",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }
    

    // Method to get all users
    async getAllUsers() {
        try {
            const token = Cookies.get('token');
            const response = await this.api.get("/auth/getallusers", {
                headers: { Authorization: `Bearer ${token}` }
            });

            return {
                success: true,
                status: response.status,
                users: response.data.users,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération de tous les utilisateurs :", error);

            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "Une erreur est survenue lors de la récupération des utilisateurs",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }

    // Method to get the balance of a user
    async getBalance(username) {
        try {
            const token = Cookies.get('token');
            const response = await this.api.post("/auth/getBalance",
                { username: username ?? "" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return {
                success: true,
                status: response.status,
                balance: response.data.balance,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération du solde de l'utilisateur :", error);

            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "Une erreur est survenue lors de la récupération du solde",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }

    // Method to get balance by username
    async getBalance(username) {
        try {
            const token = Cookies.get('token');
            const response = await this.api.post("/auth/getBalance",
                { username: username ?? "" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            return {
                success: true,
                status: response.status,
                balance: response.data.balance,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération du solde de l'utilisateur :", error);

            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "Une erreur est survenue lors de la récupération du solde",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }

    // Method to get users by CreaterId
    async getUsersByCreaterId(createrid) {
        try {
            const token = Cookies.get('token');
            const response = await this.api.get(`/auth/usersByCreater/${createrid}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in Authorization header
                }
            });
    
            return {
                success: true,
                status: response.status,
                user: response.data.user, // Updated: Root user with the entire hierarchy
            };
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs par creater ID :", error);
    
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "Une erreur est survenue lors de la récupération des utilisateurs",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }
    
    // Method to update user by username
    async updateUser(userId, updatedDetails) {
        try {
            const token = Cookies.get('token');
            const response = await this.api.put("/auth/update",  // <-- No userId in the URL
                {
                    userId: userId, // Pass the userId in the body
                    ...updatedDetails // Include the updated fields (username, role, etc.)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include JWT in headers
                    }
                }
            );
    
            return {
                success: true,
                status: response.status,
                message: response.data.message,
                user: response.data.user, // The updated user data returned from the backend
            };
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "Une erreur est survenue lors de la mise à jour de l'utilisateur",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error or server is unreachable.",
                };
            }
        }
    }

    // In your Auth service class
async getProfile(username) {
    try {
        const response = await this.api.post("/auth/profile", { username });

        return {
            success: true,
            user: response.data.user, // The user data returned from the backend
        };
    } catch (error) {
        console.error("Erreur lors de la récupération du profil de l'utilisateur :", error);

        if (error.response) {
            return {
                success: false,
                message: error.response.data.message || "Une erreur est survenue lors de la récupération du profil de l'utilisateur",
            };
        } else {
            return {
                success: false,
                message: "Network error or server is unreachable.",
            };
        }
    }
}

    
}

export default Auth;
