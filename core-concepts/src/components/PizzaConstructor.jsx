import { useState } from "react";

export const PizzaDisplay = ({ ingredients, price }) => (
  <div
    style={{
      background: "rgba(0,0,0,0.4)",
      padding: "20px",
      borderRadius: "12px",
      border: "1px dashed var(--neon)",
      textAlign: "center",
    }}
  >
    <h2 style={{ color: "var(--neon)", margin: "0 0 10px 0" }}>
      Total: ${price}
    </h2>
    <p style={{ margin: 0, opacity: 0.8 }}>
      <strong>Toppings:</strong>{" "}
      {ingredients.length > 0 ? ingredients.join(", ") : "Empty Pizza"}
    </p>
  </div>
);

export const PizzaControls = ({ onAdd }) => (
  <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
    <button style={{ flex: 1 }} onClick={() => onAdd("Cheese", 2)}>
      + Cheese ($2)
    </button>
    <button style={{ flex: 1 }} onClick={() => onAdd("Meat", 5)}>
      + Meat ($5)
    </button>
    <button style={{ flex: 1 }} onClick={() => onAdd("Corn", 2)}>
      + Corn ($2)
    </button>
  </div>
);

export const PizzaApp = () => {
  const [ingredients, setIngredients] = useState([]);
  const [price, setPrice] = useState(10);

  const addIngredient = (item, cost) => {
    setIngredients([...ingredients, item]);
    setPrice(price + cost);
  };

  return (
    <div className="card green">
      <span className="tag">3.3 Pizza constructor</span>
      <PizzaDisplay ingredients={ingredients} price={price} />
      <PizzaControls onAdd={addIngredient} />
      <div className="code-box">
        <p style={{ color: "var(--success)" }}>// Concept: Lifting state up</p>
        <code>
          ingredients, price state live in PizzaApp; onAdd passed to
          PizzaControls
        </code>
        <p>PizzaApp holds state for pizza ingredients and total price</p>
        <p>PizzaControls updates state, PizzaDisplay shows data</p>
      </div>
    </div>
  );
};
