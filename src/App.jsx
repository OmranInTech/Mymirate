import React, { useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/Contact";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";

function App() {
  const calculatorRef = useRef(null);
  const fatwasRef = useRef(null);
  const contactRef = useRef(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language === "ps" || i18n.language === "fa") {
      document.body.dir = "rtl";
    } else {
      document.body.dir = "ltr";
    }
  }, [i18n.language]);

  const scrollToCalculator = () =>
    calculatorRef.current?.scrollIntoView({ behavior: "smooth" });

  const scrollToFatwas = () =>
    fatwasRef.current?.scrollIntoView({ behavior: "smooth" });

  const scrollToContact = () =>
    contactRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <Router>
      <Navbar
        scrollToCalculator={scrollToCalculator}
        scrollToFatwas={scrollToFatwas}
        scrollToContact={scrollToContact}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              calculatorRef={calculatorRef}
              fatwasRef={fatwasRef}
              contactRef={contactRef}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
