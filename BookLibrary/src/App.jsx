import { useCallback, useMemo, useState } from "react";
import Header from "./components/Header";
import BookForm from "./components/BookForm";
import BookDetails from "./components/BookDetails";
import LibraryControls from "./components/LibraryControls";
import BookList from "./components/BookList";
import { useBookCatalog } from "./hooks/useBookCatalog";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { getBookDetails, getSimilarBooks } from "./services/openLibrary";
import styles from "./App.module.css";

const initialFilters = { query: "", genre: "All genres", sortBy: "relevance" };
const genres = ["All genres", "Mystery", "Thriller", "Crime", "Suspense"];

function App() {
  const [filters, setFilters] = useState(initialFilters);
  const [activeView, setActiveView] = useState("catalog");
  const [userBooks, setUserBooks] = useLocalStorage(
    "noir-shelf-user-books-v2",
    [],
  );
  const [favoriteBooks, setFavoriteBooks] = useLocalStorage(
    "noir-shelf-favorite-books-v3",
    [],
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const catalogQuery = activeView === "catalog" ? filters.query : "";
  const { catalog, loading, error } = useBookCatalog(catalogQuery);

  const favoriteIds = useMemo(
    () => favoriteBooks.map((book) => book.id),
    [favoriteBooks],
  );

  const visibleBooks = useMemo(() => {
    const sourceBooks =
      activeView === "favorites" ? favoriteBooks : [...userBooks, ...catalog];
    const query = filters.query.trim().toLowerCase();

    let result = sourceBooks.filter((book) => {
      const matchesGenre =
        filters.genre === "All genres" ||
        book.subjects?.some((subject) =>
          subject.toLowerCase().includes(filters.genre.toLowerCase()),
        ) ||
        book.genre?.toLowerCase().includes(filters.genre.toLowerCase());

      const searchableText = [book.title, book.author, ...(book.subjects || [])]
        .join(" ")
        .toLowerCase();

      const needsLocalSearch =
        activeView === "favorites" || book.source === "user";
      const matchesQuery =
        !needsLocalSearch || !query || searchableText.includes(query);

      return matchesGenre && matchesQuery;
    });

    if (filters.sortBy === "title") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (filters.sortBy === "author") {
      result = [...result].sort((a, b) => a.author.localeCompare(b.author));
    }
    if (filters.sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    if (filters.sortBy === "year") {
      result = [...result].sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    return result;
  }, [activeView, catalog, favoriteBooks, filters, userBooks]);

  const addBook = useCallback(
    (book) => {
      setUserBooks((current) => [
        {
          ...book,
          id: crypto.randomUUID(),
          source: "user",
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      setIsFormOpen(false);
    },
    [setUserBooks],
  );

  const deleteUserBook = useCallback(
    (id) => {
      setUserBooks((current) => current.filter((book) => book.id !== id));
      setFavoriteBooks((current) => current.filter((book) => book.id !== id));
      setSelectedBook(null);
    },
    [setFavoriteBooks, setUserBooks],
  );

  const toggleFavorite = useCallback(
    (book) => {
      setFavoriteBooks((current) =>
        current.some((item) => item.id === book.id)
          ? current.filter((item) => item.id !== book.id)
          : [...current, book],
      );
    },
    [setFavoriteBooks],
  );

  const openBook = useCallback(async (book) => {
    setSelectedBook(book);
    setSimilarBooks([]);
    setDetailsLoading(true);

    try {
      setSelectedBook(await getBookDetails(book));
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const findSimilar = useCallback(async (book) => {
    setDetailsLoading(true);

    try {
      setSimilarBooks(await getSimilarBooks(book));
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  return (
    <div className={styles.appShell}>
      <Header
        bookCount={userBooks.length + catalog.length}
        favoriteCount={favoriteBooks.length}
        activeView={activeView}
        onViewChange={setActiveView}
        onAddClick={() => setIsFormOpen(true)}
      />

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="library-title">
          <div>
            <h1 id="library-title">
              Stories that hold you
              <br />
              until the final page
            </h1>
          </div>
          <p>
            Explore newer mysteries, thrillers, and crime fiction from a living
            public catalog. Save favorites and discover your next obsession
          </p>
        </section>

        <LibraryControls
          filters={filters}
          genres={genres}
          resultCount={visibleBooks.length}
          onChange={(patch) =>
            setFilters((current) => ({ ...current, ...patch }))
          }
        />

        {error && (
          <div className={styles.error}>
            {error} — your personal books are still available
          </div>
        )}

        <BookList
          books={visibleBooks}
          favorites={favoriteIds}
          loading={loading}
          onOpen={openBook}
          onFavorite={toggleFavorite}
        />
      </main>

      {isFormOpen && (
        <BookForm onAdd={addBook} onClose={() => setIsFormOpen(false)} />
      )}

      {selectedBook && (
        <BookDetails
          book={selectedBook}
          favorites={favoriteIds}
          similarBooks={similarBooks}
          loading={detailsLoading}
          onClose={() => setSelectedBook(null)}
          onFavorite={toggleFavorite}
          onDelete={deleteUserBook}
          onFindSimilar={findSimilar}
          onOpenBook={openBook}
        />
      )}
    </div>
  );
}

export default App;
