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

  // Load persisted state from localStorage
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
      // no saved data, use defaults
      setData(defaultData);
      setHydrated(true);
    } catch (e) {}
  }, []);

  // Persist data on change
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
      <h1 className="mb-8 font-sans font-bold text-3xl text-center tracking-widest">
        Market Analytics
      </h1>

      {/* First Box */}
      <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-gray-300 text-center">
          <div className="flex flex-col p-4">
            <h1 className="font-semibold text-lg">Average Listing Price</h1>
            <h1>Per Sqft.</h1>
            <div>
              <span className="font-bold text-2xl">$</span>
              <input
                type="number"
                value={data.avgListingPrice}
                onChange={(e) => handleChange("avgListingPrice", e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
              />
            </div>
          </div>
          <div className="flex flex-col p-4">
            <h1 className="font-semibold text-lg"># Active Agents</h1>
            <h1>(Done At least 1 Deal)</h1>
            <div>
              <input
                type="number"
                value={data.activeAgents}
                onChange={(e) => handleChange("activeAgents", e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 border-gray-300 border-t divide-x divide-gray-300">
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">📌 # Closed</h1>
            <input
              type="number"
              value={data.closed}
              onChange={(e) => handleChange("closed", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
            />
          </div>
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">⏳ # Pending</h1>
            <input
              type="number"
              value={data.pending}
              onChange={(e) => handleChange("pending", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
            />
          </div>
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">📢 # Active</h1>
            <input
              type="number"
              value={data.active}
              onChange={(e) => handleChange("active", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
            />
          </div>
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">Property Price Market Median</h1>
            <div>
              <span className="font-bold text-2xl">$</span>
              <input
                type="number"
                value={data.priceMedian}
                onChange={(e) => handleChange("priceMedian", e.target.value)}
                className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
              />
              <span className="font-bold text-2xl">K</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">Avg. Days From Pending To Closed</h1>
            <input
              type="number"
              value={data.avgDaysPendingToClosed}
              onChange={(e) => handleChange("avgDaysPendingToClosed", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
            />
          </div>
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">Gross Income (Commission)</h1>
            <input
              type="number"
              value={data.grossIncome}
              onChange={(e) => handleChange("grossIncome", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
            />
          </div>
        </div>
      </div>

      {/* Second Box */}
      <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 divide-x divide-gray-300">
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">Multiple-Agent Deal</h1>
            <h1 className="text-gray-600 text-sm">(Seller)</h1>
            <input
              type="number"
              value={data.multiAgentSeller}
              onChange={(e) => handleChange("multiAgentSeller", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
            />
          </div>
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">Multiple-Agent Deal</h1>
            <h1 className="text-gray-600 text-sm">(Buyer)</h1>
            <input
              type="number"
              value={data.multiAgentBuyer}
              onChange={(e) => handleChange("multiAgentBuyer", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
            />
          </div>
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">Duel</h1>
            <h1 className="text-gray-600 text-sm">(Buyer, Seller)</h1>
            <input
              type="number"
              value={data.dualBuyerSeller}
              onChange={(e) => handleChange("dualBuyerSeller", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
            />
          </div>
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">Single-Agent Deal</h1>
            <h1 className="text-gray-600 text-sm">(Seller)</h1>
            <input
              type="number"
              value={data.singleAgentSeller}
              onChange={(e) => handleChange("singleAgentSeller", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
            />
          </div>
          <div className="flex flex-col justify-center items-center p-4 text-center">
            <h1 className="text-gray-600 text-sm">Single-Agent Deal</h1>
            <h1 className="text-gray-600 text-sm">(Buyer)</h1>
            <input
              type="number"
              value={data.singleAgentBuyer}
              onChange={(e) => handleChange("singleAgentBuyer", e.target.value)}
              className="mt-2 px-2 py-1 border border-gray-300 rounded w-25 font-bold text-2xl text-center"
            />
          </div>
        </div>
      </div>

      {/* Third Box */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="p-4 text-center">
          <h1 className="font-bold text-2xl">Distribution of Property Listing Status</h1>
        </div>

        <div className="p-8">
          <DonutChart data={chartData} size={280} />
          <div className="flex flex-col gap-3 mx-auto mt-8 max-w-md">
            {chartData.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-full w-4 h-4"
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
