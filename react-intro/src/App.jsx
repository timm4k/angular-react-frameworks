import React, { useState } from "react";
import "./styles/App.css";

import SwedenFunc from "./components/SwedenFunc";
import SwedenClass from "./components/SwedenClass";
import AuthorFunc from "./components/AuthorFunc";
import BookClass from "./components/BookClass";

function App() {
  const [activeTab, setActiveTab] = useState("sweden");

  return (
    <div className="container">
      <div className="tabs">
        <button onClick={() => setActiveTab("sweden")}>Sweden</button>
        <button onClick={() => setActiveTab("book")}>Book</button>
      </div>

      {activeTab === "sweden" && (
        <>
          <SwedenFunc />
          <SwedenClass />
        </>
      )}

      {activeTab === "book" && (
        <div className="book-row">
          <AuthorFunc />
          <BookClass />
        </div>
      )}
    </div>
  );
}

export default App;
