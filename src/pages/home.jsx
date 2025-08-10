import React, { useEffect } from "react";
import Hero from "../components/Hero";
import HeirFormSection1 from "../components/HeirFormSection1";
import Fatwas from "../components/FatwasSection";
import Contact from "./Contact";
import Footer from "../components/Footer";

const Home = ({ calculatorRef, fatwasRef, contactRef }) => {
  useEffect(() => {
    const scrollTo = sessionStorage.getItem("scrollTo");
    if (scrollTo === "calculator" && calculatorRef?.current) {
      calculatorRef.current.scrollIntoView({ behavior: "smooth" });
      sessionStorage.removeItem("scrollTo");
    }
  }, [calculatorRef]);

  return (
    <>
      <Hero scrollToCalculator={() => calculatorRef.current?.scrollIntoView({ behavior: "smooth" })} />
      <main className="px-3 sm:px-4 space-y-8 sm:space-y-10">
        <section ref={calculatorRef} className="min-h-screen bg-[#FAFAFA] pt-6 sm:pt-8">
          <HeirFormSection1 />
        </section>
        <section ref={fatwasRef} className="bg-[#FAFAFA] pt-4 sm:pt-6">
          <Fatwas />
        </section>
        <section ref={contactRef} className="bg-[#FAFAFA] pb-16 sm:pb-10">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
