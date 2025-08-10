import React from "react";
import { useTranslation } from "react-i18next";
import m1 from "../assets/images/m1.png";
import { useNavigate, useLocation } from "react-router-dom";

const Hero = ({ scrollToCalculator }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCalculatorClick = () => {
    if (location.pathname !== "/") {
      // Go to home and trigger scroll after mount
      sessionStorage.setItem("scrollTo", "calculator");
      navigate("/");
    } else {
      scrollToCalculator?.();
    }
  };

  return (
    <section className="relative min-h-[75vh] md:min-h-[90vh] bg-[#fdf4f0] flex flex-col md:flex-row items-center md:items-stretch gap-8 px-4 sm:px-6 md:px-10 py-8 sm:py-12 overflow-hidden">
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-0 sm:px-6 md:px-20 z-10 animate-fadeIn text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#2e2e2e] leading-tight mb-4 sm:mb-6">
          {t('welcomeTo')} <span className="text-[#ffb195]">MyMirath</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8">
          {t('heroSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center md:items-start">
          <button
            onClick={() => navigate("/about")}
            className="bg-[#2e2e2e] text-white hover:bg-[#1f1e1e] py-2 px-6 rounded-full shadow-md transition"
          >
            {t('aboutUs')}
          </button>
          <button
            onClick={handleCalculatorClick}
            className="bg-[#ffb195] text-[#2e2e2e] hover:bg-[#f7a887] py-2 px-6 rounded-full shadow-md transition"
          >
            {t('goToCalculator')}
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-full relative flex items-center justify-center">
        <div className="hidden md:block absolute inset-0 bg-[#cc9e85]/60 z-10" />
        <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-[400px] md:h-[400px] rounded-full overflow-hidden shadow-lg z-20 border-4 border-[#ffb195]">
          <img
            src={m1}
            alt="Islamic Inheritance Illustration"
            className="w-full h-full object-cover scale-110"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
