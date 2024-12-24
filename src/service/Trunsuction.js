import axios from "axios";
import Cookies from "js-cookie"; // Importing js-cookie to manage cookiesl

class TransferService {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL || "https://catch-me.bet/",
        });
    }

    async makeTransfer(senderId, receiverId, amount, type, note, transactionId) {
        try {
          const token = Cookies.get("token");
    
          const response = await this.api.post(
            "/tr/transfer",
            {
              senderId,
              receiverId,
              amount,
              type,
              note,
              transaction_id: transactionId, // Include transaction_id in the payload
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          return {
            success: true,
            message: response.data.message,
            transfer: response.data.data.transfer,
            updatedSender: response.data.updatedSender,
            updatedReceiver: response.data.updatedReceiver,
          };
        } catch (error) {
          console.error("Erreur lors de la création du transfert :", error);
    
          if (error.response) {
            return {
              success: false,
              message:
                error.response.data.message ||
                "Une erreur est survenue lors de la création du transfert",
              status: error.response.status,
            };
          } else {
            return {
              success: false,
              message: "Erreur réseau ou le serveur est inaccessible.",
              status: 500,
            };
          }
        }
      }
    
      async getUserInfo(username) {
        try {
          const token = Cookies.get('token');
          const response = await this.api.get(`/auth/pages/User/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          return {
            success: true,
            user: response.data.user,
          };
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des informations de l'utilisateur :",
            error
          );
          return {
            success: false,
            message: error.response
              ? error.response.data.message
              : "Une erreur est survenue lors de la récupération des informations de l'utilisateur",
          };
        }
      }
      async getTransferHistory(username, date) {
        try {
          const token = Cookies.get("token");
          const response = await this.api.get(`/tr/transfer-history`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { username, date },
          });
    
          return {
            success: true,
            transferHistory: response.data.transferHistory,
          };
        } catch (error) {
          console.error("Error fetching transfer history:", error);
          return {
            success: false,
            message:
              error.response?.data.message ||
              "An error occurred while fetching transfer history",
            status: error.response?.status || 500,
          };
        }
      
    }
    async getAllTransfers() {
      try {
          const token = Cookies.get('token'); // Get the token from cookies
          if (!token) {
              throw new Error("Authorization token not found.");
          }
  
          const response = await this.api.get("/tr/all-transfers", {
              headers: {
                  Authorization: `Bearer ${token}`, // Auth token
              },
          });
  
          console.log("All transfers response:", response.data);
  
          return {
              success: true,
              transfers: response.data.transfers.map((transfer) => ({
                  id: transfer._id,
                  sender: {
                      id: transfer.senderId?._id || null,
                      username: transfer.senderId?.username || "Unknown",
                      role: transfer.senderId?.role || "Unknown",
                  },
                  receiver: {
                      id: transfer.receiverId?._id || null,
                      username: transfer.receiverId?.username || "Unknown",
                      role: transfer.receiverId?.role || "Unknown",
                  },
                  transactionId: transfer.transaction_id || "N/A",
                  amount: transfer.amount,
                  date: transfer.date,
                  type: transfer.type || "Unknown",
                  note: transfer.note || "N/A",
                  balanceBefore: transfer.balanceBefore || { sender: null, receiver: null },
                  balanceAfter: transfer.balanceAfter || { sender: null, receiver: null },
                  rolledBack: transfer.rolledBack || false,
              })),
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
  

    async getAgentTransactions() {
      try {
          const token = Cookies.get("token"); // Get the token from cookies
          if (!token) {
              throw new Error("Authorization token not found.");
          }

          const response = await this.api.get("/tr/agent-transfer", {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          console.log("Agent transactions response:", response.data);

          return {
              success: true,
              agentTransactions: response.data.agentTransactions.map((transaction) => ({
                  senderRole: transaction.senderRole,
                  date: transaction.date,
                  senderUsername: transaction.senderUsername,
                  senderID: transaction.senderID,
                  receiverID: transaction.receiverID,
                  receiverUsername: transaction.receiverUsername,
                  senderBalanceBefore: transaction.senderBalanceBefore,
                  senderBalanceAfter: transaction.senderBalanceAfter,
                  receiverBalanceBefore: transaction.receiverBalanceBefore,
                  receiverBalanceAfter: transaction.receiverBalanceAfter,
                  amount: transaction.amount, // Include amount in the response mapping
              })),
          };
      } catch (error) {
          console.error("Error fetching agent transactions:", error);

          return {
              success: false,
              message: error.response?.data?.message || "Error fetching agent transactions.",
              status: error.response?.status || 500,
          };
      }
  }

}

export default TransferService;
