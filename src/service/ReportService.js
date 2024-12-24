import axios from "axios";

// Base API URL
const API_BASE_URL = "https://catch-me.bet/hr"; // Replace with your actual API base URL

export const fetchDailyReport = async ({ date }) => {
  if (!date) {
    throw new Error("Date is required to fetch the daily report.");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/getDailyReport`, { date });
    if (response.data.success) {
      return response.data; // Return the entire response to inspect its structure in the component
    } else {
      throw new Error(response.data.message || "Failed to fetch the daily report.");
    }
  } catch (error) {
    console.error("[ERROR] FetchDailyReport:", error.response || error.message);
    throw new Error(error.response?.data?.message || error.message || "An error occurred while fetching the daily report.");
  }
};
