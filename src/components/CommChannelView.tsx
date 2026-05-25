/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { UserRole } from "../types";
import { MessageSquare, Send, Users, Activity, HelpCircle, ShieldAlert } from "lucide-react";

export const CommChannelView: React.FC = () => {
  const {
    messages,
    postMessage,
    activeRole,
    currentUser,
    addLog
  } = useWorkspace();

  const [activeDept, setActiveDept] = useState<
    "Logistics" | "Manufacturing" | "Sales Desk" | "Main Office" | "All Departments"
  >("All Departments");
  
  const [typedText, setTypedText] = useState("");

  const departments: ("Logistics" | "Manufacturing" | "Sales Desk" | "Main Office" | "All Departments")[] = [
    "All Departments",
    "Logistics",
    "Manufacturing",
    "Sales Desk",
    "Main Office"
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim()) return;

    // Use current active department as fallback sender destination
    const targetDept = activeDept === "All Departments" ? "All Departments" : activeDept;
    postMessage(targetDept, typedText);
    setTypedText("");
  };

  const filteredMessages = messages.filter(msg => {
    if (activeDept === "All Departments") return true;
    return msg.department === activeDept;
  });

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin: return "text-rose-700 bg-rose-50 border-rose-200";
      case UserRole.Sales: return "text-blue-700 bg-blue-50 border-blue-250";
      case UserRole.Design: return "text-purple-700 bg-purple-50 border-purple-250";
      case UserRole.Production: return "text-[#0F6E56] bg-emerald-50 border-emerald-250";
      default: return "text-[#0F6E56] bg-[#0F6E56]/5 border-[#0F6E56]/20";
    }
  };

  return (
    <div className="space-y-6 font-plus-jakarta text-slate-800">
      
      {/* Header section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Team Communication Channel</h2>
        <p className="text-xs text-slate-500 mt-1">
          Coordinate logistics manifests, dispatch dye sub status reports, and alert factory looms about custom print parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Department Station List Selector */}
        <div className="card-bg p-4 rounded-2xl space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono block px-1.5 mb-2">
            Workspace Terminals
          </span>
          <div className="flex flex-col gap-1.5">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  setActiveDept(dept);
                  addLog(`Focused communications terminal channel: [${dept}]`);
                }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold uppercase font-mono tracking-tight border transition-all flex items-center justify-between cursor-pointer ${
                  activeDept === dept
                    ? "bg-[#0F6E56] border-transparent text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{dept}</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">
                  {dept === "All Departments" 
                    ? messages.length 
                    : messages.filter(m => m.department === dept).length}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 mt-3.5 space-y-1 text-[11px] text-slate-500 font-medium px-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Station Intel</span>
            <p>Messaging logs cached locally. Inter-department tags alert appropriate staff.</p>
          </div>
        </div>

        {/* Messaging Box Panel */}
        <div className="card-bg p-5 rounded-2xl lg:col-span-3 flex flex-col justify-between min-h-[460px]">
          
          {/* Header identifier */}
          <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0F6E56]" />
              <span className="text-xs tracking-wider font-bold uppercase font-mono text-slate-800">
                {activeDept} Live Broadcast
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#0F6E56] animate-pulse" />
              <span>LOGS CAPTURING STABLE</span>
            </div>
          </div>

          {/* Dynamic Feed list */}
          <div className="flex-1 space-y-4 max-h-80 overflow-y-auto pr-1 customize-scrollbar flex flex-col justify-end">
            <div className="space-y-4">
              {filteredMessages.map((msg) => {
                const isSentByMe = currentUser.startsWith(msg.sender);
                return (
                  <div key={msg.id} className={`flex gap-3.5 items-start ${isSentByMe ? "flex-row-reverse" : ""}`}>
                    
                    {/* Compact Avatar Circle */}
                    <div className="w-8.5 h-8.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-[#0F6E56] uppercase shrink-0 shadow-sm">
                      {msg.sender.slice(0, 2)}
                    </div>

                    {/* Message Bubble box wrapper */}
                    <div className="space-y-1 max-w-[80%]">
                      <div className={`flex items-center gap-2 text-[11px] text-slate-500 font-mono ${isSentByMe ? "justify-end text-right" : ""}`}>
                        <span className="text-slate-800 font-bold">{msg.sender}</span>
                        <span className={`px-1.5 rounded text-[9px] border uppercase font-bold leading-normal ${getRoleBadgeStyle(msg.senderRole)}`}>
                          {msg.senderRole}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp.split(" ")[1]}</span>
                      </div>
                      
                      <div className={`rounded-2xl p-3 text-xs leading-relaxed ${
                        isSentByMe
                          ? "bg-[#0F6E56] text-white rounded-tr-none shadow-sm"
                          : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-150"
                      }`}>
                        <div className={`font-mono text-[9px] uppercase font-bold tracking-wider mb-1 ${
                          isSentByMe ? "text-emerald-250" : "text-[#0F6E56]"
                        }`}>
                          Tag: {msg.department}
                        </div>
                        <p>{msg.content}</p>
                      </div>
                    </div>

                  </div>
                );
              })}

              {filteredMessages.length === 0 && (
                <div className="py-16 text-center text-slate-400 text-xs font-mono">
                  No logistics correspondence recorded in the {activeDept} branch
                </div>
              )}
            </div>
          </div>

          {/* Prompt Message Bar */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-200 pt-4 mt-4 flex items-center gap-3">
            <div className="bg-slate-50 text-[10px] font-mono border border-slate-200 px-3 py-2 rounded-xl text-slate-600 max-w-[120px] shrink-0 text-center uppercase tracking-tight hidden sm:block">
              POST AS: <span className="text-[#0F6E56] font-bold block">{activeRole}</span>
            </div>

            <input
              type="text"
              required
              value={typedText}
              onChange={e => setTypedText(e.target.value)}
              placeholder={`Post operational advisory message to ${activeDept}...`}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-[#0F6E56]"
            />

            <button
              type="submit"
              className="p-2.5 bg-[#0F6E56] hover:bg-[#0C5844] rounded-xl text-white shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
              title="Broadcast message"
            >
              <Send className="w-4.5 h-4.5 text-emerald-300" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
