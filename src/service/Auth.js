import axios from "axios";

class Auth {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL || "https://catch-me.bet/",
        });
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
            });

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
            const token = localStorage.getItem('token'); // Get the JWT token from localStorage
            const response = await this.api.post(
                "/auth/usersByRole",
                { role: role ?? "" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in Authorization header
                    }
                }
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
            const token = localStorage.getItem('token'); // Get the JWT token from localStorage
            const response = await this.api.delete("/auth/delete_user", {
                data: { username: username ?? "" },
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in Authorization header
                }
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
            const token = localStorage.getItem('token'); // Get the JWT token from localStorage
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
            const token = localStorage.getItem('token'); // Get the JWT token from localStorage
            const response = await this.api.get(`/auth/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in Authorization header
                }
            });

            return {
                success: true,
                status: response.status,
                user: response.data.user, // The user data returned from the backend
            };
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur par ID :", error);

            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.message || "Une erreur est survenue lors de la récupération de l'utilisateur",
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
            const token = localStorage.getItem('token');
            const response = await this.api.get("/auth/getallusers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
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

    // Method to get balance by username
    async getBalance(username) {
        try {
            const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token'); // Get the JWT token from localStorage
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
            const token = localStorage.getItem('token');
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
