import React from "react";

const About = () => {
  return (
    <>
      <main className="min-h-screen bg-[#FAFAFA] py-12 px-6 md:px-20 flex justify-center">
        <div
          className="
            max-w-3xl 
            bg-[#FFFFFF] 
            border border-[#E8BCA8] 
            rounded-xl 
            shadow-md 
            p-10
            transition-all 
            duration-300 
            hover:shadow-lg 
            animate-fade-in
          "
        >
          <h1 className="text-4xl font-bold text-center mb-6 text-[#DC9B83] tracking-wide">
            About <span className="text-[#E8BCA8]">MyMirath</span>
          </h1>

          <p className="text-lg text-[#4A4A4A] mb-8 leading-relaxed text-center">
            <strong>MyMirath</strong> is an Islamic inheritance calculator designed to help Muslims accurately divide assets based on Quranic principles and Fiqh.
          </p>

          <section className="mb-8 animate-slide-up">
            <h2 className="text-2xl font-semibold text-[#DC9B83] mb-3"> Our Mission</h2>
            <p className="text-[#4A4A4A] leading-relaxed">
              Many Muslims face difficulty when trying to apply inheritance laws correctly. This app simplifies the process while ensuring alignment with Islamic jurisprudence.
            </p>
          </section>

          <section className="mb-8 animate-slide-up delay-100">
            <h2 className="text-2xl font-semibold text-[#DC9B83] mb-3"> Features</h2>
            <ul className="list-disc pl-6 text-[#4A4A4A] space-y-2">
              <li>Easy-to-use mirath calculator</li>
              <li>Supports common and special family cases</li>
              <li>Fast, accurate, and based on Islamic rules</li>
            </ul>
          </section>

          <section className="animate-slide-up delay-200">
            <h2 className="text-2xl font-semibold text-[#DC9B83] mb-3"> About the Developer</h2>
            <p className="text-[#4A4A4A] leading-relaxed">
              Created by <strong>Omran Ahmadzai</strong>, a dedicated software engineer. MyMirath is part of his mission to build meaningful tools that benefit the Ummah.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default About;
