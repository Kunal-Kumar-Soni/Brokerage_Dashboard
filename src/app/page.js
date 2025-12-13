"use client";
import Page1 from "@/components/Page1";
import Page2 from "@/components/Page2";
import Page3 from "@/components/Page3";
import React, { useEffect, useState } from "react";

function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  const pages = [<Page1 key={1} />, <Page2 key={2} />, <Page3 key={3} />];

  useEffect(() => {
    // Browser-only
    const savedPage = parseInt(localStorage.getItem("currentPage") || "1");
    setCurrentPage(savedPage);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (currentPage !== null) {
      localStorage.setItem("currentPage", currentPage.toString());
    }
  }, [currentPage]);

  const handlePrevBtn = () => {
    setCurrentPage((prev) => (prev && prev > 1 ? prev - 1 : prev));
  };

  const handleNextBtn = () => {
    setCurrentPage((next) => (next && next < pages.length ? next + 1 : next));
  };

  if (!hydrated) return null;

  return (
    <div className="max-w-[1056px] max-h-[816px] p-8 mx-auto">
      {pages[currentPage - 1]}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevBtn}
          className="bg-blue-500 hover:bg-blue-600 shadow-md px-5 py-2 rounded-lg font-semibold text-white transition duration-200 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          onClick={handleNextBtn}
          className="bg-green-600 hover:bg-green-700 shadow-md px-5 py-2 rounded-lg font-semibold text-white transition duration-200 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === pages.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
