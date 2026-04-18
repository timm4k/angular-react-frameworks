import { useState } from "react";

export const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  const addItem = () => {
    if (!input.trim()) return;
    setItems([...items, { id: Date.now(), text: input }]);
    setInput("");
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="card green">
      <span className="tag">3.1 Shopping list</span>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What to buy?"
          style={{ marginBottom: 0 }}
        />
        <button onClick={addItem}>Add</button>
      </div>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "6px",
              marginBottom: "8px",
              border: "1px solid var(--border)",
            }}
          >
            <span>{item.text}</span>
            <button
              onClick={() => removeItem(item.id)}
              style={{
                padding: "5px 10px",
                background: "var(--error)",
                color: "white",
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>

      <div className="code-box">
        <p style={{ color: "var(--success)" }}>// Concept: Immutability</p>
        <code>setItems([...items, newItem])</code>
        <p>
          We avoid mutating original array. Instead, we create new array that
          includes new item
        </p>
      </div>
    </div>
  );
};
