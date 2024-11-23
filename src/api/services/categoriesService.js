import httpClient from "../httpClient";

export async function fetchCategories() {
  const response = await httpClient.get("/categories");
  return response.data;
}
