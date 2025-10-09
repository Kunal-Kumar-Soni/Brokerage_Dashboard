"use client";
import React, { useState, useEffect } from "react";

export default function Page1() {
  const defaultDashboard = {
    closedDeal: 69000000,
    sellSide: 67,
    dualSide: 38,
    buySide: 37,
    totalClosed: 142,
    pending: 103000000,
    active: 46000000,
    pendingSellSide: 78,
    pendingDual: 28,
    pendingBuySide: 19,
    activeTotal: 71,
    maxPrice: 1700000,
    minPrice: 100000,
    avgSoldPrice: 517000,
  };

  const defaultChart = {
    dealTypeVolume: [],
    topAgents: [
      { name: "Agent 1", value: 28, color: "#DC2626" },
      { name: "Agent 2", value: 22, color: "#FFA500" },
      { name: "Agent 3", value: 18, color: "#3B82F6" },
      { name: "Agent 4", value: 16, color: "#10B981" },
      { name: "Agent 5", value: 16, color: "#8B5CF6" },
    ],
  };

  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedDashboard = localStorage.getItem("page1:dashboardData");
      const savedChart = localStorage.getItem("page1:chartData");
      const parsedDashboard = savedDashboard ? JSON.parse(savedDashboard) : null;
      const parsedChart = savedChart ? JSON.parse(savedChart) : null;
      setDashboardData(
        parsedDashboard ? { ...defaultDashboard, ...parsedDashboard } : defaultDashboard
      );
      setChartData(parsedChart ? { ...defaultChart, ...parsedChart } : defaultChart);
    } catch (e) {
      setDashboardData(defaultDashboard);
      setChartData(defaultChart);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || !dashboardData) return;
    try {
      localStorage.setItem("page1:dashboardData", JSON.stringify(dashboardData));
    } catch (e) {}
  }, [dashboardData, hydrated]);

  useEffect(() => {
    if (!hydrated || !chartData) return;
    try {
      localStorage.setItem("page1:chartData", JSON.stringify(chartData));
    } catch (e) {}
  }, [chartData, hydrated]);

  useEffect(() => {
    if (!dashboardData) return;
    const total = dashboardData.sellSide + dashboardData.dualSide + dashboardData.buySide;
    const dealTypeVolume = [
      {
        type: "Sell Side",
        value: total > 0 ? (dashboardData.sellSide / total) * 100 : 0,
        color: "#DC2626",
      },
      {
        type: "Dual Side",
        value: total > 0 ? (dashboardData.dualSide / total) * 100 : 0,
        color: "#FFA500",
      },
      {
        type: "Buy Side",
        value: total > 0 ? (dashboardData.buySide / total) * 100 : 0,
        color: "#3B82F6",
      },
    ];
    setChartData((prev) => ({ ...(prev || defaultChart), dealTypeVolume }));
  }, [dashboardData?.sellSide, dashboardData?.dualSide, dashboardData?.buySide]);

  if (!hydrated || !dashboardData || !chartData) return null;

  const handleInputChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setDashboardData((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleCurrencyChange = (field, value) => {
    const numValue = parseFloat(value) * 1000000 || 0;
    setDashboardData((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleAgentChange = (index, value) => {
    const numValue = parseInt(value) || 0;
    setChartData((prev) => {
      const newAgents = [...prev.topAgents];
      newAgents[index] = { ...newAgents[index], value: numValue };
      return { ...prev, topAgents: newAgents };
    });
  };

  const PieChart = ({ data, size = 160 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0)
      return <div className="mx-auto border border-gray-300 rounded-full w-40 h-40"></div>;

    let currentAngle = 0;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    const createSlice = (item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const start = polarToCartesian(centerX, centerY, radius, startAngle);
      const end = polarToCartesian(centerX, centerY, radius, endAngle);
      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
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

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="bg-white">
      <h1 className="mb-6 font-sans font-bold text-2xl sm:text-3xl text-center tracking-widest">
        Brokerage Dashboard: <span className="text-red-700">Sterling Real Estate Group</span>
      </h1>

      {/* First Box */}
      <div className="mb-4 border border-gray-300 rounded-lg divide-y divide-gray-300">
        <div className="flex flex-col justify-center items-center p-4">
          <h1 className="font-bold text-sm">💰 Closed Deal</h1>
          <div className="flex items-center gap-1">
            <span className="font-bold text-2xl sm:text-3xl">$</span>
            <input
              type="number"
              value={dashboardData.closedDeal / 1000000}
              onChange={(e) => handleCurrencyChange("closedDeal", e.target.value)}
              className="px-2 border border-gray-300 rounded w-20 sm:w-22 font-bold text-2xl sm:text-3xl text-center"
              step="1"
            />
            <span className="font-bold text-2xl sm:text-3xl">M</span>
          </div>
          <p className="text-gray-500 text-xs">(100% allocated to Primary Agent)</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-300">
          {[
            { label: "🏠 # Sell Side", field: "sellSide" },
            { label: "⚖ # Dual Side", field: "dualSide" },
            { label: "🔑 # Buy Side", field: "buySide" },
            { label: "📌 Closed Deal", field: "totalClosed" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col justify-center items-center p-3">
              <h1 className="text-gray-600 text-xs">{item.label}</h1>
              <input
                type="number"
                value={dashboardData[item.field]}
                onChange={(e) => handleInputChange(item.field, e.target.value)}
                className="px-2 border border-gray-300 rounded w-16 sm:w-20 font-bold text-xl sm:text-2xl text-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Second Box */}
      <div className="mb-4 border border-gray-300 rounded-lg divide-y divide-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y md:divide-y-0 divide-gray-300">
          {[
            { label: "⏳ Pending", field: "pending" },
            { label: "📢 Active", field: "active" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col justify-center items-center p-3">
              <h1 className="text-gray-600 text-sm">{item.label}</h1>
              <div className="flex items-center gap-1">
                <span className="font-bold text-2xl sm:text-3xl">$</span>
                <input
                  type="number"
                  value={dashboardData[item.field] / 1000000}
                  onChange={(e) => handleCurrencyChange(item.field, e.target.value)}
                  className="px-2 border border-gray-300 rounded w-20 sm:w-24 font-bold text-2xl sm:text-3xl text-center"
                  step="1"
                />
                <span className="font-bold text-2xl sm:text-3xl">M</span>
              </div>
              <p className="text-gray-500 text-xs">(Primary Agent)</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y md:divide-y-0 divide-gray-300">
          <div className="grid grid-cols-3 divide-x divide-gray-300">
            {[
              { label: "🏠 Sell Side", field: "pendingSellSide" },
              { label: "⚖ Dual", field: "pendingDual" },
              { label: "🔑 Buy Side", field: "pendingBuySide" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col justify-center items-center p-3">
                <h1 className="text-gray-600 text-xs">{item.label}</h1>
                <input
                  type="number"
                  value={dashboardData[item.field]}
                  onChange={(e) => handleInputChange(item.field, e.target.value)}
                  className="px-2 border border-gray-300 rounded w-14 sm:w-16 font-bold text-xl sm:text-xl text-center"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center items-center p-3">
            <input
              type="number"
              value={dashboardData.activeTotal}
              onChange={(e) => handleInputChange("activeTotal", e.target.value)}
              className="px-2 border border-gray-300 rounded w-14 sm:w-16 font-bold text-xl sm:text-xl text-center"
            />
          </div>
        </div>
      </div>

      {/* Third Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 mb-4 border border-gray-300 rounded-lg divide-x divide-y sm:divide-y-0 divide-gray-300">
        <div className="flex flex-col justify-center items-center p-3">
          <h1 className="text-gray-600 text-sm">💎 - 📉 Range</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-xl sm:text-xl">$</span>
            <input
              type="number"
              value={dashboardData.maxPrice / 1000000}
              onChange={(e) => handleCurrencyChange("maxPrice", e.target.value)}
              className="px-1 border border-gray-300 rounded w-16 sm:w-16 font-bold text-xl sm:text-xl text-center"
              step="0.1"
            />
            <span className="font-bold text-xl sm:text-xl">M - $</span>
            <input
              type="number"
              value={dashboardData.minPrice / 1000}
              onChange={(e) =>
                setDashboardData((prev) => ({
                  ...prev,
                  minPrice: parseFloat(e.target.value) * 1000 || 0,
                }))
              }
              className="px-1 border border-gray-300 rounded w-16 sm:w-16 font-bold text-xl sm:text-xl text-center"
              step="1"
            />
            <span className="font-bold text-xl sm:text-xl">K</span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-3">
          <h1 className="text-gray-600 text-sm">📈 Avg. Sold Price</h1>
          <div className="flex items-center gap-1">
            <span className="font-bold text-xl sm:text-xl">$</span>
            <input
              type="number"
              value={dashboardData.avgSoldPrice / 1000}
              onChange={(e) =>
                setDashboardData((prev) => ({
                  ...prev,
                  avgSoldPrice: parseFloat(e.target.value) * 1000 || 0,
                }))
              }
              className="px-1 border border-gray-300 rounded w-20 sm:w-20 font-bold text-2xl sm:text-2xl text-center"
              step="1"
            />
            <span className="font-bold text-2xl sm:text-2xl">K</span>
          </div>
        </div>
      </div>

      {/* Fourth Box */}
      <div className="p-4 border border-gray-300 rounded-lg">
        <div className="pb-4">
          <h1 className="mb-4 font-bold text-xl text-center">Total Closed Deals Analysis</h1>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            {/* Chart 1 */}
            <div className="p-4">
              <h1 className="mb-4 font-semibold text-sm text-center">Volume($) by Deal Type</h1>
              <PieChart data={chartData.dealTypeVolume} />
              <div className="flex flex-col gap-2 mt-4">
                {chartData.dealTypeVolume.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="rounded-full w-3 h-3"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span>{item.type}</span>
                    </div>
                    <span className="font-semibold">{item.value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2 */}
            <div className="p-4">
              <h1 className="mb-4 font-semibold text-sm text-center">Top Agents by Volume($)</h1>
              <PieChart data={chartData.topAgents} />
              <div className="flex flex-col gap-2 mt-4">
                {chartData.topAgents.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="rounded-full w-3 h-3"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          setChartData((prev) => {
                            const newAgents = [...prev.topAgents];
                            newAgents[index] = {
                              ...newAgents[index],
                              name: e.target.value,
                            };
                            return { ...prev, topAgents: newAgents };
                          });
                        }}
                        className="px-1 border border-gray-300 rounded w-20 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => handleAgentChange(index, e.target.value)}
                        className="px-1 border border-gray-300 rounded w-12 font-semibold text-xs text-right"
                      />
                      <span className="font-semibold">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-lg">
            # Closed Deals <span className="font-bold text-lg">{dashboardData.totalClosed}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
