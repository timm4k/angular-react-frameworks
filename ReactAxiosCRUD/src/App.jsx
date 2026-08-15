import { useCallback, useEffect, useMemo, useState } from "react";
import { productsService } from "./api/products.service";
import Header from "./components/Header";
import CatalogToolbar from "./components/CatalogToolbar";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import ProductDetails from "./components/ProductDetails";
import DeleteDialog from "./components/DeleteDialog";
import Notice from "./components/Notice";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import styles from "./styles/App.module.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [formState, setFormState] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);
  const debouncedQuery = useDebouncedValue(query, 500);

  const loadProducts = useCallback(async (signal) => {
    setLoading(true);
    try {
      setProducts(await productsService.getAll(signal));
      setLoadError(false);
    } catch {
      if (!signal?.aborted) setLoadError(true);
      return;
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadProducts(controller.signal);
    return () => controller.abort();
  }, [loadProducts]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeoutId = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;
      const searchableText =
        `${product.name} ${product.description} ${product.author || ""} ${product.brand || ""}`.toLowerCase();
      return (
        matchesCategory &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [category, debouncedQuery, products]);

  const saveProduct = useCallback(
    async (values) => {
      const editingProduct = formState?.product;
      setSubmitting(true);
      try {
        if (editingProduct) {
          const updated = await productsService.update(
            editingProduct.id,
            values,
          );
          setProducts((current) =>
            current.map((product) =>
              product.id === updated.id ? updated : product,
            ),
          );
          setNotice({
            type: "success",
            message: `${updated.name} was updated`,
          });
        } else {
          const created = await productsService.create({
            ...values,
            isUserAdded: true,
            source: "Personal collection",
          });
          setProducts((current) => [created, ...current]);
          setNotice({
            type: "success",
            message: `${created.name} was added to your collection`,
          });
        }
        setFormState(null);
      } catch {
        setNotice({
          type: "error",
          message: "The product could not be saved. Please try again",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [formState],
  );

  const requestEdit = useCallback((product) => {
    setSelectedProduct(null);
    setFormState({ product });
  }, []);

  const requestDelete = useCallback((product) => {
    setSelectedProduct(null);
    setProductToDelete(product);
  }, []);

  const deleteProduct = useCallback(async () => {
    if (!productToDelete) return;
    const product = productToDelete;
    setBusyId(product.id);
    try {
      await productsService.remove(product.id);
      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
      setProductToDelete(null);
      setNotice({ type: "success", message: `${product.name} was removed` });
    } catch {
      setNotice({
        type: "error",
        message: "The product could not be deleted. Please try again",
      });
    } finally {
      setBusyId(null);
    }
  }, [productToDelete]);

  const toggleStock = useCallback(async (product) => {
    const nextStock = !product.inStock;
    setBusyId(product.id);
    try {
      const updated = await productsService.toggleStock(product.id, nextStock);
      setProducts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSelectedProduct((current) =>
        current && current.id === updated.id ? updated : current,
      );
      setNotice({
        type: "success",
        message: `${updated.name} is now ${nextStock ? "in stock" : "out of stock"}`,
      });
    } catch {
      setNotice({
        type: "error",
        message: "The stock status could not be updated. Please try again",
      });
    } finally {
      setBusyId(null);
    }
  }, []);

  return (
    <div className={styles.app}>
      <Header onAdd={() => setFormState({ product: null })} />
      <main id="catalog" className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Inventory · 2026 collection</p>
            <h1>Stories, sound and moving images</h1>
            <p className={styles.intro}>
              A focused collection for listening rooms, home cinemas,
              photography walks and the books that deepen each craft
            </p>
          </div>
        </section>

        <section
          className={styles.catalogSection}
          aria-labelledby="catalog-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p>Curated inventory</p>
              <h2 id="catalog-title">The Collection</h2>
            </div>
            <span>
              {visibleProducts.length}{" "}
              {visibleProducts.length === 1 ? "result" : "results"}
            </span>
          </div>
          <CatalogToolbar
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
          />
          <ProductList
            products={visibleProducts}
            loading={loading}
            error={loadError}
            query={debouncedQuery}
            category={category}
            onSelect={setSelectedProduct}
            onEdit={requestEdit}
            onDelete={requestDelete}
            onToggleStock={toggleStock}
            onRetry={() => loadProducts()}
            busyId={busyId}
          />
        </section>
      </main>

      {formState && (
        <ProductForm
          product={formState.product}
          onSubmit={saveProduct}
          onClose={() => setFormState(null)}
          submitting={submitting}
        />
      )}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={requestEdit}
          onDelete={requestDelete}
          onToggleStock={toggleStock}
          busy={busyId === selectedProduct.id}
        />
      )}
      {productToDelete && (
        <DeleteDialog
          product={productToDelete}
          onCancel={() => setProductToDelete(null)}
          onConfirm={deleteProduct}
          deleting={busyId === productToDelete.id}
        />
      )}
      <Notice notice={notice} onDismiss={() => setNotice(null)} />
    </div>
  );
}

export default App;
