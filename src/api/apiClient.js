import { useAuthStore } from "@/stores/AuthStore";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://bidx.runasp.net/api",
});

// Optionally add the Authorization header based on whether the request requires authentication
apiClient.interceptors.request.use(
  (config) => {
    const requiresAuth = config.requiresAuth; // Custom property to indicate if auth is required
    if (requiresAuth) setAuthHeader(config);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response.status === 401 &&
      error.config.requiresAuth && // To exclude /refresh endpoint because it shouldn't be retried because this will result into infinite loop
      !error.config.__isRetryRequest
    ) {
      const authStore = useAuthStore();
      const tokenRefreshed = await authStore.refreshToken();

      if (tokenRefreshed) {
        setAuthHeader(error.config);
        error.config.__isRetryRequest = true; // Mark the request as a retry to avoid infinite loops
        return apiClient(error.config); // Retry the original request with new access token
      }
    }

    return Promise.reject(getUnifiedErrorResponse(error));
  }
);

// Helper functions
const setAuthHeader = (config) => {
  const authStore = useAuthStore();
  const token = authStore.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
};

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
