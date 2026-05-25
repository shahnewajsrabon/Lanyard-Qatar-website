/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { Calendar, Clock, Truck, Hammer, ShieldAlert, CheckCircle, Play } from "lucide-react";

export const CalendarView: React.FC = () => {
  const {
    orders,
    deliveries,
    dispatchShipment,
    addLog
  } = useWorkspace();

  const [filterType, setFilterType] = useState<"All" | "DyeSub" | "Shipment" | "VIP">("All");

  // Custom Operations Calendar Schedule Events
  const baseTimelineEvents = [
    {
      id: "CAL-01",
      title: "Qatar Airways Silk Dye-Sub Press Routine",
      time: "08:15 - 11:30",
      date: "2026-05-25",
      type: "DyeSub",
      priority: "Critical",
      location: "Gantry Loom No. 3",
      assignedTech: "Hassan Raza",
      status: "Running"
    },
    {
      id: "CAL-02",
      title: "VIP client proof vetting panel",
      time: "14:00 - 15:00",
      date: "2026-05-25",
      type: "VIP",
      priority: "High",
      location: "Main Admin Office Tower 1",
      assignedTech: "Aisha Al-Kuwari",
      status: "Scheduled"
    },
    {
      id: "CAL-03",
      title: "Education City Delivery - Truck 3 Loading",
      time: "10:00 - 11:30",
      date: "2026-06-05",
      type: "Shipment",
      priority: "High",
      location: "Factory Loading Dock 2B",
      assignedTech: "Tariq Mahmood",
      status: "Loaded"
    },
    {
      id: "CAL-04",
      title: "Katara Cultural Village - Secondary Loom setup",
      time: "11:00 - 13:00",
      date: "2026-06-10",
      type: "DyeSub",
      priority: "Medium",
      location: "Stitching Loom No. 1",
      assignedTech: "Sewing Machine Room Tech A",
      status: "Scheduled"
    }
  ];

  const handleStartLoomRun = () => {
    addLog(`Initiated emergency Gantry Dye-Sub press run for impending VIP order`);
    alert("Industrial Dye-Sub press calibrated and initiated safely in Room 3.");
  };

  const filteredEvents = baseTimelineEvents.filter(ev => {
    if (filterType === "All") return true;
    return ev.type === filterType;
  });

  return (
    <div className="space-y-6 font-plus-jakarta text-slate-800">
      
      {/* Header operations descriptor */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Operations Calendar &amp; Delivery Timeline</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track precise shipping deadlines, schedule heat-sublimation runs, and supervise freight tasks from Salwa Industrial Area.
          </p>
        </div>

        <button
          onClick={handleStartLoomRun}
          className="bg-[#0F6E56] hover:bg-[#0C5844] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 self-start sm:self-center shadow-sm border border-transparent"
        >
          <Play className="w-3.5 h-3.5 text-emerald-300" />
          <span>Loom Press Hotstart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Sub-panels left list: Timeline Event Filter controls */}
        <div className="card-bg p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
            Line Schedulers
          </h3>
          
          <div className="flex flex-col gap-1.5 text-xs font-mono">
            {[
              { type: "All" as const, label: "All Milestones" },
              { type: "DyeSub" as const, label: "Dye Sublication Runs" },
              { type: "Shipment" as const, label: "Logistics Deliveries" },
              { type: "VIP" as const, label: "Corporate Engagements" }
            ].map(b => (
              <button
                key={b.type}
                onClick={() => setFilterType(b.type)}
                className={`py-2 px-3 text-left rounded-xl transition-all uppercase text-[11px] font-bold border cursor-pointer ${
                  filterType === b.type
                    ? "bg-[#0F6E56] border-transparent text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 mt-3.5 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Pending Dispatch Orders</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Below are active orders cleared for manufacturing that have not yet been logged in physical transit. Discretion is advised.
            </p>

            <div className="space-y-2">
              {orders.filter(o => o.designStatus === "Approved").map(ord => (
                <div key={ord.id} className="p-3 rounded-xl bg-slate-50 border border-slate-150 text-xs space-y-2">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-[#0F6E56] font-bold">{ord.id}</span>
                    <span className="text-slate-400">QTY: {ord.quantity}</span>
                  </div>
                  <div className="text-slate-800 font-bold leading-none">{ord.clientName}</div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    <span className="bg-[#0F6E56]/10 text-[#0F6E56] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mr-1">
                      {ord.productType || "Lanyard"}
                    </span>
                    {ord.productType === "Badges" && `${ord.badgeType} (${ord.badgeAttachment})`}
                    {ord.productType === "MousePads" && `${ord.mousePadSize} (${ord.mousePadThickness || "3mm Comfort"})`}
                    {ord.productType === "Mugs" && `${ord.mugStyle} (${ord.mugAccentColor ? "Maroon/Gold Glaze" : "Glossy White"})`}
                    {ord.productType === "Pens" && `${ord.penModel} (${ord.penInkColor})`}
                    {(!ord.productType || ord.productType === "Lanyards") && `${ord.width || "20mm"} width • Clip: ${ord.clipType || "Lobster Swivel Clip"} • ${ord.lengthCm || 90}cm`}
                  </p>
                  
                  <button
                    onClick={() => dispatchShipment(ord.id, "Salwa Industrial Zone Plant 2")}
                    className="w-full mt-1.5 py-1.5 bg-[#0F6E56]/10 border border-[#0F6E56]/30 hover:bg-[#0F6E56] hover:text-white text-[10px] font-bold font-mono tracking-wider text-[#0F6E56] rounded transition-all cursor-pointer select-none"
                  >
                    DISPATCH TO FREIGHT CARRIER
                  </button>
                </div>
              ))}
              {orders.filter(o => o.designStatus === "Approved").length === 0 && (
                <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-[10px] font-mono text-slate-400">
                  No orders queueing dispatch approval
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline representation block */}
        <div className="card-bg p-5 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Manufacturing Schedule Terminal (Local Time)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">May/June 2026 Batch Runs</span>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-y-3 before:left-[17px] before:w-[1px] before:bg-gradient-to-b before:from-[#0F6E56] before:via-slate-200 before:to-transparent">
            {filteredEvents.map((ev) => (
              <div key={ev.id} className="flex gap-4 relative">
                
                {/* Visual anchor point */}
                <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <Clock className="w-4 h-4 text-[#0F6E56]" />
                </div>

                {/* Event core box */}
                <div className="flex-1 bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="text-[10px] font-mono bg-[#0F6E56]/10 px-2 py-0.5 rounded text-[#0F6E56] border border-[#0F6E56]/15 uppercase tracking-wider font-bold">
                      {ev.id} • {ev.type}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <span>{ev.date}</span>
                      <span>({ev.time})</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-950 leading-tight">{ev.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Location: <span className="text-[#0F6E56] font-medium">{ev.location}</span></p>
                  </div>

                  <div className="border-t border-slate-150 pt-2 mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Tech Lead: <span className="text-slate-800 font-bold">{ev.assignedTech}</span></span>
                    <span className={`font-semibold ${
                      ev.status === "Running" ? "text-emerald-600 animate-pulse font-bold" : "text-slate-400"
                    }`}>
                      {ev.status === "Running" ? "● LIVE IN PROGRESS" : "✓ QUEUED"}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Logistics tracking list integration inside timeline */}
          <div className="pt-4 border-t border-slate-200 mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 font-mono flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#0F6E56]" />
              Active Shipping Deliveries In-Transit
            </h4>
            
            <div className="space-y-2.5">
              {deliveries.filter(d => d.status !== "Delivered").map(d => (
                <div key={d.id} className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-405">
                      <span>Ref: {d.id}</span>
                      <span>•</span>
                      <span className="text-[#0F6E56] uppercase font-bold">{d.status}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-tight">{d.clientName}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Current Hub: {d.currentLocation}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 block">ETA: {d.eta}</span>
                    <span className="text-[11px] font-mono text-[#0F6E56] font-semibold">Route Progress Stage: {d.routeStage}/4</span>
                  </div>
                </div>
              ))}
              {deliveries.filter(d => d.status !== "Delivered").length === 0 && (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 font-mono">
                  All logistical shipments safely completed and delivered
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
