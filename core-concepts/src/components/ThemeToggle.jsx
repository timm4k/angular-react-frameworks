import { useState } from "react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const themeStyle = {
    backgroundColor: isDark ? "#000" : "#fff",
    color: isDark ? "#fff" : "#000",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    transition: "0.3s all ease",
  };

  return (
    <div className="card green">
      <span className="tag">2.2 Theme switcher</span>

      <div style={themeStyle}>
        Current Theme: {isDark ? "Dark Mode" : "Light Mode"}
      </div>

      <button
        style={{ marginTop: "15px", width: "100%" }}
        onClick={() => setIsDark(!isDark)}
      >
        Switch to {isDark ? "Light" : "Dark"}
      </button>

      <div className="code-box">
        <p style={{ color: "var(--success)" }}>// Concept: Boolean toggle</p>
        <code>setIsDark(!isDark)</code>
        <p>
          Boolean isDark determines which set of CSS properties is applied
          inline, enabling light/dark theme switch
        </p>
      </div>
    </div>
  );
};
