import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import "./FAQ.css";

const faqData = [
  {
    q: "What is Tasky?",
    a: "Tasky is a simple personal task manager that helps you organize your day, stay focused, and get things done without distractions."
  },
  {
    q: "Is Tasky free to use?",
    a: "Yes. Tasky is completely free to use with all core features included. No subscriptions or hidden fees."
  },
  {
    q: "Can I use Tasky with a team?",
    a: "Tasky is designed for personal productivity. It focuses on helping individuals manage their own tasks efficiently."
  },
  {
    q: "What features does Tasky provide?",
    a: "You can create tasks, organize them into workspaces, use a Kanban board, track time with a Pomodoro timer, attach files, and view simple productivity reports."
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your data is securely stored and protected using modern authentication and best security practices."
  },
  {
    q: "Does Tasky work on mobile?",
    a: "Yes. Tasky works smoothly on desktop, tablet, and mobile browsers with a fully responsive design."
  }
];


export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-section">
      <h2 className="faq-title">TASKY FAQ</h2>

      {faqData.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`faq-item ${isOpen ? "open" : ""}`}
            onClick={() => setOpenIndex(isOpen ? null : index)}
          >
            <div className="faq-question-row">
              <span className="faq-question">{item.q}</span>
              <span className="faq-icon">
                {isOpen ? <FiMinus /> : <FiPlus />}
              </span>
            </div>

            <div
              className="faq-answer-wrapper"
              style={{
                maxHeight: isOpen ? "200px" : "0px"
              }}
            >
              <div className="faq-answer">{item.a}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

