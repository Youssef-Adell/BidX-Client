import httpClient from "../httpClient";

export default {
  async fetchCategories() {
    const response = await httpClient.get("/categories");
    return response.data;
  },
};
