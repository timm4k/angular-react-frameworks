import { useState } from "react";

export const BrokenCounter = () => {
  let count = 0;
  const handleClick = () => {
    count++;
    console.log(count);
  };

  return (
    <div className="card red">
      <span className="tag" style={{ color: "var(--error)" }}></span>
      <button onClick={handleClick}>Clicks: {count}</button>
      <div className="code-box">
        <p style={{ color: "var(--error)" }}>// ERROR: Regular variable</p>
        <code>let count = 0;</code>
        <p>
          Variable updates in memory, but react never triggers re-render to
          update UI
        </p>
      </div>
    </div>
  );
};

export const FixedCounter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="card green">
      <span className="tag" style={{ color: "var(--success)" }}></span>
      <button onClick={() => setCount(count + 1)}>Clicks: {count}</button>
      <div className="code-box">
        <p style={{ color: "var(--success)" }}>// FIX: useState hook</p>
        <code>const [count, setCount] = useState(0);</code>
        <p>
          setCount notifies react that state changed, forcing UI update with new
          value
        </p>
      </div>
    </div>
  );
};
