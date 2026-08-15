export function bookCover(coverId) {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : "";
}

export function getCoverThumb(image) {
  const coverId =
    /^https:\/\/covers\.openlibrary\.org\/b\/id\/(\d+)-[A-Z]\.jpg$/.exec(image);
  if (coverId) return `https://covers.openlibrary.org/b/id/${coverId[1]}-M.jpg`;

  const archiveId =
    /^https:\/\/archive\.org\/download\/olcovers\d+\/olcovers\d+-L\.zip\/(\d+)-L\.jpg$/.exec(
      image,
    );
  if (archiveId)
    return `https://covers.openlibrary.org/b/id/${archiveId[1]}-M.jpg`;

  if (image.startsWith("https://archive.org/download/")) {
    return image
      .replace(/l_covers_/g, "m_covers_")
      .replace(/-L\.jpg$/, "-M.jpg");
  }

  return image;
}

export function toProductFields(book) {
  const authors = book.author_name ?? [];
  const subjects = (book.subject ?? []).slice(0, 3).join(", ").toLowerCase();

  return {
    name: book.title,
    author: authors.join(", "),
    year: book.first_publish_year,
    description: authors.length
      ? `A book by ${authors.join(", ")}${subjects ? ` about ${subjects}` : ""}`
      : subjects
        ? `About ${subjects}`
        : "",
    image: bookCover(book.cover_i),
  };
}
