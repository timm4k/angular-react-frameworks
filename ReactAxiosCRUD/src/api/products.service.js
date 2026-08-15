import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? "http://localhost:3001"}/products`,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const productsService = {
  async getAll(signal) {
    const { data } = await api.get("", { signal });
    return data;
  },

  async create(product) {
    const { data } = await api.post("", product);
    return data;
  },

  async update(id, product) {
    const { data } = await api.patch(`/${id}`, product);
    return data;
  },

  async toggleStock(id, inStock) {
    const { data } = await api.patch(`/${id}`, { inStock });
    return data;
  },

  async remove(id) {
    await api.delete(`/${id}`);
  },
};
