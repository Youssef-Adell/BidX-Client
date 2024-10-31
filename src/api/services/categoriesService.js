import apiClient from "../apiClient";

export async function getCategories() {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (errorResponse) {
    throw errorResponse;
  }
}
