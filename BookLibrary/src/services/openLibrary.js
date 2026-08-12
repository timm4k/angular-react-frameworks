import initialCatalog from "../data/initialCatalog.json";

const coverOverrides = { OL24421067W: 11981936 };
const API_URL = "https://openlibrary.org";
const COVER_URL = "https://covers.openlibrary.org/b";
const DEFAULT_QUERY = "thriller first_publish_year:[2018 TO 2026] language:eng";
const CATALOG_CACHE_KEY = "noir-shelf-catalog-v7";
const SEARCH_CACHE_PREFIX = "noir-shelf-search-v3:";
const CATALOG_CACHE_TTL = 12 * 60 * 60 * 1000;
const SEARCH_CACHE_TTL = 30 * 60 * 1000;
const genres = [
  ["psychological thriller", "Psychological thriller"],
  ["detective fiction", "Detective fiction"],
  ["science fiction", "Science fiction"],
  ["historical fiction", "Historical fiction"],
  ["crime fiction", "Crime fiction"],
  ["thriller", "Thriller"],
  ["mystery", "Mystery"],
  ["suspense", "Suspense"],
  ["horror", "Horror"],
  ["fantasy", "Fantasy"],
  ["romance", "Romance"],
  ["crime", "Crime"],
  ["fiction", "Fiction"],
];

function coverUrl(coverId) {
  return coverId ? COVER_URL + "/id/" + coverId + "-L.jpg" : "";
}

function normalizeSubjects(subjects = []) {
  return [...new Set(subjects)]
    .filter((subject) => typeof subject === "string")
    .map((subject) => subject.trim())
    .filter(
      (subject) =>
        subject &&
        subject.length <= 60 &&
        !/[:=]/.test(subject) &&
        !/^(new york times bestseller|accessible book|protected daisy)$/i.test(
          subject,
        ),
    )
    .slice(0, 12);
}

function selectGenre(subjects, fallback = "Fiction") {
  const searchableSubjects = subjects.map((subject) => subject.toLowerCase());
  const match = genres.find(([keyword]) =>
    searchableSubjects.some((subject) => subject.includes(keyword)),
  );
  return match?.[1] || fallback;
}

function readSessionCache(key) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(key));
    return cached && Date.now() - cached.savedAt < SEARCH_CACHE_TTL
      ? cached.data.map(mapSearchBook)
      : null;
  } catch {
    return null;
  }
}

function writeSessionCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    return;
  }
}

function uniqueBooks(books, limit) {
  const seen = new Set();
  return books
    .filter((book) => {
      if (seen.has(book.id)) return false;
      seen.add(book.id);
      return true;
    })
    .slice(0, limit);
}

export function mapSearchBook(book) {
  const id = book.id || book.key?.replace("/works/", "") || crypto.randomUUID();
  const subjects = normalizeSubjects(book.subject || book.subjects);
  const coverId = coverOverrides[id] || book.cover_i;
  const cover = coverOverrides[id]
    ? coverUrl(coverId)
    : book.cover || coverUrl(coverId);

  return {
    id,
    workKey:
      book.workKey ||
      (book.key?.startsWith("/")
        ? book.key
        : book.key
          ? "/works/" + book.key
          : undefined),
    title: book.title || "Untitled",
    author: book.author_name?.[0] || book.author || "Unknown author",
    year: book.first_publish_year || book.year || null,
    rating: book.ratings_average
      ? Number(book.ratings_average.toFixed(1))
      : book.rating || null,
    editionCount: book.edition_count || book.editionCount || 0,
    subjects,
    genre: selectGenre(subjects, book.genre || "Fiction"),
    cover,
    coverSmall: cover,
    source: book.source || "open-library",
  };
}

function snapshotBooks() {
  return initialCatalog.map(mapSearchBook);
}

export function getInstantCatalog() {
  try {
    const cached = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY));
    if (
      cached &&
      Date.now() - cached.savedAt < CATALOG_CACHE_TTL &&
      cached.books?.length
    ) {
      return cached.books.map(mapSearchBook);
    }
  } catch {
    return snapshotBooks();
  }
  return snapshotBooks();
}

export async function searchBooks(query, limit = 30, signal, sort = "") {
  const cacheKey = SEARCH_CACHE_PREFIX + JSON.stringify({ query, limit, sort });
  const cached = readSessionCache(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    lang: "en",
    fields:
      "key,title,author_name,first_publish_year,cover_i,subject,ratings_average,edition_count",
  });
  if (sort) params.set("sort", sort);

  const response = await fetch(API_URL + "/search.json?" + params, { signal });
  if (!response.ok) {
    throw new Error("The Open Library catalog is temporarily unavailable");
  }

  const data = await response.json();
  const books = data.docs
    .filter((book) => book.cover_i && book.title && book.author_name?.length)
    .map(mapSearchBook);

  writeSessionCache(cacheKey, books);
  return books;
}

export async function getDefaultCatalog(signal) {
  const liveBooks = await searchBooks(DEFAULT_QUERY, 100, signal);
  const books = uniqueBooks([...liveBooks, ...snapshotBooks()], 30);

  try {
    localStorage.setItem(
      CATALOG_CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), books }),
    );
  } catch {
    return books;
  }

  return books;
}

export async function getBookDetails(book, signal) {
  if (book.source === "user") return book;

  let resolvedBook = mapSearchBook(book);
  if (!resolvedBook.workKey) {
    const matches = await searchBooks(
      'title:"' + book.title + '" author:"' + book.author + '"',
      1,
      signal,
    );
    resolvedBook = matches[0]
      ? { ...resolvedBook, ...matches[0], id: book.id }
      : resolvedBook;
  }

  if (!resolvedBook.workKey) return resolvedBook;

  const response = await fetch(API_URL + resolvedBook.workKey + ".json", {
    signal,
  });
  if (!response.ok) return resolvedBook;

  const work = await response.json();
  const description =
    typeof work.description === "string"
      ? work.description
      : work.description?.value;
  const subjects = normalizeSubjects(work.subjects || resolvedBook.subjects);

  return {
    ...resolvedBook,
    description:
      description ||
      "No full description is currently available for this title",
    subjects,
    genre: selectGenre(subjects, resolvedBook.genre),
  };
}

export async function getSimilarBooks(book, signal) {
  const subject =
    book.subjects?.find((item) => item.length < 35) || book.genre || "books";
  const books = await searchBooks(
    'subject:"' + subject + '"',
    9,
    signal,
    "new",
  );
  return books.filter((item) => item.id !== book.id).slice(0, 6);
}

export function isbnCover(isbn) {
  return isbn ? COVER_URL + "/isbn/" + isbn + "-L.jpg?default=false" : "";
}
