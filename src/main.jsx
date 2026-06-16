import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import GlobalState from "./context/GlobalState";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GlobalState>
          <App />
        </GlobalState>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
