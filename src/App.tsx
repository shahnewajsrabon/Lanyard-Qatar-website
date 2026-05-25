/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WorkspaceProvider, useWorkspace } from "./context/WorkspaceContext";
import { BiometricGate } from "./components/BiometricGate";
import { Navbar } from "./components/Navbar";
import { DashboardView } from "./components/DashboardView";
import { TasksView } from "./components/TasksView";
import { CommChannelView } from "./components/CommChannelView";
import { CalendarView } from "./components/CalendarView";
import { SettingsView } from "./components/SettingsView";
import { SubModulesPanel } from "./components/SubModulesPanel";
import { LayoutGrid, ShieldCheck, Activity } from "lucide-react";

const AppContent: React.FC = () => {
  const { isLocked, activeModule, activeRole } = useWorkspace();

  if (isLocked) {
    return <BiometricGate />;
  }

  return (
    <div className="min-h-screen bg-[#F3F7F5] text-slate-800 font-plus-jakarta flex flex-col relative overflow-hidden selection:bg-[#5ED9B0] selection:text-white">
      
      {/* Absolute Background Glowing Blooms */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] glow-emerald rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-[#5ED9B0]/5 to-[#0F6E56]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Primary Navigation Hub header */}
      <Navbar />

      {/* Main Control Panel Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        
        {/* Dynamic Nav View Wrapper */}
        <section id="workspace-core-viewport" className="card-bg rounded-3xl p-5 sm:p-7 shadow-[0_8px_30px_rgba(15,110,86,0.03)] backdrop-blur-md relative overflow-hidden transition-all duration-300">
          
          {/* Aesthetic upper corner radial sheen */}
          <div className="absolute left-0 top-0 w-36 h-36 bg-gradient-to-br from-[#0F6E56]/5 rounded-tl-3xl pointer-events-none"></div>

          <div className="relative z-10 text-slate-800">
            {activeModule === "Dashboard" && <DashboardView />}
            {activeModule === "Tasks" && <TasksView />}
            {activeModule === "Comm" && <CommChannelView />}
            {activeModule === "Calendar" && <CalendarView />}
            {activeModule === "Settings" && <SettingsView />}
          </div>
        </section>

        {/* Phase 4: Sub-Assembly Docks Bento Frame */}
        <section id="workspace-assembly-docks">
          <SubModulesPanel />
        </section>

      </main>

      {/* Footer Branding Plaque */}
      <footer className="border-t border-slate-200 bg-white py-5 px-4 text-center text-xs font-mono text-slate-500 relative z-10 uppercase tracking-widest mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-1.5 leading-none">
            <ShieldCheck className="w-4 h-4 text-[#0F6E56]" />
            <span>LanyardQatar Relational ERP Node • Safe State Vault ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span>Active Privileges: <b className="text-[#0F6E56] font-bold">{activeRole} Level</b></span>
            <span>•</span>
            <span>Doha industrial core zone</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}
