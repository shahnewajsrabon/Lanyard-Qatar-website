/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { Settings, Shield, RefreshCw, Trash2, HelpCircle, AlertTriangle } from "lucide-react";

export const SettingsView: React.FC = () => {
  const {
    biometricEnabled,
    setBiometricEnabled,
    clearLogs,
    resetAllData,
    systemLogs,
    activeRole,
    addLog
  } = useWorkspace();

  const handleToggleBiometrics = () => {
    const nextVal = !biometricEnabled;
    setBiometricEnabled(nextVal);
    addLog(`Configured global biometrics security state: [${nextVal ? "ENABLED" : "DISABLED"}]`);
  };

  const handlePurgeLogs = () => {
    clearLogs();
    addLog(`Manual command override: Purged administrative audit trails`);
  };

  const handleFactoryReset = () => {
    const doubleCheck = window.confirm("ATTENTION: This will wipe all local caches, order registries, design approvals, and reset the system database schema back to baseline seeds. Proceed?");
    if (doubleCheck) {
      resetAllData();
    }
  };

  return (
    <div className="space-y-6 font-plus-jakarta text-slate-800">
      
      {/* Header operations descriptor */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Settings &amp; Admin Configurations</h2>
        <p className="text-xs text-slate-500 mt-1">
          Adjust security parameters, manage cryptographic biometric simulators, and perform clean factory resets on local Relational databases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Security Enclave Administration Panel */}
        <div className="card-bg p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-2">
            <Shield className="text-[#0F6E56] w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
              Biometric Hardware Enclave
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The fingerprint simulator uses tactile hold gestures to authenticate secure keys. Toggle this mode on to force active verification on terminal logout.
          </p>

          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-xl">
            <div>
              <span className="text-xs font-bold text-slate-800 font-mono block">TACTILE SCAN OVERLAY</span>
              <span className="text-[10px] text-slate-500">Trigger radial radar scanning gate</span>
            </div>
            
            <button
              onClick={handleToggleBiometrics}
              className={`w-12 h-6.5 rounded-full transition-all relative cursor-pointer ${
                biometricEnabled ? "bg-[#0F6E56] border border-transparent shadow-sm" : "bg-slate-250 border border-slate-300"
              }`}
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-1 transition-all ${
                biometricEnabled ? "right-1" : "left-1"
              }`}></div>
            </button>
          </div>

          <div className="p-3 bg-[#0F6E56]/5 border border-[#0F6E56]/15 rounded-xl text-[11px] text-slate-600 font-medium leading-normal">
            Note: Passcode numeral keyboard authentication (Default PIN: <b>2026</b>) remains active as an absolute fallback bypass at all times.
          </div>
        </div>

        {/* Database Relational Cache Administration */}
        <div className="card-bg p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-2">
            <RefreshCw className="text-amber-600 w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
              Relational SQLite Storage Cache
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Transactions, task dispatch updates, and design proof reviews are preserved in client-side local partitions. Purge them to free memory allocation blocks.
          </p>

          <div className="space-y-2.5">
            {/* Purge Audit Trail Logs */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-xl text-xs">
              <div>
                <span className="font-bold text-slate-800 block uppercase text-[11px]">Audit Logs Matrix</span>
                <span className="text-[10px] text-slate-500 font-mono">Size: {systemLogs.length} logged actions</span>
              </div>

              <button
                disabled={systemLogs.length === 0}
                onClick={handlePurgeLogs}
                className={`py-1.5 px-3.5 rounded-lg text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                  systemLogs.length === 0
                    ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                }`}
              >
                <Trash2 className="w-3 h-3" />
                CLEAR LOGS
              </button>
            </div>

            {/* Factory Resets */}
            <div className="flex items-center justify-between p-3.5 bg-rose-50/40 border-2 border-rose-100 rounded-xl text-xs">
              <div>
                <span className="font-bold text-rose-700 block uppercase text-[11px] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Hard Factory Clear
                </span>
                <span className="text-[10px] text-slate-500 leading-none">Re-seed SQLite standard tables</span>
              </div>

              <button
                onClick={handleFactoryReset}
                className="py-1.5 px-3.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold font-mono tracking-wider transition-all cursor-pointer shadow-sm border border-transparent"
              >
                RESET SCHEMAS
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
