import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import PublicSignPage from "./pages/PublicSignPage.jsx";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/sign/:token"
          element={<PublicSignPage />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);