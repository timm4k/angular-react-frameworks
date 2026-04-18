import { useState } from "react";

export const Greeting = () => {
  const [name, setName] = useState("");

  return (
    <div className="card green">
      <span className="tag">2.1 Greeting generator</span>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name..."
      />

      <h1 style={{ color: "var(--neon)" }}>
        Hello, {name.trim() ? name : "Stranger"}!
      </h1>

      <div className="code-box">
        <p style={{ color: "var(--success)" }}>// Concept: Controlled input</p>
        <code>
          value={"{name}"} onChange={"{(e) => setName(e.target.value)}"}
        </code>
        <p>
          We use ternary operator to show "Stranger" if input is empty. The
          input is synced with react state
        </p>
      </div>
    </div>
  );
};
