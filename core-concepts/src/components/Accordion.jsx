import { useState } from "react";

const AccordionItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="card"
      style={{
        padding: "15px",
        marginBottom: "10px",
        cursor: "pointer",
        borderColor: isOpen ? "var(--neon)" : "var(--border)",
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <span>{q}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: "15px",
            color: "var(--neon)",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
};

export const Accordion = () => {
  const faq = [
    {
      id: 1,
      q: "What is react?",
      a: "JavaScript library for building fast and interactive user interfaces using reusable components",
    },
    {
      id: 2,
      q: "What is state?",
      a: "It's a built-in object that stores data which can change over time and affects how component renders",
    },
    {
      id: 3,
      q: "What is lifting state up?",
      a: "Process of moving state to the closest common parent so multiple components can share and synchronize data",
    },
  ];

  return (
    <section>
      <span className="tag">3.2 Smart accordion</span>
      {faq.map((item) => (
        <AccordionItem key={item.id} q={item.q} a={item.a} />
      ))}
    </section>
  );
};
