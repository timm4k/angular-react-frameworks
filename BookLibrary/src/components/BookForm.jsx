import { useEffect, useReducer } from "react";
import { isbnCover } from "../services/openLibrary";
import styles from "./BookForm.module.css";

const currentYear = new Date().getFullYear();
const initialState = {
  values: {
    title: "",
    author: "",
    genre: "Mystery",
    year: "",
    rating: "4.5",
    isbn: "",
    description: "",
  },
  errors: {},
};

function reducer(state, action) {
  if (action.type === "change") {
    return {
      values: { ...state.values, [action.field]: action.value },
      errors: { ...state.errors, [action.field]: "" },
    };
  }
  if (action.type === "errors") return { ...state, errors: action.errors };
  return state;
}

function validate(values) {
  const errors = {};
  if (values.title.trim().length < 2)
    errors.title = "Enter at least 2 characters";
  if (values.author.trim().length < 3)
    errors.author = "Enter the author’s full name";
  const year = Number(values.year);
  if (!Number.isInteger(year) || year < 1000 || year > currentYear)
    errors.year = "Use a year between 1000 and " + currentYear;
  const rating = Number(values.rating);
  if (rating < 1 || rating > 5)
    errors.rating = "Rating must be between 1 and 5";
  if (
    values.isbn &&
    !/^(?:\d{10}|\d{13})$/.test(values.isbn.replaceAll("-", ""))
  )
    errors.isbn = "Use a valid 10 or 13 digit ISBN";
  return errors;
}

function BookForm({ onAdd, onClose }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const change = (event) =>
    dispatch({
      type: "change",
      field: event.target.name,
      value: event.target.value,
    });

  const submit = (event) => {
    event.preventDefault();
    const errors = validate(state.values);
    if (Object.keys(errors).length) {
      dispatch({ type: "errors", errors });
      return;
    }
    const isbn = state.values.isbn.replaceAll("-", "");
    onAdd({
      ...state.values,
      title: state.values.title.trim(),
      author: state.values.author.trim(),
      year: Number(state.values.year),
      rating: Number(state.values.rating),
      description:
        state.values.description.trim() ||
        "A personal title from your own collection",
      subjects: [state.values.genre],
      cover: isbnCover(isbn),
      coverSmall: isbnCover(isbn),
    });
  };

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <button
          className={styles.close}
          type="button"
          onClick={onClose}
          aria-label="Close form"
        >
          ×
        </button>
        <span className={styles.eyebrow}>Your collection</span>
        <h2 id="form-title">Add a personal book</h2>
        <p className={styles.intro}>
          Only books you add here can be removed later
        </p>
        <form onSubmit={submit} noValidate>
          <Field
            label="Book title"
            name="title"
            value={state.values.title}
            error={state.errors.title}
            onChange={change}
            autoFocus
            placeholder="For example, A Killer’s Mind"
          />
          <Field
            label="Author"
            name="author"
            value={state.values.author}
            error={state.errors.author}
            onChange={change}
            placeholder="Full name"
          />
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Genre</span>
              <select name="genre" value={state.values.genre} onChange={change}>
                <option>Mystery</option>
                <option>Thriller</option>
                <option>Psychological thriller</option>
                <option>Crime</option>
                <option>Suspense</option>
              </select>
            </label>
            <Field
              label="Year"
              name="year"
              type="number"
              value={state.values.year}
              error={state.errors.year}
              onChange={change}
              placeholder="2024"
            />
          </div>
          <Field
            label="ISBN (optional — used to find a cover)"
            name="isbn"
            value={state.values.isbn}
            error={state.errors.isbn}
            onChange={change}
            placeholder="9780000000000"
          />
          <label className={styles.field}>
            <span>Description (optional)</span>
            <textarea
              name="description"
              value={state.values.description}
              onChange={change}
              rows="3"
              placeholder="A short note about the book"
            />
          </label>
          <label className={styles.field}>
            <span>
              Your rating: <b>{state.values.rating}</b>
            </span>
            <input
              className={styles.range}
              name="rating"
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={state.values.rating}
              onChange={change}
            />
            {state.errors.rating && <small>{state.errors.rating}</small>}
          </label>
          <div className={styles.footer}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submit}>
              Add to collection
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({ label, error, ...props }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input {...props} aria-invalid={Boolean(error)} />
      {error && <small>{error}</small>}
    </label>
  );
}
export default BookForm;
