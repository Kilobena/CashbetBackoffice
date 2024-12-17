import axios from "axios";

class TransferService {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL || "https://catch-me.bet/",
        });
    }

    async makeTransfer(senderId, receiverId, amount, type, note) {
        try {
            const token = localStorage.getItem('token');

            console.log("Sending transfer request to /tr/transfer");
            console.log("Request payload:", { senderId, receiverId, amount, type, note });
            console.log("Authorization token:", token);

            const response = await this.api.post("/tr/transfer", {
                senderId,
                receiverId,
                amount,
                type,
                note
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log("Transfer response:", response.data);

            return {
                success: true,
                message: response.data.message,
                transfer: response.data.data.transfer,
                updatedSender: response.data.updatedSender,
                updatedReceiver: response.data.updatedReceiver
            };
        } catch (error) {
            console.error("Erreur lors de la création du transfert :", error);
            
            if (error.response) {
                console.log("Error response status:", error.response.status);
                console.log("Error response data:", error.response.data);
                return {
                    success: false,
                    message: error.response.data.message || "Une erreur est survenue lors de la création du transfert",
                    status: error.response.status
                };
            } else {
                return {
                    success: false,
                    message: "Erreur réseau ou le serveur est inaccessible.",
                    status: 500
                };
            }
        }
    }

    async getUserInfo(username, token) {
        try {
            const response = await this.api.get(`/auth/user/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            return {
                success: true,
                user: response.data.user,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
            return {
                success: false,
                message: error.response ? error.response.data.message : "Une erreur est survenue lors de la récupération des informations de l'utilisateur",
            };
        }
    }

    async getTransferHistory(username, date) {
        try {
            const token = localStorage.getItem('token');
            const response = await this.api.get(`/tr/transfer-history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { username, date }
            });

            return {
                success: true,
                transferHistory: response.data.transferHistory,
            };
        } catch (error) {
            console.error("Error fetching transfer history:", error);
            return {
                success: false,
                message: error.response?.data.message || "An error occurred while fetching transfer history",
                status: error.response?.status || 500
            };
        }
    }
     async getAllTransfers() {
        try {
            const token = localStorage.getItem('token');
            const response = await this.api.get("/tr/all-transfers", {
                headers: {
                    Authorization: `Bearer ${token}`,  // Auth token
                },
            });

            return {
                success: true,
                transfers: response.data.transfers,
            };
        } catch (error) {
            console.error("Error fetching all transfers:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Error fetching all transfers.",
                status: error.response?.status || 500,
            };
        }
    }

}



export default TransferService;