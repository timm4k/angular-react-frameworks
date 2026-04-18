export const BrokenEvent = () => (
  <div className="card red">
    <span className="tag" style={{ color: "var(--error)" }}></span>
    {}
    <button onClick={null}>Click here</button>
    <div className="code-box">
      <p style={{ color: "var(--error)" }}>// ERROR: Direct call</p>
      <code>{"onClick={alert('Vocal percussion...')}"}</code>
      <p>
        Function executes <strong>immediately</strong> during render. Button
        gets result (undefined), so clicking it later does nothing
      </p>
    </div>
  </div>
);

export const FixedEvent = () => (
  <div className="card green">
    <span className="tag" style={{ color: "var(--success)" }}></span>
    <button
      onClick={() =>
        alert("Vocal percussion on a whole 'notha level coming from my mind")
      }
    >
      Click here
    </button>
    <div className="code-box">
      <p style={{ color: "var(--success)" }}>// FIX: Arrow function</p>
      <code>{"onClick={() => alert('Vocal percussion...')}"}</code>
      <p>
        We pass <strong>callback</strong> (function reference). React only
        triggers alert when user actually performs click
      </p>
    </div>
  </div>
);
