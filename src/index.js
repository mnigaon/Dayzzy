// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./firebase/AuthContext";
import { TimerProvider } from "./context/TimerContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <TimerProvider>
          <App />
        </TimerProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
