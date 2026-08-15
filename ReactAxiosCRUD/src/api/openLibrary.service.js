import axios from "axios";

const openLibraryApi = axios.create({
  baseURL: "https://openlibrary.org",
  timeout: 8000,
});

export const openLibraryService = {
  async searchBooks(query, signal) {
    const { data } = await openLibraryApi.get("/search.json", {
      params: {
        q: query,
        limit: 5,
        fields: "key,title,author_name,first_publish_year,cover_i,subject",
      },
      signal,
    });
    return data.docs ?? [];
  },
};
