import { useEffect, useState } from "react";
import {
  getDefaultCatalog,
  getInstantCatalog,
  searchBooks,
} from "../services/openLibrary";

export function useBookCatalog(query) {
  const [catalog, setCatalog] = useState(getInstantCatalog);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const trimmedQuery = query.trim();
    const hasSearch = trimmedQuery.length >= 3;

    const timer = setTimeout(
      async () => {
        if (hasSearch) setLoading(true);
        setError("");

        try {
          const books = hasSearch
            ? await searchBooks(trimmedQuery, 42, controller.signal, "new")
            : await getDefaultCatalog(controller.signal);
          setCatalog(books);
        } catch (requestError) {
          if (requestError.name !== "AbortError")
            setError(requestError.message);
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      },
      trimmedQuery ? 250 : 0,
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { catalog, loading, error };
}
