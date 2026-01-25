import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import "./FAQ.css";

const faqData = [
  {
    q: "What is Tasky?",
    a: "Tasky is a simple and powerful task management tool designed to help individuals and teams stay organized, focused, and productive."
  },
  {
    q: "Is Tasky free to use?",
    a: "Yes. Tasky offers a free plan with core features. You can upgrade anytime to access advanced tools for teams and collaboration."
  },
  {
    q: "Can I use Tasky with my team?",
    a: "Absolutely. Tasky is built for both solo users and teams. You can invite members, assign tasks, and track progress together."
  },
  {
    q: "Does Tasky work on mobile devices?",
    a: "Yes. Tasky works on all modern browsers and is fully responsive on mobile, tablet, and desktop."
  },
  {
    q: "How secure is my data on Tasky?",
    a: "Your data is encrypted and stored securely. We take privacy seriously and follow industry best practices to protect your information."
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

