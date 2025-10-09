"use client";
import React, { useState, useEffect } from "react";

export default function Page3() {
  const defaultData = {
    avgListingPrice: 379,
    activeAgents: 2504,
    closed: 6573,
    pending: 3215,
    active: 3606,
    priceMedian: 138,
    avgDaysPendingToClosed: 71,
    grossIncome: 245,
    multiAgentSeller: 14,
    multiAgentBuyer: 6,
    dualBuyerSeller: 14,
    singleAgentSeller: 86,
    singleAgentBuyer: 94,
  };

  const [data, setData] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("page3:data");
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...defaultData };
        Object.keys(defaultData).forEach((k) => {
          const v = parsed && parsed[k] !== undefined ? parsed[k] : defaultData[k];
          merged[k] = typeof v === "string" && v !== "" ? Number(v) : v;
        });
        setData(merged);
        setHydrated(true);
        return;
      }
      setData(defaultData);
      setHydrated(true);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("page3:data", JSON.stringify(data));
    } catch (e) {}
  }, [data, hydrated]);

  if (!hydrated || !data) return null;

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const DonutChart = ({ data, size = 280 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0)
      return (
        <div
          className="mx-auto border border-gray-300 rounded-full"
          style={{ width: size, height: size }}
        ></div>
      );

    let currentAngle = 0;
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size / 2 - 10;
    const innerRadius = size / 2 - 50;

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = (angleInDegrees * Math.PI) / 180;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };

    const createSlice = (item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const outerStart = polarToCartesian(centerX, centerY, outerRadius, startAngle);
      const outerEnd = polarToCartesian(centerX, centerY, outerRadius, endAngle);
      const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle);
      const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);
      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
        "Z",
      ].join(" ");

      currentAngle = endAngle;
      return <path key={index} d={pathData} fill={item.color} stroke="white" strokeWidth="2" />;
    };

    return (
      <svg width={size} height={size} className="mx-auto">
        {data.map((item, index) => createSlice(item, index))}
      </svg>
    );
  };

  const chartData = [
    { label: "Multiple-Agent Deal (Seller)", value: data.multiAgentSeller, color: "#DC2626" },
    { label: "Multiple-Agent Deal (Buyer)", value: data.multiAgentBuyer, color: "#FFA500" },
    { label: "Duel (Buyer, Seller)", value: data.dualBuyerSeller, color: "#10B981" },
    { label: "Single Agent Deal (Seller)", value: data.singleAgentSeller, color: "#3B82F6" },
    { label: "Single Agent Deal (Buyer)", value: data.singleAgentBuyer, color: "#8B5CF6" },
  ];

  return (
    <div className="bg-white rounded-lg">
      <h1 className="mb-8 font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-center tracking-widest">
        Market Analytics
      </h1>

      {/* First Box */}
      <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-y sm:divide-y-0 divide-gray-300 text-center">
          <div className="flex flex-col p-4">
            <h1 className="font-semibold text-base sm:text-lg">Average Listing Price</h1>
            <h1>Per Sqft.</h1>
            <div>
              <span className="font-bold text-xl sm:text-2xl">$</span>
              <input
                type="number"
                value={data.avgListingPrice}
                onChange={(e) => handleChange("avgListingPrice", e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded w-24 sm:w-32 font-bold text-xl sm:text-2xl text-center"
              />
            </div>
          </div>
          <div className="flex flex-col p-4">
            <h1 className="font-semibold text-base sm:text-lg"># Active Agents</h1>
            <h1>(Done At least 1 Deal)</h1>
            <div>
              <input
                type="number"
                value={data.activeAgents}
                onChange={(e) => handleChange("activeAgents", e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded w-24 sm:w-32 font-bold text-xl sm:text-2xl text-center"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-gray-300 border-t">
          {[
            { label: "📌 # Closed", key: "closed" },
            { label: "⏳ # Pending", key: "pending" },
            { label: "📢 # Active", key: "active" },
            { label: "Property Price Market Median", key: "priceMedian", prefix: "$", suffix: "K" },
            { label: "Avg. Days From Pending To Closed", key: "avgDaysPendingToClosed" },
            { label: "Gross Income (Commission)", key: "grossIncome" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center p-4 border-gray-300 sm:border-r sm:last:border-r-0 border-b sm:border-b-0 last:border-b-0 text-sm sm:text-base text-center"
            >
              <h1 className="text-gray-600">{item.label}</h1>
              <div className="flex justify-center items-center mt-2">
                {item.prefix && (
                  <span className="font-bold text-lg sm:text-2xl">{item.prefix}</span>
                )}
                <input
                  type="number"
                  value={data[item.key]}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded w-20 sm:w-24 font-bold text-lg sm:text-2xl text-center"
                />
                {item.suffix && (
                  <span className="font-bold text-lg sm:text-2xl">{item.suffix}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Box */}
      <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 sm:divide-x divide-y sm:divide-y-0 divide-gray-300">
          {[
            { label1: "Multiple-Agent Deal", label2: "(Seller)", key: "multiAgentSeller" },
            { label1: "Multiple-Agent Deal", label2: "(Buyer)", key: "multiAgentBuyer" },
            { label1: "Duel", label2: "(Buyer, Seller)", key: "dualBuyerSeller" },
            { label1: "Single-Agent Deal", label2: "(Seller)", key: "singleAgentSeller" },
            { label1: "Single-Agent Deal", label2: "(Buyer)", key: "singleAgentBuyer" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col justify-center items-center p-4 text-sm sm:text-base text-center"
            >
              <h1 className="text-gray-600">{item.label1}</h1>
              <h1 className="text-gray-600">{item.label2}</h1>
              <input
                type="number"
                value={data[item.key]}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="mt-2 px-2 py-1 border border-gray-300 rounded w-20 sm:w-24 font-bold text-lg sm:text-2xl text-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Third Box */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="p-4 text-center">
          <h1 className="font-bold text-xl sm:text-2xl">Distribution of Property Listing Status</h1>
        </div>

        <div className="flex flex-col items-center p-4 sm:p-8">
          <DonutChart data={chartData} size={240} />
          <div className="flex flex-col gap-3 mt-6 w-full max-w-md">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-xs sm:text-sm md:text-base"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-full w-3 sm:w-4 h-3 sm:h-4"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.label}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
