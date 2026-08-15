import { cloneElement, useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "../validation/productSchema";
import { openLibraryService } from "../api/openLibrary.service";
import { toProductFields } from "../utils/bookMetadata";
import { useEscapeKey } from "../hooks/useEscapeKey";
import styles from "../styles/ProductForm.module.css";

const emptyProduct = {
  name: "",
  price: "",
  category: "",
  description: "",
  inStock: true,
  image: "",
};
const maxImageSize = 2 * 1024 * 1024;

function Field({ label, hint, error, children }) {
  const errorId = useId();

  return (
    <label className={styles.field}>
      <span>{label}</span>
      {cloneElement(children, {
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {hint}
      {error && (
        <small id={errorId} role="alert">
          {error.message}
        </small>
      )}
    </label>
  );
}

function ProductForm({ product, onSubmit, onClose, submitting }) {
  const [uploadError, setUploadError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupResults, setLookupResults] = useState([]);
  const [bookDetails, setBookDetails] = useState(null);
  const lookupControllerRef = useRef(null);
  useEscapeKey(onClose, !submitting);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: emptyProduct,
    mode: "onBlur",
  });

  const description = watch("description") ?? "";
  const image = watch("image") ?? "";
  const category = watch("category");

  useEffect(() => {
    reset(product ?? emptyProduct);
    setUploadError("");
    setLookupError("");
    setLookupResults([]);
    setBookDetails(null);
  }, [product, reset]);

  useEffect(() => () => lookupControllerRef.current?.abort(), []);

  const uploadImage = (event) => {
    const [file] = event.target.files;
    setUploadError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file");
      return;
    }
    if (file.size > maxImageSize) {
      setUploadError("Image must be smaller than 2 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      setValue("image", reader.result, { shouldDirty: true });
    reader.onerror = () => setUploadError("The image could not be read");
    reader.readAsDataURL(file);
  };

  const runLookup = async () => {
    const title = watch("name").trim();
    if (!title) return;

    lookupControllerRef.current?.abort();
    const controller = new AbortController();
    lookupControllerRef.current = controller;
    setLookupLoading(true);
    setLookupError("");
    setLookupResults([]);
    try {
      const books = await openLibraryService.searchBooks(
        title,
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setLookupResults(books);
      if (!books.length)
        setLookupError("No books found — try a different title");
    } catch {
      if (!controller.signal.aborted)
        setLookupError(
          "The book lookup is unavailable. Add the photo manually",
        );
    } finally {
      if (!controller.signal.aborted) setLookupLoading(false);
    }
  };

  const applyBook = (book) => {
    const fields = toProductFields(book);
    setValue("name", fields.name, { shouldDirty: true, shouldValidate: true });
    setValue("description", fields.description, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("image", fields.image, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setBookDetails({ author: fields.author, year: fields.year });
    setLookupResults([]);
    setLookupError("");
  };

  const submit = (values) =>
    onSubmit({
      ...values,
      ...(category === "books" ? bookDetails : {}),
      name: values.name.trim(),
      price: Number(values.price),
      description: values.description.trim(),
      image: values.image || "",
    });

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <section
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
      >
        <div className={styles.heading}>
          <div>
            <p>{product ? "Update collection" : "New arrival"}</p>
            <h2 id="product-form-title">
              {product ? "Edit Product" : "Add Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close form"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Field label="Product name" error={errors.name}>
            <input
              {...register("name")}
              placeholder="e.g. Nocturne Headphones"
              autoFocus
            />
          </Field>

          <div className={styles.row}>
            <Field label="Price, USD" error={errors.price}>
              <input
                {...register("price")}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </Field>
            <Field label="Category" error={errors.category}>
              <select {...register("category")}>
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothes">Clothes</option>
                <option value="books">Books</option>
              </select>
            </Field>
          </div>

          <div className={styles.enrichment}>
            <div>
              <strong>Product image</strong>
              <p>Upload a photo from your device for a polished product card</p>
            </div>
            {category === "books" && (
              <button
                type="button"
                onClick={runLookup}
                disabled={lookupLoading || submitting}
              >
                {lookupLoading ? "Searching…" : "Find Details"}
              </button>
            )}
          </div>

          {category === "books" && lookupError && (
            <p className={styles.lookupError} role="alert">
              {lookupError}
            </p>
          )}
          {category === "books" && lookupResults.length > 0 && (
            <ul className={styles.lookupResults}>
              {lookupResults.map((book) => {
                const fields = toProductFields(book);
                return (
                  <li key={book.key}>
                    <div>
                      <strong>{fields.name}</strong>
                      <small>
                        {[fields.author, fields.year]
                          .filter(Boolean)
                          .join(" · ")}
                      </small>
                    </div>
                    <button type="button" onClick={() => applyBook(book)}>
                      Use
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className={styles.imageRow}>
            <div className={styles.imagePreview}>
              {image ? (
                <img src={image} alt="Product preview" />
              ) : (
                <span aria-hidden="true">No image</span>
              )}
            </div>
            <div className={styles.uploadActions}>
              <label className={styles.uploadButton}>
                Upload from device
                <input type="file" accept="image/*" onChange={uploadImage} />
              </label>
              {image && (
                <button
                  type="button"
                  onClick={() =>
                    setValue("image", "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  Remove image
                </button>
              )}
              <small>JPG, PNG or WebP · maximum 2 MB</small>
            </div>
          </div>
          {(uploadError || errors.image) && (
            <p className={styles.uploadError} role="alert">
              {errors.image?.message || uploadError}
            </p>
          )}

          <Field
            label={
              <>
                Description <em>Optional</em>
              </>
            }
            error={errors.description}
            hint={
              <span className={styles.counter}>{description.length}/200</span>
            }
          >
            <textarea
              {...register("description")}
              rows="5"
              placeholder="Describe what makes this product worth discovering"
            />
          </Field>

          <label className={styles.checkbox}>
            <input {...register("inStock")} type="checkbox" />
            <span aria-hidden="true" />
            Product is currently in stock
          </label>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Saving…"
                : product
                  ? "Save Changes"
                  : "Add to Collection"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProductForm;
