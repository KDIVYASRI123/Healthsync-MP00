import React from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AppWrapper } from "./App"; // Use AppWrapper which includes Router

const root = createRoot(document.getElementById("root"));
root.render(
  <I18nextProvider i18n={i18n}>
    <AppWrapper />
  </I18nextProvider>
);
