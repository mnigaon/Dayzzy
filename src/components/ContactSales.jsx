import { useRef } from "react";
import emailjs from "emailjs-com";
import "./ContactSales.css";

export default function ContactSales() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_tga0uyi",
      "template_lhkjqsa",
      form.current,
      "fl41_kqu9IEPE1TlJ"
    ).then(
      () => {
        alert("Message sent successfully 🚀");
        form.current.reset();
      },
      (error) => {
        alert("Failed to send message 😢");
        console.error(error);
      }
    );
  };

  return (
    <section className="contact-sales">
      <h1>Get in Touch</h1>
      <p>Have feedback, questions, or feature requests?
      We’d love to hear from you.</p>

      <form ref={form} onSubmit={sendEmail} className="contact-form">
        <input type="text" name="user_name" placeholder="Your Name" required />
        <input type="email" name="user_email" placeholder="Your Email" required />
        <input type="text" name="subject" placeholder="Subject (optional)" />
        <textarea name="message" placeholder="Write your message..." required />

        <button type="submit">Send Message</button>
      </form>
    </section>
  );
}
