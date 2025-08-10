import React, { useState, useEffect, useRef } from "react"; 
import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const languages = [
  { code: "en", label: "EN" },
  { code: "ps", label: "PS" },
  { code: "fa", label: "FA" },
];

const Navbar = ({ scrollToCalculator, scrollToFatwas, scrollToContact }) => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Separate states for desktop and mobile language dropdowns
  const [langDropdownOpenDesktop, setLangDropdownOpenDesktop] = useState(false);
  const [langDropdownOpenMobile, setLangDropdownOpenMobile] = useState(false);

  // Separate refs for desktop and mobile language dropdowns
  const langDropdownRefDesktop = useRef(null);
  const langDropdownRefMobile = useRef(null);

  // Outside click handler for desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRefDesktop.current &&
        !langDropdownRefDesktop.current.contains(event.target)
      ) {
        setLangDropdownOpenDesktop(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Outside click handler for mobile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRefMobile.current &&
        !langDropdownRefMobile.current.contains(event.target)
      ) {
        setLangDropdownOpenMobile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseLinkClasses =
    "px-4 py-2 rounded-md transition-colors duration-200 font-medium";
  const activeLinkClasses = "bg-[#EDA895] text-white";

  return (
    <nav className="relative z-50 w-full bg-[#F7F7F7] text-[#333333] shadow-md flex items-center justify-between px-6 py-4 select-none">
      {/* Logo Left */}
      <div className="flex-shrink-0">
        <NavLink
          to="/"
          className="text-3xl font-extrabold hover:text-[#E8937C]"
          onClick={() => setMenuOpen(false)}
        >
          MyMirath
        </NavLink>
      </div>

      {/* Menu Center */}
      <div className="hidden md:flex flex-grow justify-center space-x-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseLinkClasses} ${
              isActive ? activeLinkClasses : "hover:text-[#E8937C]"
            }`
          }
          onClick={() => setMenuOpen(false)}
        >
          {t('home')}
        </NavLink>

        <button
          onClick={() => {
            scrollToCalculator && scrollToCalculator();
            setMenuOpen(false);
          }}
          className={`${baseLinkClasses} cursor-pointer hover:text-[#E8937C]`}
        >
          {t('calculator')}
        </button>

        <button
          onClick={() => {
            scrollToContact && scrollToContact();
            setMenuOpen(false);
          }}
          className={`${baseLinkClasses} cursor-pointer hover:text-[#E8937C]`}
        >
          {t('contactUs')}
        </button>

        <button
          onClick={() => {
            scrollToFatwas && scrollToFatwas();
            setMenuOpen(false);
          }}
          className={`${baseLinkClasses} cursor-pointer hover:text-[#E8937C]`}
        >
          {t('fatwas')}
        </button>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${baseLinkClasses} ${
              isActive ? activeLinkClasses : "hover:text-[#E8937C]"
            }`
          }
          onClick={() => setMenuOpen(false)}
        >
          {t('about')}
        </NavLink>
      </div>

      {/* Right side: Language Dropdown, GitHub, LinkedIn & Hamburger */}
      <div className="flex items-center space-x-4">
        {/* Language Dropdown Desktop */}
        <div
          className="hidden md:flex items-center space-x-3 relative"
          ref={langDropdownRefDesktop}
        >
          <button
            onClick={() => setLangDropdownOpenDesktop(!langDropdownOpenDesktop)}
            className="bg-[#EADBD3] px-3 py-1 rounded-md font-semibold text-[#333333] hover:bg-[#EDA895] hover:text-white transition"
          >
            {languages.find(l => l.code === i18n.language)?.label || "Ln"}
          </button>
          {langDropdownOpenDesktop && (
            <div className="absolute right-0 mt-2 w-28 bg-white border border-[#EADBD3] rounded shadow-lg z-50">
              {languages.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => {
                    i18n.changeLanguage(code);
                    setLangDropdownOpenDesktop(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium transition ${
                    i18n.language === code
                      ? "bg-[#EDA895] text-white"
                      : "hover:bg-[#EDA895] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {/* LinkedIn Icon */}
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

          {/* GitHub Icon */}
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

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Language Dropdown */}
          <div className="relative" ref={langDropdownRefMobile}>
            <button
              onClick={() => setLangDropdownOpenMobile(!langDropdownOpenMobile)}
              className="bg-[#EADBD3] px-3 py-1 rounded-md font-semibold text-[#333333] hover:bg-[#EDA895] hover:text-white transition"
            >
              {languages.find(l => l.code === i18n.language)?.label || "Ln"}
            </button>

            {langDropdownOpenMobile && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-[#EADBD3] rounded shadow-lg z-50">
                {languages.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => {
                      i18n.changeLanguage(code);
                      setLangDropdownOpenMobile(false);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm font-medium transition ${
                      i18n.language === code
                        ? "bg-[#EDA895] text-white"
                        : "hover:bg-[#EDA895] hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="text-[#333333] focus:outline-none"
          >
            {menuOpen ? (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#F7F7F7] border-t border-[#EADBD3] shadow-lg z-40">
          <div className="flex flex-col space-y-2 p-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md font-medium ${
                  isActive
                    ? "bg-[#EDA895] text-white"
                    : "hover:bg-[#EDA895] hover:text-white"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {t('home')}
            </NavLink>

            <button
              onClick={() => {
                scrollToCalculator && scrollToCalculator();
                setMenuOpen(false);
              }}
              className="block px-4 py-2 rounded-md font-medium hover:bg-[#EDA895] hover:text-white cursor-pointer"
            >
              {t('calculator')}
            </button>

            <button
              onClick={() => {
                scrollToContact && scrollToContact();
                setMenuOpen(false);
              }}
              className="block px-4 py-2 rounded-md font-medium hover:bg-[#EDA895] hover:text-white cursor-pointer"
            >
              {t('contactUs')}
            </button>

            <button
              onClick={() => {
                scrollToFatwas && scrollToFatwas();
                setMenuOpen(false);
              }}
              className="block px-4 py-2 rounded-md font-medium hover:bg-[#EDA895] hover:text-white cursor-pointer"
            >
              {t('fatwas')}
            </button>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md font-medium ${
                  isActive
                    ? "bg-[#EDA895] text-white"
                    : "hover:bg-[#EDA895] hover:text-white"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {t('about')}
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
