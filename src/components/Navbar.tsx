/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { BarChart3, ListTodo, MessageSquare, CalendarRange, Settings, LogOut, Shield } from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    activeRole,
    setIsLocked,
    currentUser,
    addLog
  } = useWorkspace();

  const handleModuleClick = (mod: "Dashboard" | "Tasks" | "Comm" | "Calendar" | "Settings") => {
    setActiveModule(mod);
    addLog(`Changed active interface workspace viewport to: [${mod} Panel]`);
  };

  const navItems = [
    { name: "Dashboard", label: "Dashboard", icon: BarChart3, key: "Dashboard" as const },
    { name: "Tasks", label: "Task Manager", icon: ListTodo, key: "Tasks" as const },
    { name: "Comm", label: "Team Comm", icon: MessageSquare, key: "Comm" as const },
    { name: "Calendar", label: "Operations Calendar", icon: CalendarRange, key: "Calendar" as const },
    { name: "Settings", label: "System Settings", icon: Settings, key: "Settings" as const }
  ];

  const getRoleColor = () => {
    switch (activeRole) {
      case "Admin": return "border-red-200 text-red-700 bg-red-50";
      case "Sales": return "border-blue-200 text-blue-700 bg-blue-50";
      case "Design": return "border-purple-200 text-purple-700 bg-purple-50";
      case "Production": return "border-emerald-200 text-emerald-700 bg-emerald-50";
      default: return "border-[#0F6E56]/20 text-[#0F6E56] bg-[#0F6E56]/5";
    }
  };

  return (
    <header className="bg-white/80 border-b border-[#0F6E56]/15 sticky top-0 z-40 px-4 py-3 shadow-[0_2px_15px_rgba(0,0,0,0.03)] backdrop-blur-md font-plus-jakarta">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0F6E56] flex items-center justify-center border border-[#5ED9B0] shadow-[0_0_10px_rgba(15,110,86,0.15)]">
            <span className="text-[#5ED9B0] font-extrabold text-sm tracking-tight">LQ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-lg tracking-tight uppercase">LanyardQatar</span>
              <span className="text-[10px] text-slate-500 font-mono">v1.2</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none">Automated Corporate Operations &amp; Logistics</p>
          </div>
        </div>

        {/* Central Core Navigations */}
        <nav className="flex items-center gap-1.5 bg-slate-150/70 p-1 rounded-xl border border-slate-200 bg-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeModule === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleModuleClick(item.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0F6E56] text-white shadow-[0_0_12px_rgba(15,110,86,0.2)]"
                    : "text-slate-600 hover:text-[#0F6E56] hover:bg-[#0F6E56]/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-[#5ED9B0]" : "text-slate-500"}`} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Access Right Information */}
        <div className="flex items-center gap-3">
          
          {/* Identity Stamp */}
          <div className={`border px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 font-semibold font-mono ${getRoleColor()}`}>
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden leading-none lg:inline">{currentUser}</span>
            <span className="leading-none lg:hidden">{activeRole}</span>
          </div>

          {/* Secure Lock System */}
          <button
            onClick={() => {
              setIsLocked(true);
              addLog(`Terminal lock prompted — Secure memory state held safely`);
            }}
            title="Lock Access Terminal"
            className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
