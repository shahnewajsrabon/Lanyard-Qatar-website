/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { TrendingUp, TrendingDown, Package, Coins, CheckCircle, Truck, Layers, Eye, RefreshCw } from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    tasks,
    inventory,
    orders,
    deliveries,
    systemLogs,
    activeRole
  } = useWorkspace();

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Derive dynamic metrics
  const totalVolume = orders.reduce((sum, ord) => sum + ord.quantity, 0);
  const totalActiveValue = orders.reduce((sum, ord) => sum + ord.totalCostQar, 0);
  
  const pendingTasksCount = tasks.filter(t => t.status !== "Completed").length;
  const criticalItemsCount = inventory.filter(inv => inv.quantity <= inv.minStock).length;
  const activeShipmentsCount = deliveries.filter(d => d.status !== "Delivered").length;

  // Custom multi-column bar chart (Monitoring daily unit output vs quotas for the last 7 days)
  const quotaChartData = [
    { day: "Sun", output: 4200, quota: 5000 },
    { day: "Mon", output: 4900, quota: 5000 },
    { day: "Tue", output: 5320, quota: 5000 },
    { day: "Wed", output: 4850, quota: 5000 },
    { day: "Thu", output: 5100, quota: 5000 },
    { day: "Fri", output: 1200, quota: 2000 }, // Weekend shift
    { day: "Sat", output: 3600, quota: 4000 }
  ];

  return (
    <div className="space-y-6 font-plus-jakarta text-slate-700">
      
      {/* Top Welcome Notification Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-[#0F6E56]/15 p-4 rounded-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Operations Monitor</h2>
          <p className="text-xs text-slate-500 mt-1">
            Production line is running at <span className="text-[#0F6E56] font-semibold">94.8% capacity</span>. Biometric validation enclave is operational.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center font-mono text-[10px] bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-[#0F6E56] animate-pulse"></span>
          REAL-TIME SQLITE CACHE SYNCED
        </div>
      </div>

      {/* KPI Birds-Eye Panel Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Order Value */}
        <div className="card-bg p-5 rounded-2xl relative group overflow-hidden transition-all duration-300 hover:border-[#0F6E56]/50 hover:shadow-[0_8px_25px_rgba(15,110,86,0.05)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="p-2 bg-[#0F6E56]/15 rounded-xl border border-[#0F6E56]/20 text-[#0F6E56]">
              <Coins className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <TrendingUp className="w-3 h-3" />
              <span>+8.1%</span>
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-xs text-slate-500 font-medium">Active Order Valuation</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">QAR {totalActiveValue.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 transition-all group-hover:text-slate-600">
              Across {orders.length} bespoke batch orders
            </p>
          </div>
        </div>

        {/* Metric 2: Material Stocks */}
        <div className="card-bg p-5 rounded-2xl relative group overflow-hidden transition-all duration-300 hover:border-[#0F6E56]/50 hover:shadow-[0_8px_25px_rgba(15,110,86,0.05)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-700">
              <Package className="w-5 h-5" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
              criticalItemsCount > 0 ? "bg-rose-50 text-rose-700 border-rose-150" : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}>
              {criticalItemsCount > 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              <span>{criticalItemsCount > 0 ? `${criticalItemsCount} Warning` : "Optimal"}</span>
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-xs text-slate-500 font-medium">Critical Stock Meter</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">{inventory.length} Sub-materials</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 transition-all group-hover:text-slate-600">
              {criticalItemsCount} items under safety buffer limit
            </p>
          </div>
        </div>

        {/* Metric 3: Active Operations */}
        <div className="card-bg p-5 rounded-2xl relative group overflow-hidden transition-all duration-300 hover:border-[#0F6E56]/50 hover:shadow-[0_8px_25px_rgba(15,110,86,0.05)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="p-2 bg-[#0F6E56]/15 rounded-xl border border-[#0F6E56]/20 text-[#0F6E56]">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <TrendingUp className="w-3 h-3" />
              <span>-12% load</span>
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-xs text-slate-500 font-medium">Operations Task Scheduler</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">{pendingTasksCount} Tasks Pending</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 transition-all group-hover:text-slate-600">
              Across 4 operational departments
            </p>
          </div>
        </div>

        {/* Metric 4: Logistics Deliveries */}
        <div className="card-bg p-5 rounded-2xl relative group overflow-hidden transition-all duration-300 hover:border-[#0F6E56]/50 hover:shadow-[0_8px_25px_rgba(15,110,86,0.05)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="p-2 bg-[#0F6E56]/15 rounded-xl border border-[#0F6E56]/20 text-[#0F6E56]">
              <Truck className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-teal-700 text-xs font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
              <span>Next Core Hub</span>
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-xs text-slate-500 font-medium">Logistics Deliveries</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">{activeShipmentsCount} In-transit</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 transition-all group-hover:text-slate-600">
              Hamad Sea Port to West Bay towers
            </p>
          </div>
        </div>

      </div>

      {/* Main Bar Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Custom Visual Analytics Chart Container */}
        <div className="card-bg p-6 rounded-2xl lg:col-span-2 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">Daily Manufacturing Yield VS Quota</h3>
              <p className="text-xs text-slate-500 font-sans">Daily lanyard unit output against production benchmarks</p>
            </div>
            
            {/* Status Legend */}
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-gradient-to-t from-[#0F6E56] to-[#5ED9B0]"></span>
                <span className="text-slate-600">Daily Output</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded border border-dashed border-[#0F6E56]/30"></span>
                <span className="text-slate-600">Base Quota Target</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Core Block */}
          <div className="h-64 flex flex-col justify-between pt-4">
            
            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-6 relative mt-2 border-b border-slate-200 pb-2">
              
              {/* Horizontal Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] font-mono text-slate-400">
                <div className="w-full border-t border-dashed border-slate-200 select-none pt-1"><span>6,000 units</span></div>
                <div className="w-full border-t border-dashed border-slate-200 select-none pt-1"><span>4,000 units</span></div>
                <div className="w-full border-t border-dashed border-slate-200 select-none pt-1"><span>2,000 units</span></div>
              </div>

              {/* Individual Bar Columns */}
              {quotaChartData.map((d, index) => {
                const outputHeight = (d.output / 6000) * 100;
                const quotaHeight = (d.quota / 6000) * 100;
                const isGoalMet = d.output >= d.quota;
                const isHovered = hoveredBar === index;

                return (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center relative group"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    
                    {/* Hover Floating Details Overlay */}
                    {isHovered && (
                      <div className="absolute -top-16 z-20 bg-white border border-slate-200 p-2.5 rounded-lg shadow-xl text-[10px] font-mono text-left w-32 -translate-y-1">
                        <div className="text-[#0F6E56] font-bold mb-0.5">{d.day} Yield</div>
                        <div className="text-slate-700">Output: <span className="text-slate-900 font-semibold">{d.output.toLocaleString()}</span></div>
                        <div className="text-slate-500">Quota: {d.quota.toLocaleString()}</div>
                        <div className={`mt-1 font-semibold ${isGoalMet ? "text-emerald-600" : "text-amber-600"}`}>
                          {isGoalMet ? "✓ Quota Met" : `✗ -${d.quota - d.output}`}
                        </div>
                      </div>
                    )}

                    {/* Columns Stack */}
                    <div className="w-full max-w-[40px] flex items-end justify-center h-48 relative">
                      
                      {/* Quota dotted marker */}
                      <div
                        style={{ bottom: `${quotaHeight}%` }}
                        className="absolute left-0 right-0 border-t-2 border-dashed border-[#0F6E56]/20 z-10 pointer-events-none"
                        title={`Quota Benchmark: ${d.quota}`}
                      ></div>

                      {/* Main output bar bar graph */}
                      <div
                        style={{ height: `${outputHeight}%` }}
                        className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer relative ${
                          isGoalMet
                            ? "bg-gradient-to-t from-[#0F6E56] to-[#5ED9B0] group-hover:opacity-90 shadow-[0_4px_15px_rgba(15,110,86,0.1)]"
                            : "bg-gradient-to-t from-slate-400 to-slate-500 group-hover:brightness-110 shadow-sm"
                        }`}
                      >
                        {/* Shimmer flare inside bar */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-lg"></div>
                      </div>

                    </div>

                    <span className="text-xs font-semibold text-slate-500 mt-2.5">{d.day}</span>
                  </div>
                );
              })}

            </div>

          </div>

          <div className="mt-3.5 p-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs font-mono text-slate-600 border border-slate-200">
            <span>Active Operational Shift: Night-Run Loom 4 A</span>
            <span className="text-[#0F6E56] font-semibold">Goal Tracking Active</span>
          </div>

        </div>

        {/* Live Device Security Log Terminal */}
        <div className="card-bg p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0F6E56]" />
                Audit Trail Log
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Local SQLite</span>
            </div>
            
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1 customize-scrollbar">
              {systemLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="text-xs border-b border-slate-100 pb-2 flex flex-col">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span className="text-[#0F6E56] font-semibold">{log.actor}</span>
                    <span>{log.timestamp.split(" ")[1]}</span>
                  </div>
                  <p className="text-slate-700 leading-tight mt-1 font-mono text-[11px]">{log.action}</p>
                </div>
              ))}
              {systemLogs.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs font-mono">
                  No operational logistics transaction log holds
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">ACTIVE REGULATOR OVERLOOK</span>
            <div className="flex items-center gap-1.5 text-xs text-[#0F6E56] font-mono bg-[#0F6E56]/10 px-2 py-0.5 rounded border border-[#0F6E56]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56] animate-pulse"></span>
              SECURE
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
