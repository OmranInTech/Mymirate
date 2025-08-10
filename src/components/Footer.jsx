import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 150;
      setVisible(scrollPosition >= threshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { t } = useTranslation();
  return (
    <footer
      className={`
        fixed bottom-0 left-0 w-full bg-[#E8BCA8] text-[#4A4A4A]
        py-3 sm:py-4 px-4 sm:px-6 flex flex-col sm:flex-row gap-2 sm:gap-0
        sm:justify-between sm:items-center
        transition-opacity duration-700
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <div className="text-sm font-semibold">
        &copy; {new Date().getFullYear()} {t('appName')}. {t('allRightsReserved')}
      </div>
      <div className="flex space-x-4 sm:space-x-6">
        <a
          href="https://www.linkedin.com/in/omran-ahmadzai-68a5b6351"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-[#4A4A4A] hover:text-[#75B640] transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.983 3.5C4.983 5 3.89 6.2 2.345 6.2c-1.54 0-2.634-1.2-2.634-2.7 0-1.5 1.095-2.7 2.635-2.7 1.544 0 2.635 1.2 2.635 2.7zM.5 8.5h4.963V24H.5V8.5zm7.8 0h4.76v2.13h.07c.66-1.25 2.275-2.57 4.69-2.57 5.01 0 5.93 3.3 5.93 7.6V24h-4.964v-7.5c0-1.8-.03-4.12-2.52-4.12-2.53 0-2.92 1.98-2.92 4.02V24H8.3V8.5z" />
          </svg>
        </a>

        <a
          href="https://github.com/OmranInTech"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-[#4A4A4A] hover:text-[#75B640] transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.372 0 0 5.372 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.204.085 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.3-5.466-1.335-5.466-5.933 0-1.31.47-2.38 1.236-3.22-.124-.303-.536-1.523.116-3.176 0 0 1.008-.322 3.3 1.23a11.497 11.497 0 013.003-.404c1.02.004 2.045.138 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.63-5.475 5.925.432.373.816 1.105.816 2.228 0 1.607-.015 2.9-.015 3.293 0 .32.19.694.8.576C20.565 21.796 24 17.297 24 12c0-6.628-5.372-12-12-12z" />
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
