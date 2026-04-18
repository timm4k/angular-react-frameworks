export const BrokenUser = (name, age) => {
  const propsAsText =
    typeof name === "object" ? JSON.stringify(name) : String(name);

  return (
    <div className="card red">
      <span className="tag" style={{ color: "var(--error)" }}></span>

      <div style={{ fontSize: "18px", margin: "10px 0" }}>
        Name: {propsAsText}, Age: {String(age)}
      </div>

      <div className="code-box">
        <p style={{ color: "var(--error)" }}>
          // ERROR: Passing the entire object to JSX
        </p>
        <code>function UserCard(name, age)</code>
        <p>
          React passed all props into first argument. So <strong>name</strong>{" "}
          is actually object: <code>{propsAsText}</code> and{" "}
          <strong>age</strong> <code>undefined</code>
        </p>
      </div>
    </div>
  );
};

export const FixedUser = ({ name, age }) => (
  <div className="card green">
    <span className="tag" style={{ color: "var(--success)" }}>
      Destructuring
    </span>
    <div style={{ fontSize: "18px", margin: "10px 0" }}>
      Name: {name}, Age: {age}
    </div>
    <div className="code-box">
      <p style={{ color: "var(--success)" }}>// FIX: Unpacking properties</p>
      <code>{"function UserCard({ name, age })"}</code>
      <p>
        By using curly braces, we pull specific strings out of object so react
        can render them
      </p>
    </div>
  </div>
);

export const FixedUserAlt = (props) => (
  <div className="card green" style={{ marginTop: "10px" }}>
    <span className="tag" style={{ color: "var(--success)" }}>
      Props Object
    </span>
    <div style={{ fontSize: "18px", margin: "10px 0" }}>
      Name: {props.name}, Age: {props.age}
    </div>
    <div className="code-box">
      <p style={{ color: "var(--success)" }}>// FIX: Using props object</p>
      <code>{"function UserCard(props) { ... props.name }"}</code>
      <p>
        We accept full object as "props" and then point to exact keys we need
      </p>
    </div>
  </div>
);
