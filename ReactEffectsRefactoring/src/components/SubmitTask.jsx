import { useState } from "react";
import ComparisonCard from "./ComparisonCard";
import { snippets } from "../data/snippets";
import styles from "../styles/Demo.module.css";

function postDataToApi(data) {
  return `${data.email} joined the release alert`;
}

function SubmitTask() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email address");
      setStatus("");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address");
      setStatus("");
      return;
    }

    const data = Object.fromEntries(new FormData(event.currentTarget));
    data.email = cleanEmail;
    setError("");
    setStatus(postDataToApi(data));
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  return (
    <ComparisonCard
      number="2.1"
      title="Release alert form"
      badCode={snippets.submit.bad}
      goodCode={snippets.submit.good}
      problem="Submitting becomes a two-step side effect: update state now, send later. Another state change can accidentally repeat the request"
      solution="The user submission is the event that owns the request. Data is prepared and sent directly inside handleSubmit"
      badFlow={["Submit", "Set payload", "Render", "Effect", "Send"]}
      goodFlow={["Submit", "Build payload", "Send"]}
    >
      <form className={styles.inlineForm} onSubmit={handleSubmit} noValidate>
        <label>
          Email
          <input
            className={error ? styles.invalid : ""}
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "release-email-error" : undefined}
            placeholder="listener@example.com"
          />
          {error && (
            <span id="release-email-error" className={styles.errorMessage}>
              {error}
            </span>
          )}
        </label>
        <button type="submit">Join alert</button>
      </form>
      <p className={styles.status} role="status">
        {status || "No request sent yet"}
      </p>
    </ComparisonCard>
  );
}

export default SubmitTask;
