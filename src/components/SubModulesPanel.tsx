/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { TaskCategory, TaskPriority, UserRole, Order, ProductType } from "../types";
import { 
  Cpu, 
  PackageCheck, 
  Palette, 
  Calculator, 
  Briefcase, 
  MapPin, 
  FileSpreadsheet, 
  HardHat, 
  PlusCircle, 
  Check, 
  X, 
  DollarSign, 
  AlertCircle, 
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";

export const SubModulesPanel: React.FC = () => {
  const {
    inventory,
    proofs,
    orders,
    deliveries,
    clients,
    activeRole,
    purchaseMaterial,
    approveDesignProof,
    rejectDesignProof,
    createNewOrder,
    addCRMClient,
    addCRMNote,
    advanceShipmentStage,
    addLog
  } = useWorkspace();

  const [selectedSub, setSelectedSub] = useState<number>(0);

  // Form States
  const [calcProductType, setCalcProductType] = useState<ProductType>(ProductType.Lanyards);
  const [calcQty, setCalcQty] = useState<number>(1000);
  const [calcWidth, setCalcWidth] = useState<"15mm" | "20mm" | "25mm">("20mm");
  const [calcLength, setCalcLength] = useState<number>(90);
  const [calcClip, setCalcClip] = useState<"Lobster Swivel Clip" | "Heavy Duty Carabiner" | "Oval Hook" | "Quick Release Clip" | string>("Lobster Swivel Clip");
  const [calcSafety, setCalcSafety] = useState<boolean>(true);
  const [calcClient, setCalcClient] = useState<string>("Qatar Airways");

  // Badge States
  const [calcBadgeType, setCalcBadgeType] = useState<"Plastic ID Card" | "Metal Badge" | "Acrylic VIP Badge">("Plastic ID Card");
  const [calcBadgeAttachment, setCalcBadgeAttachment] = useState<"Magnetic Bar" | "Safety Pin" | "Strap Clip">("Magnetic Bar");

  // Mouse Pad States
  const [calcMousePadSize, setCalcMousePadSize] = useState<"Standard (25x20cm)" | "Extended Desk (90x40cm)">("Standard (25x20cm)");
  const [calcMousePadThickness, setCalcMousePadThickness] = useState<"3mm Comfort" | "5mm Pro-Gamer">("3mm Comfort");

  // Mug States
  const [calcMugStyle, setCalcMugStyle] = useState<"Classic Ceramic (11oz)" | "Premium Matte Black" | "Travel Insulated Mug">("Classic Ceramic (11oz)");
  const [calcMugAccentColor, setCalcMugAccentColor] = useState<boolean>(true);

  // Pen States
  const [calcPenModel, setCalcPenModel] = useState<"Standard Plastic Clicker" | "Premium Metal Rollerball" | "Bamboo Eco-Stylus">("Standard Plastic Clicker");
  const [calcPenInkColor, setCalcPenInkColor] = useState<"Blue Ink" | "Black Ink">("Blue Ink");

  // CRM Form States
  const [crmName, setCrmName] = useState("");
  const [crmObj, setCrmObj] = useState("");
  const [crmValue, setCrmValue] = useState<number>(45000);
  const [crmContact, setCrmContact] = useState("");
  const [crmEmail, setCrmEmail] = useState("");
  const [crmNoteTexts, setCrmNoteTexts] = useState<Record<string, string>>({});

  // Sub Module metadata definitions
  const subModules = [
    { id: 0, title: "Production Tracker", icon: Cpu, desc: "Step-by-step manufacturing cycle progress indicators" },
    { id: 1, title: "Inventory Management", icon: PackageCheck, desc: "High density physical thread stock meters and triggers" },
    { id: 2, title: "Design Proofing Hub", icon: Palette, desc: "Aesthetic spec reviewer, Pantone matching, and logo approval flags" },
    { id: 3, title: "Order Calculator & Manager", icon: Calculator, desc: "Translates batch vectors into invoices and adds orders" },
    { id: 4, title: "Client CRM Contacts", icon: Briefcase, desc: "Qatar enterprise directories, historic notes and logs" },
    { id: 5, title: "Delivery Tracker", icon: MapPin, desc: "Dispatched transit vectors from Salwa Ind. Zone to West Bay" },
    { id: 6, title: "Reports & Performance Matrix", icon: FileSpreadsheet, desc: "Material yield, defect rates, and overhead summaries" },
    { id: 7, title: "Employee Task Dispatcher", icon: HardHat, desc: "Role-based technician rosters and active task summaries" }
  ];

  const handleCreateCalculatedOrder = () => {
    createNewOrder({
      clientName: calcClient,
      quantity: calcQty,
      productType: calcProductType,
      width: calcProductType === ProductType.Lanyards ? calcWidth : undefined,
      lengthCm: calcProductType === ProductType.Lanyards ? calcLength : undefined,
      clipType: calcProductType === ProductType.Lanyards ? calcClip : undefined,
      breakawaySafety: calcProductType === ProductType.Lanyards ? calcSafety : undefined,
      badgeType: calcProductType === ProductType.Badges ? calcBadgeType : undefined,
      badgeAttachment: calcProductType === ProductType.Badges ? calcBadgeAttachment : undefined,
      mousePadSize: calcProductType === ProductType.MousePads ? calcMousePadSize : undefined,
      mousePadThickness: calcProductType === ProductType.MousePads ? calcMousePadThickness : undefined,
      mugStyle: calcProductType === ProductType.Mugs ? calcMugStyle : undefined,
      mugAccentColor: calcProductType === ProductType.Mugs ? calcMugAccentColor : undefined,
      penModel: calcProductType === ProductType.Pens ? calcPenModel : undefined,
      penInkColor: calcProductType === ProductType.Pens ? calcPenInkColor : undefined,
      isCustomLogo: calcClient !== "Katara Cultural Village"
    });
    alert(`Order invoice compiled for ${calcProductType}! Appended QORD to relational SQLite database.`);
  };

  const handleCreateCRMClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crmObj || !crmName) return;
    addCRMClient({
      name: crmName,
      companyName: crmObj,
      contractValueQar: crmValue,
      contactNumber: crmContact || "+974 5550 1234",
      email: crmEmail || "admin@qatarinfrastructure.com",
      status: "Lead",
      notes: ["Initial lead logged via central Sales module"]
    });
    setCrmName("");
    setCrmObj("");
    alert("New custom enterprise lead appended safely!");
  };

  const handleAppendCRMNote = (clientId: string) => {
    const text = crmNoteTexts[clientId];
    if (!text || !text.trim()) return;
    addCRMNote(clientId, text);
    setCrmNoteTexts(prev => ({ ...prev, [clientId]: "" }));
  };

  const activeSubTitle = subModules[selectedSub].title;

  return (
    <div className="card-bg p-5 rounded-3xl space-y-6 font-plus-jakarta text-slate-800">
      
      {/* Module Title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-[#0F6E56] font-bold uppercase tracking-wider font-mono">
          <Cpu className="w-4 h-4 text-[#0F6E56]" />
          Industrial sub-assembly &amp; business processes
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">LanyardQatar High Fidelity Operations Panels</h2>
        <p className="text-xs text-slate-500 mt-1">
          Explore the 8 interconnected sub-modules directly controlling factory execution parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side Sub-assembly selection lists */}
        <div className="space-y-2 lg:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block px-1">
            CORE PANELS ROSTER
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {subModules.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedSub === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedSub(item.id);
                    addLog(`Opened sub-assembly workspace node: [${item.title}]`);
                  }}
                  className={`text-left p-3 rounded-2xl flex flex-col justify-between transition-all border shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#0F6E56]/10 border-[#0F6E56] text-[#0F6E56] shadow-sm font-semibold"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#0F6E56]" : "text-slate-400"}`} />
                    <span className="text-[11px] font-bold uppercase font-mono tracking-tight leading-tight">{item.title}</span>
                  </div>
                  <span className="hidden lg:block text-[10px] text-slate-400 mt-1 font-medium leading-tight">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Frame: High Fidelity Sub-module contents */}
        <div className="card-bg rounded-3xl p-6 lg:col-span-3 min-h-[440px]">
          
          {/* Sub Header */}
          <div className="border-b border-slate-200 pb-3 mb-5 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F6E56] animate-pulse"></span>
              {activeSubTitle}
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Node Identifier: SUB-0{selectedSub + 1}</span>
          </div>

          {/* DYNAMIC CONTENTS */}

          {/* 1. Production Tracker */}
          {selectedSub === 0 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500 leading-relaxed">
                Track sequential operations on physical orders progressing at our Salwa facilities. Each stage utilizes Linear Progress indicators representing volume completeness parameters.
              </p>
              
              <div className="space-y-4">
                {[
                  { stage: "Polyester Cutting & Slitting", value: 100, duration: "Doha Block 2 Gantry", status: "Closed" },
                  { stage: "Strap Twill Loom Weaving", value: 85, duration: "Loom Operator Crew A", status: "Active" },
                  { stage: "High-Temp Dye-Sublimation Press", value: 65, duration: "Plate heat 195°C", status: "Active" },
                  { stage: "Accessory Stitching & Assembly", value: 40, duration: "Heavy stitching station 4", status: "Active" },
                  { stage: "Administrative Quality Checks & Packing", value: 10, duration: "Audit compliance", status: "Active" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-800 font-bold">{s.stage}</span>
                      <span className="text-[#0F6E56] font-bold">{s.value}%</span>
                    </div>
                    
                    {/* Linear Progress Indicator */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                      <div
                        style={{ width: `${s.value}%` }}
                        className="h-full bg-gradient-to-r from-[#0F6E56] to-[#5ED9B0] transition-all duration-500"
                      ></div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Facilitator: {s.duration}</span>
                      <span className={s.status === "Closed" ? "text-slate-400 font-medium" : "text-[#0F6E56] font-semibold"}>
                        {s.status === "Closed" ? "✓ READY FOR PIPELINE" : "● MANUFACTURING IN-PROGRESS"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Inventory Management */}
          {selectedSub === 1 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500 leading-relaxed">
                Supervise high-density reserves of premium polyester webbing threads and security components. Warning locks trigger immediately when quantities slip below safety target parameters.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventory.map((inv) => {
                  const isLow = inv.quantity <= inv.minStock;
                  const ratio = Math.min((inv.quantity / (inv.minStock * 4)) * 100, 100);

                  return (
                    <div key={inv.id} className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-slate-400">{inv.id}</span>
                          <span className="text-[#0F6E56] font-semibold">{inv.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase mt-1 leading-tight">{inv.name}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-1">
                          STOCK: <span className={`font-bold ${isLow ? "text-rose-600" : "text-slate-800"}`}>{inv.quantity.toLocaleString()} {inv.unit}</span>
                          <span className="text-slate-400"> / Safety Buffer: {inv.minStock}</span>
                        </p>
                      </div>

                      {/* Stock percentage ratio display */}
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${ratio}%` }}
                          className={`h-full ${isLow ? "bg-rose-500 animate-pulse" : "bg-gradient-to-r from-emerald-800 to-teal-500"}`}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center gap-1 text-[11px] font-mono">
                        <span className="text-slate-500">Base Cost: QAR {inv.costPerUnit}</span>
                        
                        <button
                          onClick={() => {
                            purchaseMaterial(inv.id, inv.category === "Base Strap" ? 10 : 250);
                          }}
                          className="py-1 px-2 text-[10px] bg-[#0F6E56]/5 border border-[#0F6E56]/30 hover:bg-[#0F6E56] hover:text-white rounded text-[#0F6E56] transition-colors cursor-pointer font-bold uppercase tracking-wider"
                        >
                          + Trigger Restock
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Design Proofing Hub */}
          {selectedSub === 2 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500 leading-relaxed">
                Liaise directly with our Doha styling workshop to authorize bespoke strap mockups, check client logo specifications, and Pantone color matches before executing weaving procedures.
              </p>

              <div className="space-y-4">
                {proofs.map((proof) => (
                  <div key={proof.id} className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex gap-3.5 items-start">
                      
                      {/* Mock Image Placeholder */}
                      {proof.logoUrl ? (
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                          <img
                            src={proof.logoUrl}
                            referrerPolicy="no-referrer"
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-200 font-mono text-[10px] font-bold text-orange-600 flex items-center justify-center text-center shrink-0">
                          TEXT ONLY
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 rounded-md font-semibold">
                            {proof.id}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{proof.clientName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Strap: <span className="font-bold text-slate-700">{proof.weavingPattern} ({proof.lanyardWidth})</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            🎨 Pantone Code: <span className="text-[#0F6E56] font-medium">{proof.pantoneCode}</span>
                          </span>
                          <span>•</span>
                          <span>Resolution: {proof.resolutionDpi} DPI</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end md:self-center font-mono">
                      {proof.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => {
                              approveDesignProof(proof.id, "Administrative Officer");
                            }}
                            className="bg-[#0F6E56] hover:bg-[#0C5844] text-white py-1.5 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
                          >
                            ✓ Approve spec
                          </button>
                          <button
                            onClick={() => {
                              rejectDesignProof(proof.id);
                            }}
                            className="bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 py-1.5 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            ✗ Redraw
                          </button>
                        </>
                      ) : (
                        <div className={`py-1.5 px-3.5 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 ${
                          proof.status === "Approved"
                            ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                            : "bg-rose-50 border-rose-200 text-rose-600"
                        }`}>
                          <span>STATUS: {proof.status}</span>
                          {proof.approvedBy && <span className="text-slate-400 font-medium text-[9px]">({proof.approvedBy})</span>}
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Order Calculator & Manager */}
          {selectedSub === 3 && (() => {
            const priceInfo = (() => {
              let unitPrice = 10.0;
              let desc = "";
              if (calcProductType === ProductType.Lanyards) {
                const baseCostMultiplier = calcWidth === "15mm" ? 6.5 : calcWidth === "20mm" ? 8.5 : 9.5;
                const clipCost = calcClip?.includes("Carabiner") ? 3.5 : 1.5;
                const safetyCost = calcSafety ? 0.8 : 0;
                unitPrice = baseCostMultiplier + clipCost + safetyCost;
                desc = `Lanyard: ${calcWidth} width, ${calcLength}cm length, safety breakaway: ${calcSafety ? "Included" : "None"}`;
              } else if (calcProductType === ProductType.Badges) {
                const badgeBase = calcBadgeType === "Plastic ID Card" ? 5.0 : calcBadgeType === "Metal Badge" ? 11.0 : 8.0;
                const attachmentCost = calcBadgeAttachment === "Magnetic Bar" ? 1.5 : calcBadgeAttachment === "Safety Pin" ? 0.5 : 0.8;
                unitPrice = badgeBase + attachmentCost;
                desc = `Badge: ${calcBadgeType} with ${calcBadgeAttachment} Attachment`;
              } else if (calcProductType === ProductType.MousePads) {
                const sizeBase = calcMousePadSize.includes("Extended") ? 25.0 : 12.0;
                const thicknessCost = calcMousePadThickness === "5mm Pro-Gamer" ? 6.0 : 3.0;
                unitPrice = sizeBase + thicknessCost;
                desc = `Mouse Pad: ${calcMousePadSize}, thickness: ${calcMousePadThickness}`;
              } else if (calcProductType === ProductType.Mugs) {
                const mugBase = calcMugStyle === "Premium Matte Black" ? 22.0 : calcMugStyle === "Travel Insulated Mug" ? 30.0 : 15.0;
                const accentCost = calcMugAccentColor ? 3.0 : 0.0;
                unitPrice = mugBase + accentCost;
                desc = `Mug: ${calcMugStyle}, custom rim paint: ${calcMugAccentColor ? "Enabled (+QAR 3.00)" : "Disabled"}`;
              } else if (calcProductType === ProductType.Pens) {
                const penBase = calcPenModel === "Premium Metal Rollerball" ? 8.5 : calcPenModel === "Bamboo Eco-Stylus" ? 3.5 : 1.5;
                unitPrice = penBase;
                desc = `Pen: ${calcPenModel}, core option: ${calcPenInkColor}`;
              }
              return {
                unitPrice,
                totalCost: Math.round(calcQty * unitPrice),
                description: desc
              };
            })();

            return (
              <div className="space-y-5">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Estimate multi-parameter custom manufacturing contract prices on the fly. Select a product line category below, adjust specifications to compute invoice costings in Qatari Riyals (QAR), and commit them directly as active database records.
                </p>

                {/* Product Segment Category Tab */}
                <div className="bg-white border border-slate-200 p-1.5 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block px-2.5 pt-1.5 pb-1">
                    Select Product Category
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5">
                    {([ProductType.Lanyards, ProductType.Badges, ProductType.MousePads, ProductType.Mugs, ProductType.Pens] as const).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setCalcProductType(p);
                          addLog(`Selected manufacturing calculator product: ${p}`);
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-bold uppercase transition-all font-mono text-center cursor-pointer ${
                          calcProductType === p
                            ? "bg-[#0F6E56] text-white shadow-sm"
                            : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-4">
                  
                  {/* Inputs grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Bespoke Client</label>
                      <select
                        value={calcClient}
                        onChange={e => setCalcClient(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F6E56]"
                      >
                        <option value="Qatar Airways">Qatar Airways HQ</option>
                        <option value="Education City (QF)">Education City QF</option>
                        <option value="Katara Cultural Village">Katara Cultural Village</option>
                        <option value="Msheireb Properties">Msheireb Properties</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Volume Batch Qty</label>
                      <input
                        type="number"
                        value={calcQty}
                        onChange={e => setCalcQty(Math.max(100, parseInt(e.target.value) || 100))}
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F6E56]"
                      />
                    </div>

                    {/* LANYARDS specs options */}
                    {calcProductType === ProductType.Lanyards && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Strap Width Choice</label>
                          <div className="flex gap-2.5">
                            {(["15mm", "20mm", "25mm"] as const).map(w => (
                              <button
                                key={w}
                                type="button"
                                onClick={() => setCalcWidth(w)}
                                className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border ${
                                  calcWidth === w
                                    ? "bg-[#0F6E56] text-white border-transparent shadow-sm"
                                    : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Strap Length (cm)</label>
                          <input
                            type="number"
                            value={calcLength}
                            onChange={e => setCalcLength(Math.max(40, parseInt(e.target.value) || 90))}
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F6E56]"
                          />
                        </div>

                        <div className="space-y-1 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Primary Accessory Attachment</label>
                            <select
                              value={calcClip}
                              onChange={e => setCalcClip(e.target.value)}
                              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F6E56]"
                            >
                              <option value="Lobster Swivel Clip">Heavy Metal Lobster Clip (QAR 1.50 ea)</option>
                              <option value="Heavy Duty Carabiner">Military Carabiner (QAR 3.50 ea)</option>
                              <option value="Oval Hook">Standard Oval Hook (QAR 1.00 ea)</option>
                              <option value="Quick Release Clip">ABS Quick Release Clip (QAR 1.80 ea)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Safety Breakaway Buckle?</label>
                            <div className="flex items-center gap-2.5 pt-2">
                              <input
                                type="checkbox"
                                checked={calcSafety}
                                id="safety-calc-check"
                                onChange={e => setCalcSafety(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-[#0F6E56] focus:ring-0 cursor-pointer"
                              />
                              <label htmlFor="safety-calc-check" className="text-xs text-slate-500 leading-none cursor-pointer">
                                Include Safe-Snap coupler (+QAR 0.80 ea)
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* BADGES specs options */}
                    {calcProductType === ProductType.Badges && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Badge ID Card Type</label>
                          <select
                            value={calcBadgeType}
                            onChange={e => setCalcBadgeType(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F6E56]"
                          >
                            <option value="Plastic ID Card">Plastic High-Gloss ID Card (QAR 5.00 ea)</option>
                            <option value="Metal Badge">Laser-Etched Anodized Metal Badge (QAR 11.00 ea)</option>
                            <option value="Acrylic VIP Badge">Polished Beveled Premium Acrylic (QAR 8.00 ea)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Backing Attachment</label>
                          <select
                            value={calcBadgeAttachment}
                            onChange={e => setCalcBadgeAttachment(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F6E56]"
                          >
                            <option value="Magnetic Bar">Double-Magnet Heavy-Duty Bar (QAR 1.50 ea)</option>
                            <option value="Safety Pin">Pre-Mounted Safety Pin clasp (QAR 0.50 ea)</option>
                            <option value="Strap Clip">Mini Plastic Crocodile Snap Clip (QAR 0.80 ea)</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* MOUSE PADS specs options */}
                    {calcProductType === ProductType.MousePads && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Mouse Pad Dimensions</label>
                          <select
                            value={calcMousePadSize}
                            onChange={e => setCalcMousePadSize(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F6E56]"
                          >
                            <option value="Standard (25x20cm)">Standard Corporate Mat (25x20cm) (QAR 12.00 ea)</option>
                            <option value="Extended Desk (90x40cm)">Extended Gamer Desk pad (90x40cm) (QAR 25.00 ea)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Neoprene Cushion Thickness</label>
                          <div className="flex gap-2.5">
                            {(["3mm Comfort", "5mm Pro-Gamer"] as const).map(th => (
                              <button
                                key={th}
                                type="button"
                                onClick={() => setCalcMousePadThickness(th)}
                                className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border ${
                                  calcMousePadThickness === th
                                    ? "bg-[#0F6E56] text-white border-transparent shadow-sm"
                                    : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                              >
                                {th === "3mm Comfort" ? "3mm (+QAR 3.00)" : "5mm Pro (+QAR 6.00)"}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* MUGS specs options */}
                    {calcProductType === ProductType.Mugs && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Ceramic Mug Style</label>
                          <select
                            value={calcMugStyle}
                            onChange={e => setCalcMugStyle(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F6E56]"
                          >
                            <option value="Classic Ceramic (11oz)">Classic Glossy White 11oz Ceramic (QAR 15.00 ea)</option>
                            <option value="Premium Matte Black">Premium Matte Back Outer Surface (QAR 22.00 ea)</option>
                            <option value="Travel Insulated Mug">Thermal Twin-wall Travel Mug (QAR 30.00 ea)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Rim &amp; Interior Glazing</label>
                          <div className="flex items-center gap-2.5 pt-2">
                            <input
                              type="checkbox"
                              checked={calcMugAccentColor}
                              id="mug-accent-check"
                              onChange={e => setCalcMugAccentColor(e.target.checked)}
                              className="w-4 h-4 rounded border-slate-300 text-[#0F6E56] focus:ring-0 cursor-pointer"
                            />
                            <label htmlFor="mug-accent-check" className="text-xs text-slate-500 leading-none cursor-pointer">
                              Add Maroon/Gold accent glaze color (+QAR 3.00 ea)
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* PENS specs options */}
                    {calcProductType === ProductType.Pens && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Bespoke Pen Model</label>
                          <select
                            value={calcPenModel}
                            onChange={e => setCalcPenModel(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F6E56]"
                          >
                            <option value="Standard Plastic Clicker">Standard Comfort Retractable Pen (QAR 1.50 ea)</option>
                            <option value="Premium Metal Rollerball">Stately Brass Rollerball Engraved Pen (QAR 8.50 ea)</option>
                            <option value="Bamboo Eco-Stylus">Organic Bamboo Stylus Cap Pen (QAR 3.50 ea)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400 uppercase font-mono">Ink Reservoir Pigment</label>
                          <div className="flex gap-2.5">
                            {(["Blue Ink", "Black Ink"] as const).map(ink => (
                              <button
                                key={ink}
                                type="button"
                                onClick={() => setCalcPenInkColor(ink)}
                                className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border ${
                                  calcPenInkColor === ink
                                    ? "bg-[#0F6E56] text-white border-transparent shadow-sm"
                                    : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                              >
                                {ink}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                  </div>

                  {/* Sub-total output matrix */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left font-mono">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block">ESTIMATED INVOICE VALUE</span>
                      <span className="text-2xl font-bold text-slate-900 tracking-tight">
                        QAR {priceInfo.totalCost.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Estimated QAR {priceInfo.unitPrice.toFixed(2)} per piece</span>
                      <span className="text-[10.5px] text-[#0F6E56] font-semibold block mt-1">✓ {priceInfo.description}</span>
                    </div>

                    <button
                      onClick={handleCreateCalculatedOrder}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#0F6E56] hover:bg-[#0C5844] text-white font-extrabold text-xs tracking-wide uppercase rounded-xl shadow-md cursor-pointer transition-colors"
                    >
                      Commit Active Order Record
                    </button>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* 5. Client CRM Contacts */}
          {selectedSub === 4 && (
            <div className="space-y-6">
              <p className="text-xs text-slate-500 leading-relaxed">
                Examine Qatar enterprise account directors, contact pipelines, and associate historical conversation logs directly with active profiles holding high contract values.
              </p>

              {/* Lead generation small form */}
              <form onSubmit={handleCreateCRMClient} className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Insert Corporate Lead</span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Company (e.g. Al-Jazeera)"
                    value={crmObj}
                    onChange={e => setCrmObj(e.target.value)}
                    className="bg-white border border-slate-200 text-xs px-3 py-1.5 rounded-lg text-slate-800"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Director (e.g. Khalid)"
                    value={crmName}
                    onChange={e => setCrmName(e.target.value)}
                    className="bg-white border border-slate-200 text-xs px-3 py-1.5 rounded-lg text-slate-800"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Value (QAR)"
                    value={crmValue}
                    onChange={e => setCrmValue(parseInt(e.target.value) || 20000)}
                    className="bg-white border border-slate-200 text-xs px-3 py-1.5 rounded-lg text-slate-800"
                  />
                  <button
                    type="submit"
                    className="bg-[#0F6E56] hover:bg-[#0C5844] text-white font-extrabold text-xs uppercase rounded-lg cursor-pointer py-1.5 shadow-sm"
                  >
                    Save lead
                  </button>
                </div>
              </form>

              {/* CRM list cards */}
              <div className="space-y-3.5">
                {clients.map((c) => (
                  <div key={c.id} className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">{c.id}</span>
                          <span className="text-xs font-bold text-slate-800">{c.companyName}</span>
                          <span className="text-[10px] font-mono font-bold uppercase text-[#0F6E56] bg-[#0F6E56]/10 px-2 rounded border-none">
                            {c.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Director: <span className="text-slate-700 font-semibold">{c.name}</span> • Contact: {c.contactNumber}</p>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-slate-400 block text-[9px] uppercase">CONTRACT ESTIMATE</span>
                        <span className="text-[#0F6E56] font-bold">QAR {c.contractValueQar.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Historical Notes */}
                    <div className="space-y-1.5 font-medium">
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Operational Log Entries:</span>
                      
                      <div className="space-y-1">
                        {c.notes.map((n, idx) => (
                          <div key={idx} className="text-xs text-slate-700 bg-white border border-slate-150 p-2 rounded-lg shadow-sm">
                            • {n}
                          </div>
                        ))}
                      </div>

                      {/* Add historical note text field */}
                      <div className="flex gap-2 pt-1 font-sans">
                        <input
                          type="text"
                          placeholder="Log interaction details..."
                          value={crmNoteTexts[c.id] || ""}
                          onChange={e => setCrmNoteTexts(prev => ({ ...prev, [c.id]: e.target.value }))}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAppendCRMNote(c.id)}
                          className="px-3 bg-[#0F6E56]/10 border border-[#0F6E56]/30 hover:bg-[#0F6E56] hover:text-white rounded-lg text-xs font-bold text-[#0F6E56] cursor-pointer"
                        >
                          Add Log
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Delivery Tracker */}
          {selectedSub === 5 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500 leading-relaxed">
                Observe absolute real-time delivery progress vectors. Deliveries originate at our Salwa Ind. Zone facilities, dispatch through security checkpoints, and clear Hamad International Port structures directly to Doha corporate offices.
              </p>

              <div className="space-y-4">
                {deliveries.map((sh) => {
                  const isDelivered = sh.status === "Delivered";
                  return (
                    <div key={sh.id} className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3.5">
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400">{sh.id}</span>
                            <span className="text-xs font-bold text-slate-800">{sh.clientName}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">Destination: <span className="text-[#0F6E56] font-semibold">{sh.currentLocation}</span></p>
                        </div>

                        <div className="text-right font-mono text-xs">
                          <span className="text-slate-400 block text-[9px] uppercase">Transit Stage</span>
                          <span className="text-slate-700 font-bold">{sh.status} ({sh.routeStage}/4)</span>
                        </div>
                      </div>

                      {/* Visual segmented timeline representation */}
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { title: "Plant Assembly", idx: 1 },
                          { title: "Ind. Highway Hub", idx: 2 },
                          { title: "Local Customs", idx: 3 },
                          { title: "Delivered HQ", idx: 4 }
                        ].map((node) => {
                          const isActive = sh.routeStage >= node.idx;
                          const isCurrent = sh.routeStage === node.idx;
                          return (
                            <div key={node.idx} className="space-y-1">
                              <div className={`h-2 rounded ${
                                isCurrent
                                  ? "bg-[#00E5A3] animate-pulse shadow-sm"
                                  : isActive
                                  ? "bg-[#0F6E56]"
                                  : "bg-slate-200"
                              }`}></div>
                              <span className={`text-[9px] font-mono block text-center uppercase tracking-tight font-medium ${
                                isCurrent ? "text-[#0F6E56] font-bold" : "text-slate-400"
                              }`}>{node.title}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Advance action button */}
                      {!isDelivered && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => {
                              advanceShipmentStage(sh.id);
                            }}
                            className="text-[10px] bg-[#0F6E56]/10 border border-[#0F6E56]/30 text-[#0F6E56] hover:bg-[#0F6E56] hover:text-white px-3 py-1 rounded font-bold uppercase font-mono tracking-wider transition-all cursor-pointer"
                          >
                            Advance Transit stage »
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}

                {deliveries.length === 0 && (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 border-dashed text-xs text-slate-500 font-mono">
                    No active freight transits currently recorded inside the database table.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. Reports & Material Yield Matrix */}
          {selectedSub === 6 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500 leading-relaxed">
                Study technical manufacturing indicators, material overhead calculations, and defect ratios compiled directly from recent loom production audits.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Financial overview */}
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-bold uppercase">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Material Yield Matrix
                  </div>

                  <div className="space-y-2 pt-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Fabric Thread Utility Ratio</span>
                      <span className="text-slate-950 font-bold">96.8%</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Breakaway safety snap yield</span>
                      <span className="text-slate-950 font-bold">99.2%</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Loom temperature consistency</span>
                      <span className="text-slate-950 font-bold">98.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ink pigment heat setting depth</span>
                      <span className="text-[#0F6E56] font-bold">Optimal (900 dpi)</span>
                    </div>
                  </div>
                </div>

                {/* Logistics overview */}
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-bold uppercase">
                    <Award className="w-4 h-4 text-purple-600" />
                    General Defect &amp; QA metrics
                  </div>

                  <div className="space-y-2 pt-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Lanyard Stitch joint failures</span>
                      <span className="text-slate-950 font-bold">0.12%</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Sublimation color drift delta</span>
                      <span className="text-slate-950 font-bold">0.4%</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Customs crossing speed index</span>
                      <span className="text-slate-950 font-bold">94.8% success</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Doha administrative feedback</span>
                      <span className="text-[#0F6E56] font-bold">100% compliant</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 8. Employee Task Hub */}
          {selectedSub === 7 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500 leading-relaxed">
                Apportion daily industrial duties to loom weaving technicians and stitching operators based on their security cleared roles.
              </p>

              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Station Task Rostering</span>
                
                <div className="space-y-2.5">
                  {[
                    { crew: "Fabric Weavers Room A", task: "Weave 25mm black nylon straps with reinforced side tracks", quota: "3,000 units", assignment: "Loom No. 4" },
                    { crew: "Dye Sub Gantry Crew", task: "Load Pantone 295C sapphire ink for VIP educational order", quota: "2,500 units", assignment: "Press No. 1" },
                    { crew: "Sewing Technicians 2B", task: "Stitch trigger snap clips with dual row heavy duty nylon thread", quota: "4,000 units", assignment: "Stitch Station 3" },
                    { crew: "Logistics Field Escort", task: "Escort freight container from Ind. Hub directly past airport bypass", quota: "2 VIP batches", assignment: "Freight Truck No. 3" }
                  ].map((cr, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1.5 shadow-sm">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-[#0F6E56] font-bold">{cr.crew}</span>
                        <span className="text-slate-400">LOCATION: {cr.assignment}</span>
                      </div>
                      <p className="text-slate-800 font-bold leading-tight">{cr.task}</p>
                      <p className="text-[11px] text-slate-500">Target Output Capacity: <span className="font-semibold text-slate-800">{cr.quota}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
