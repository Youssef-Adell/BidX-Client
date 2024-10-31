import apiClient from "../apiClient";

export async function getCities() {
  try {
    const response = await apiClient.get("/cities");
    return response.data;
  } catch (errorResponse) {
    throw errorResponse;
  }
}
