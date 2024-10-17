import { useAuthStore } from "@/stores/AuthStore";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://bidx.runasp.net/api",
});

// Optionally add the Authorization header based on whether the request requires authentication
apiClient.interceptors.request.use(
  (config) => {
    const requiresAuth = config.requiresAuth; // Custom property to indicate if auth is required

    if (requiresAuth) {
      const authStore = useAuthStore();
      const token = authStore.accessToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(getUnifiedErrorResponse(error))
);

// Helper function to return a unified error object
const getUnifiedErrorResponse = (error) => {
  let errorResponse;

  if (error.code === "ERR_NETWORK") {
    errorResponse = {
      errorCode: "CLIENT_ERROR",
      errorMessages: ["Oops! Something went wrong!"],
    };
  } else {
    errorResponse = error.response.data;
  }

  return errorResponse;
};

export default apiClient;
