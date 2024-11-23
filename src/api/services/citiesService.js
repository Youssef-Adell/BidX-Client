import httpClient from "../httpClient";

export async function fetchCities() {
  const response = await httpClient.get("/cities");
  return response.data;
}
