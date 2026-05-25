/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { UserRole } from "../types";
import { Fingerprint, ShieldAlert, ShieldCheck, HelpCircle, Lock, Delete, Users } from "lucide-react";

export const BiometricGate: React.FC = () => {
  const {
    isLocked,
    setIsLocked,
    biometricEnabled,
    activeRole,
    setActiveRole,
    addLog
  } = useWorkspace();

  const [enteredPass, setEnteredPass] = useState<string>("");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [authError, setAuthError] = useState<string>("");

  const CORRECT_PASSCODE = "2026";

  // Simulate Biometric Scanning Pad
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanState === "scanning") {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanState("success");
            setTimeout(() => {
              setIsLocked(false);
              addLog(`Authenticated successfully via Biometric Enclave Scan`);
            }, 800);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [scanState, setIsLocked]);

  const handleKeyPress = (num: string) => {
    setAuthError("");
    if (enteredPass.length < 4) {
      const nextPass = enteredPass + num;
      setEnteredPass(nextPass);
      
      // Auto-validate once 4 digits are typed
      if (nextPass === CORRECT_PASSCODE) {
        setTimeout(() => {
          setIsLocked(false);
          addLog(`Authenticated successfully via Numerical Security Code Entry`);
        }, 300);
      } else if (nextPass.length === 4) {
        setTimeout(() => {
          setScanState("error");
          setAuthError("Incorrect system authorization passcode");
          setEnteredPass("");
          setTimeout(() => setScanState("idle"), 1500);
        }, 200);
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPass(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setEnteredPass("");
    setAuthError("");
  };

  const toggleRoleSelectionObj = (role: UserRole) => {
    setActiveRole(role);
    addLog(`Changed target terminal authentication matrix to: [${role}]`);
  };

  return (
    <div id="biometric-gate-container" className="min-h-screen bg-[#F3F7F5] flex flex-col items-center justify-center p-4 relative overflow-hidden font-plus-jakarta text-slate-800">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 glow-emerald rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 glow-emerald rounded-full pointer-events-none"></div>

      {/* Main Enclave Card Frame */}
      <div id="enclave-card" className="w-full max-w-md card-bg rounded-3xl p-6 shadow-[0_12px_40px_rgba(15,110,86,0.06)] backdrop-blur-md relative z-10 transition-all duration-300">
        
        {/* Top Branding Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#0F6E56]/5 border border-[#0F6E56]/15 px-3 py-1.5 rounded-full mb-3 text-[#0F6E56] text-xs font-mono uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#0F6E56] animate-pulse"></span>
            Hardware Secured: LanyardQatar ERP
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            LanyardQatar ERP Portal
          </h1>
          <p className="text-slate-500 text-xs">
            Automated Corporate Operations &amp; Logistics System
          </p>
        </div>

        {/* Dynamic Display Indicators */}
        <div className="flex flex-col items-center mb-6">
          {/* Diagnostic Fingerprint Scanner Frame */}
          {biometricEnabled ? (
            <div className="w-40 h-40 flex flex-col items-center justify-center relative mb-4">
              
              {/* Pulsing Radar Rings */}
              {scanState === "scanning" && (
                <div className="absolute inset-0 rounded-full border border-[#0F6E56]/30 animate-ping"></div>
              )}
              {scanState === "success" && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 scale-105 duration-500"></div>
              )}

              {/* Pad Frame */}
              <button
                id="tactile-scanning-pad"
                disabled={scanState === "scanning"}
                onMouseDown={() => setScanState("scanning")}
                onTouchStart={() => setScanState("scanning")}
                onMouseUp={() => scanState === "scanning" && setScanState("idle")}
                onTouchEnd={() => scanState === "scanning" && setScanState("idle")}
                className={`w-32 h-32 rounded-full border flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                  scanState === "scanning"
                    ? "border-[#0F6E56] bg-[#0F6E56]/15 shadow-[0_0_25px_rgba(15,110,86,0.15)] scale-95"
                    : scanState === "success"
                    ? "border-emerald-500 bg-emerald-50 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                    : scanState === "error"
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 bg-slate-50 hover:border-[#0F6E56] hover:bg-[#0F6E56]/5"
                }`}
              >
                <Fingerprint
                  className={`w-12 h-12 transition-all duration-300 ${
                    scanState === "scanning"
                      ? "text-[#0F6E56]"
                      : scanState === "success"
                      ? "text-emerald-600 scale-110"
                      : scanState === "error"
                      ? "text-red-500 animate-bounce"
                      : "text-slate-400"
                  }`}
                />
                
                {scanState === "scanning" ? (
                  <span className="text-[10px] font-mono text-[#0F6E56] mt-1.5 animate-pulse">
                    Scanning {scanProgress}%
                  </span>
                ) : scanState === "success" ? (
                  <span className="text-[10px] font-mono text-emerald-600 mt-1.5 font-semibold">
                    Authorized
                  </span>
                ) : scanState === "error" ? (
                  <span className="text-[10px] font-mono text-red-500 mt-1.5">
                    Error
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-500 mt-1.5 tracking-tight group-hover:text-slate-800">
                    Press &amp; Hold
                  </span>
                )}
              </button>

              {/* Circular Progress Border */}
              {scanState === "scanning" && (
                <svg className="absolute inset-0 w-40 h-40 transform -rotate-90 pointer-events-none">
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="#0F6E56"
                    strokeWidth="3.5"
                    strokeDasharray={427}
                    strokeDashoffset={427 - (427 * scanProgress) / 100}
                    fill="transparent"
                    className="transition-all duration-150 ease-out"
                  />
                </svg>
              )}
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
              <Lock className="w-10 h-10 text-[#0F6E56]" />
            </div>
          )}

          {/* Bullet-Style Passcode Indicator Dots */}
          <div className="flex justify-center items-center gap-3.5 my-2">
            {[0, 1, 2, 3].map(idx => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                  idx < enteredPass.length
                    ? "bg-[#0F6E56] border-[#0F6E56] scale-125 shadow-[0_0_10px_rgba(15,110,86,0.2)]"
                    : "bg-white border-slate-300"
                }`}
              ></div>
            ))}
          </div>
          
          {authError ? (
            <p className="text-rose-600 text-xs mt-2 text-center bg-rose-50 px-3 py-1 rounded border border-rose-250 font-mono">
              {authError}
            </p>
          ) : (
            <p className="text-slate-500 text-xs mt-1.5 font-mono">
              {enteredPass ? `Registering key codes...` : `Enter secure local PIN`}
            </p>
          )}
        </div>

        {/* Passcode Numerical Grid Keypad */}
        <div className="grid grid-cols-3 gap-2 px-4 mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="py-3 text-lg font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl transition-all active:scale-95 shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="py-3 text-xs tracking-wider uppercase font-mono font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-95 flex items-center justify-center border border-transparent"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            className="py-3 text-lg font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-3 text-lg font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-sm"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Role-Based Access Control (RBAC) Matrix Selection */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center gap-2 mb-3 text-slate-700 text-xs font-semibold justify-center">
            <Users className="w-4 h-4 text-[#0F6E56]" />
            ROLE CREDENTIAL CLASSIFICATION matrix
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {[UserRole.Admin, UserRole.Sales, UserRole.Design, UserRole.Production].map((role) => (
              <button
                key={role}
                onClick={() => toggleRoleSelectionObj(role)}
                className={`py-2 px-2.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${
                  activeRole === role
                    ? "bg-[#0F6E56]/10 border-[#0F6E56] text-[#0F6E56] shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-800"
                }`}
              >
                <span>{role}</span>
                {activeRole === role && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56]" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setEnteredPass("2026");
                setTimeout(() => {
                  setIsLocked(false);
                  addLog(`Bypassed lockscreen via Admin Developer Code`);
                }, 300);
              }}
              className="text-[10px] text-slate-500 hover:text-[#0F6E56] underline font-mono cursor-pointer transition-colors"
            >
              Master Bypass pin: 2026
            </button>
          </div>
        </div>

      </div>

      {/* Corporate Footnote */}
      <p className="text-[10px] text-slate-400 font-mono mt-6 uppercase tracking-widest text-center">
        Doha Industrial Core Area • Secure Relational State Client
      </p>
    </div>
  );
};
