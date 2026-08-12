import { useEffect, useRef, useState } from "react";
import styles from "../styles/Task.module.css";

const newMessages = [
  "Tom Keifer: Nobody\u2019s Fool is ready for the listening booth",
  "Eric Brittingham: Keep the Night Songs pressing behind the counter",
  "Jeff LaBar: The guitar channel is ready for playback",
  "Fred Coury: The drum count-in is set",
];

function MessageFeed() {
  const [messages, setMessages] = useState([
    "Tom Keifer: Vocal and guitar notes are ready",
    "Eric Brittingham: Bass check is complete",
    "Jeff LaBar: Nobody\u2019s Fool is queued",
  ]);
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = () => {
    setMessages((current) => [
      ...current,
      newMessages[(current.length - 3) % newMessages.length],
    ]);
  };

  return (
    <article className={styles.card}>
      <span className={styles.number}>3.1</span>
      <p className={styles.eyebrow}>Staff frequency</p>
      <h3>Store message feed</h3>
      <div className={styles.messages} aria-live="polite">
        {messages.map((message, index) => (
          <p key={`${message}-${index}`}>{message}</p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <button onClick={addMessage}>Add store message</button>
    </article>
  );
}

export default MessageFeed;
