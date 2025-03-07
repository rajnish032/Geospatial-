/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";

const Accordion = ({ title, answer }) => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <div className="py-4 my-4 text-left">
      <button
        onClick={() => setAccordionOpen(!accordionOpen)}
        className="flex justify-between items-center w-full py-3 text-xl md:text-2xl font-semibold text-white transition-all duration-300 hover:text-blue-400"
      >
        <span>{title}</span>
        <svg
          className={`fill-white shrink-0 ml-4 transition-transform duration-300 ${
            accordionOpen ? "rotate-180" : ""
          }`}
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="9" width="20" height="2" rx="1" />
          <rect
            y="9"
            width="20"
            height="2"
            rx="1"
            className={`rotate-90 transition-transform duration-300 ${
              accordionOpen ? "rotate-180" : ""
            }`}
          />
        </svg>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 text-gray-300 text-md ${
          accordionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{answer}</div>
      </div>
    </div>
  );
};

export default Accordion;
