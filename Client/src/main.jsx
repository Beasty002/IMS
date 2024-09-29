import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./customHooks/useAuth.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Router>
      <StrictMode>
        <App />
      </StrictMode>
    </Router>
  </AuthProvider>
);
