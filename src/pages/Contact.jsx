import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  return (
    <>
      {/* Assuming you will pass scroll functions from a parent if needed */}
  

      <main className="min-h-screen bg-[#FAFAFA] py-12 px-6 flex justify-center items-start">
        <div className="max-w-3xl w-full bg-[#FFFFFF] border border-[#E8BCA8] rounded-xl shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-[#DC9B83] mb-6 text-center">
            {t('contactUs')}
          </h1>
          <p className="mb-10 text-center text-[#9A9A9A] text-lg">
            {t('contactSubtitle')}
          </p>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (submitting) return;
              setSubmitting(true);
              alert(t('contactSubmittedThanks'));
              setSubmitting(false);
            }}
          >
            <div>
              <label
                htmlFor="name"
                className="block mb-2 font-semibold text-[#4A4A4A]"
              >
                {t('name')}
              </label>
              <input
                type="text"
                id="name"
                placeholder={t('yourName')}
                className="w-full px-5 py-3 border border-[#E8BCA8] rounded-lg text-[#4A4A4A] placeholder-[#9A9A9A] focus:outline-none focus:ring-3 focus:ring-[#DC9B83] transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-semibold text-[#4A4A4A]"
              >
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                placeholder={t('yourEmail')}
                className="w-full px-5 py-3 border border-[#E8BCA8] rounded-lg text-[#4A4A4A] placeholder-[#9A9A9A] focus:outline-none focus:ring-3 focus:ring-[#DC9B83] transition"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block mb-2 font-semibold text-[#4A4A4A]"
              >
                {t('message')}
              </label>
              <textarea
                id="message"
                rows="6"
                placeholder={t('yourMessage')}
                className="w-full px-5 py-3 border border-[#E8BCA8] rounded-lg text-[#4A4A4A] placeholder-[#9A9A9A] focus:outline-none focus:ring-3 focus:ring-[#DC9B83] resize-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E3A48E] text-[#000000] font-bold py-3 rounded-lg hover:bg-[#DB8D73] transition-shadow shadow-md hover:shadow-lg disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? t('sending') : t('sendMessage')}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Contact;
