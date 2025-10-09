"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

function Page2() {
  /* ===== 🧠 Centralized Dashboard State ===== */
  const defaultDashboard = {
    agentsAndOffices: {
      totalAgents: 32,
      activeAgents: 32,
      inactiveAgents: 0,
      offices: 1,
    },
    ratioAndMarketDays: {
      soldListAllSides: 5.6,
      soldListBuySide: 4.9,
      soldListSellSide: 6,
      avgDaysAllSides: 175,
      avgDaysBuySide: 134,
      avgDaysSellSide: 200,
    },
    totalRevenue: {
      estimatedRevenue: 213,
      propertySoldMonthRate: 18,
      propertySoldWeekRate: 4,
      propertySoldPerDay: 1,
      dealsPerAgent: 5,
    },
  };

  const [dashboardData, setDashboardData] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("page2:dashboardData");
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...defaultDashboard };
        Object.keys(defaultDashboard).forEach((section) => {
          const defSection = defaultDashboard[section] || {};
          const parsedSection = (parsed && parsed[section]) || {};
          merged[section] = { ...defSection };
          Object.keys(defSection).forEach((k) => {
            const v = parsedSection[k] ?? defSection[k];
            merged[section][k] = typeof v === "string" && v !== "" ? Number(v) : v;
          });
        });
        setDashboardData(merged);
        setHydrated(true);
        return;
      }
      setDashboardData(defaultDashboard);
      setHydrated(true);
    } catch (e) {}
  }, []);

  // Persist changes
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("page2:dashboardData", JSON.stringify(dashboardData));
    } catch (e) {}
  }, [dashboardData, hydrated]);

  if (!hydrated || !dashboardData) return null;

  /* =====  Universal Update Function ===== */
  const handleChange = (section, field, value) => {
    setDashboardData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  /* =====  Helper Render Function ===== */
  const renderInputs = (sectionName, sectionData, inputWidth = "w-24") => (
    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-300">
      {Object.entries(sectionData).map(([key, value]) => (
        <div key={key} className="flex flex-col justify-center items-center p-4">
          <h1 className="text-gray-600 text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</h1>
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(sectionName, key, e.target.value)}
            className={`mt-2 px-2 py-1 border border-gray-300 rounded ${inputWidth} font-bold text-2xl text-center`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg">
      {/* ===== Title ===== */}
      <h1 className="mb-8 font-sans font-bold text-3xl text-center tracking-widest">
        Brokerage Dashboard: <span className="text-red-700">Sterling Real Estate Group</span>
      </h1>

      {/* First Box */}
      <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex justify-center items-center p-4 border-b border-b-gray-300">
          <h1 className="font-bold text-lg">Agents & Offices</h1>
        </div>
        {renderInputs("agentsAndOffices", dashboardData.agentsAndOffices)}
      </div>

      {/* Second Box */}
      <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-gray-300 text-center">
          <h1 className="p-4 font-bold text-lg">Sold to List Price Ratio Change (%)</h1>
          <h1 className="p-4 font-bold text-lg">Avg. # of Days on Market (List to Close)</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 border-gray-300 border-t divide-x divide-gray-300">
          {Object.entries(dashboardData.ratioAndMarketDays).map(([key, value]) => (
            <div key={key} className="flex flex-col justify-center items-center p-4 text-center">
              <h1 className="text-gray-600 text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</h1>
              <input
                type="number"
                value={value}
                onChange={(e) => handleChange("ratioAndMarketDays", key, e.target.value)}
                className="mt-2 px-2 py-1 border border-gray-300 rounded w-20 font-bold text-2xl text-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Third Box */}
      <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex flex-col justify-center items-center p-4 border-b border-b-gray-300">
          <h1 className="font-bold text-lg">Estimated Total Org. Revenue</h1>
          <p className="text-gray-600 text-sm">(8% overhead + 20% Brokerage Share)</p>
          <div className="flex justify-center items-center gap-2">
            <span className="font-bold text-2xl">$</span>
            <input
              type="number"
              value={dashboardData.totalRevenue.estimatedRevenue}
              onChange={(e) => handleChange("totalRevenue", "estimatedRevenue", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-28 font-bold text-2xl text-center"
            />
            <span className="font-bold text-2xl">K</span>
          </div>
        </div>

        {renderInputs(
          "totalRevenue",
          Object.fromEntries(
            Object.entries(dashboardData.totalRevenue).filter(([key]) => key !== "estimatedRevenue")
          )
        )}
      </div>

      {/* Fourth Box */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="p-4 text-center">
          <h1 className="font-bold">Market Rank (TTM*)</h1>
          <h1 className="font-bold">(Your Company&rsquo;s Rank: 1)</h1>
          <div className="relative rounded-2xl w-full h-[200px] sm:h-[300px] lg:h-[400px] overflow-hidden">
            <Image
              src="/icon.png"
              alt="App Icon"
              fill
              className="rounded-lg object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page2;
