import { useState, useEffect } from "react";
import "./App.css";

import { BrokenCounter, FixedCounter } from "./components/Counter";
import { BrokenUser, FixedUser, FixedUserAlt } from "./components/UserCard";
import { BrokenEvent, FixedEvent } from "./components/EventRepair";
import { Greeting } from "./components/Greeting";
import { ThemeToggle } from "./components/ThemeToggle";
import { ImageGallery } from "./components/ImageGallery";
import { ShoppingList } from "./components/ShoppingList";
import { Accordion } from "./components/Accordion";
import { PizzaApp } from "./components/PizzaConstructor";

export default function App() {
  const [tab, setTab] = useState(() => {
    const savedTab = localStorage.getItem("activeTab");
    return savedTab ? Number(savedTab) : 1;
  });

  useEffect(() => {
    localStorage.setItem("activeTab", tab);
  }, [tab]);

  return (
    <div className="app-shell">
      <nav className="top-nav">
        {[1, 2, 3].map((t) => (
          <button
            key={t}
            className={`nav-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            Level {t}
          </button>
        ))}
      </nav>

      <div className="container">
        {tab === 1 && (
          <section>
            <h1 style={{ color: "var(--neon)" }}>Level 1: Core concepts</h1>
            <h3>1.1 State Management</h3>
            <div className="grid">
              <BrokenCounter />
              <FixedCounter />
            </div>
            <h3>1.2 Props Handling</h3>
            <div className="grid">
              <BrokenUser name="Johnny" age={19} />
              <div>
                <FixedUser name="Johnny" age={19} />
                <FixedUserAlt name="Johnny" age={19} />
              </div>
            </div>
            <h3>1.3 Event Handling</h3>
            <div className="grid">
              <BrokenEvent />
              <FixedEvent />
            </div>
          </section>
        )}

        {tab === 2 && (
          <section>
            <h1 style={{ color: "var(--neon)" }}>Level 2: Interactive UI</h1>
            <Greeting />
            <ThemeToggle />
            <ImageGallery />
          </section>
        )}

        {tab === 3 && (
          <section>
            <h1 style={{ color: "var(--neon)" }}>Level 3: State management</h1>
            <ShoppingList />
            <Accordion />
            <div className="section-spacer"></div>
            <PizzaApp />
          </section>
        )}
      </div>
    </div>
  );
}
