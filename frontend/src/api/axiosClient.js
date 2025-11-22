import axios from "axios";

// create axios instance
const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Add JWT if available
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- DEMO DATA MOCKING BELOW ---
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config } = error;

    // Handle demo routes
    if (config.url.includes("/policies")) {
      return Promise.resolve({
        data: [
          { id: 1, policyName: "Life Insurance - Silver Plan" },
          { id: 2, policyName: "Car Insurance - Premium" },
          { id: 3, policyName: "Health Insurance - Family Cover" },
        ],
      });
    }

    if (config.url.includes("/claims")) {
      return Promise.resolve({
        data: [
          { id: 1, claimType: "Vehicle Damage", status: "Approved" },
          { id: 2, claimType: "Health Claim", status: "Pending" },
        ],
      });
    }

    if (config.url.includes("/payments")) {
      return Promise.resolve({
        data: [
          { id: 1, invoiceId: "INV001", amount: 150.0 },
          { id: 2, invoiceId: "INV002", amount: 250.0 },
        ],
      });
    }

    if (config.url.includes("/reports")) {
      return Promise.resolve({
        data: [
          { id: 1, title: "Monthly Claim Summary" },
          { id: 2, title: "Active Policy Overview" },
        ],
      });
    }

    // fallback for other routes
    return Promise.reject(error);
  }
);
//Client authentication 


export default axiosClient;
