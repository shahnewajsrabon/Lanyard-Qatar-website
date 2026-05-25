/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { TaskCategory, TaskPriority } from "../types";
import { ToggleLeft, PlusCircle, CheckCircle, Circle, AlertCircle, Calendar, AlignLeft, RefreshCcw, Filter } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "motion/react";

const CATEGORY_COLORS: Record<string, string> = {
  [TaskCategory.FabricCutting]: "#06B6D4",      // Teal / Cyan
  [TaskCategory.DyeSublimation]: "#8B5CF6",     // Purple / Indigo
  [TaskCategory.AccessoryStitching]: "#F59E0B", // Amber / Orange
  [TaskCategory.QualityControl]: "#10B981",     // Emerald
  [TaskCategory.Logistics]: "#3B82F6",          // Royal Blue
  [TaskCategory.DesignProofing]: "#8A1538"      // Qatari Burgundy / Maroon
};

export const TasksView: React.FC = () => {
  const {
    tasks,
    addTask,
    toggleTaskStatus,
    activeRole,
    addLog
  } = useWorkspace();

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TaskCategory>(TaskCategory.FabricCutting);
  const [newPriority, setNewPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [newDesc, setNewDesc] = useState("");
  const [newDueDate, setNewDueDate] = useState<string>(() => {
    return new Date().toISOString().substring(0, 10);
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    addTask(newTitle, newCategory, newPriority, newDesc || "No additional workflow details logged.", newDueDate);
    setNewTitle("");
    setNewDesc("");
    setNewDueDate(new Date().toISOString().substring(0, 10));
    setShowAddForm(false);
  };

  // Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchCat = categoryFilter === "All" || task.category === categoryFilter;
    const matchPri = priorityFilter === "All" || task.priority === priorityFilter;
    const matchStat = statusFilter === "All" || 
      (statusFilter === "Completed" && task.status === "Completed") ||
      (statusFilter === "Active" && task.status !== "Completed");
    return matchCat && matchPri && matchStat;
  });

  // Category summary data calculation for Recharts Pie Chart
  const categoryData = Object.values(TaskCategory).map(cat => {
    const matchingTasks = tasks.filter(t => t.category === cat);
    const count = matchingTasks.length;
    const completed = matchingTasks.filter(t => t.status === "Completed").length;
    const active = count - completed;
    return {
      name: cat,
      value: count,
      active,
      completed
    };
  }).filter(data => data.value > 0);

  const getPriorityBadge = (pri: TaskPriority) => {
    switch (pri) {
      case TaskPriority.Critical:
        return "bg-rose-50 text-rose-700 border-rose-200 shadow-sm";
      case TaskPriority.High:
        return "bg-orange-50 text-orange-700 border-orange-200";
      case TaskPriority.Medium:
        return "bg-emerald-50 text-emerald-800 border-emerald-250";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getCategoryColor = (cat: TaskCategory) => {
    switch (cat) {
      case TaskCategory.FabricCutting: return "text-cyan-700";
      case TaskCategory.DyeSublimation: return "text-purple-700";
      case TaskCategory.AccessoryStitching: return "text-amber-700";
      case TaskCategory.QualityControl: return "text-emerald-700";
      case TaskCategory.Logistics: return "text-blue-700";
      case TaskCategory.DesignProofing: return "text-pink-700";
      default: return "text-[#0F6E56]";
    }
  };

  return (
    <div className="space-y-6 font-plus-jakarta text-slate-800">
      
      {/* View Header with Trigger Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Industrial Operations Planner</h2>
          <p className="text-xs text-slate-500 mt-1">
            Supervise assembly task pipelines, calibrate hardware runs, and authorize compliance matrices.
          </p>
        </div>
        
        <button
          id="task-toggle-form-btn"
          onClick={() => {
            setShowAddForm(!showAddForm);
            addLog(`Toggled task dispatch insertion gate`);
          }}
          className="flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0C5844] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer align-middle self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>{showAddForm ? "Close Planner Form" : "Dispatch New Task"}</span>
        </button>
      </div>

      {/* Visual Analytics Hub with Recharts Pie Chart & KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Pie Chart Card */}
        <div className="card-bg p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-[300px] lg:col-span-2 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500">
                Division Workload Split
              </h3>
              <p className="text-[10px] text-slate-400">Task breakdown according to factory execution departments</p>
            </div>
            <span className="text-[9px] font-mono bg-[#0F6E56]/10 px-2 py-0.5 rounded text-[#0F6E56] font-bold">
              REAL-TIME SYNC
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center min-h-0">
            {/* Recharts Container */}
            <div className="h-44 w-full relative flex items-center justify-center">
              {categoryData.length > 0 ? (
                <>
                  <motion.div 
                    className="w-full h-full"
                    initial={{ opacity: 0, scale: 0.88, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.75, ease: "easeOut" }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                          isAnimationActive={true}
                          animationBegin={200}
                          animationDuration={1000}
                          animationEasing="ease-out"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CATEGORY_COLORS[entry.name] || "#64748B"} 
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              const color = CATEGORY_COLORS[data.name] || "#64748B";
                              return (
                                <div className="bg-white border border-slate-200 p-2 text-[11px] font-mono rounded-lg shadow-md space-y-0.5 z-50">
                                  <span className="font-extrabold uppercase block" style={{ color }}>
                                    {data.name}
                                  </span>
                                  <div className="text-slate-600">
                                    <span>Total: <b>{data.value}</b> tasks</span>
                                  </div>
                                  <div className="text-slate-500 flex justify-between gap-4">
                                    <span className="text-emerald-600">✓ Done: {data.completed}</span>
                                    <span className="text-amber-600">● Active: {data.active}</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                  
                  {/* Centered Total Counter */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-x-0 flex flex-col items-center justify-center pointer-events-none"
                  >
                    <span className="text-lg font-black text-slate-900 leading-none">
                      {tasks.length}
                    </span>
                    <span className="text-[8px] font-mono uppercase text-slate-400 font-bold mt-0.5">
                      Tasks
                    </span>
                  </motion.div>
                </>
              ) : (
                <div className="text-xs font-mono text-slate-400">
                  No task distribution data logged
                </div>
              )}
            </div>

            {/* Custom Interactive Legend / Grid list */}
            <div className="space-y-1 overflow-y-auto max-h-44 pr-1 text-xs">
              {categoryData.map((entry, index) => {
                const color = CATEGORY_COLORS[entry.name] || "#64748B";
                const percentage = Math.round((entry.value / tasks.length) * 100) || 0;
                return (
                  <motion.div 
                    key={entry.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                      <span className="font-semibold text-slate-700 truncate max-w-[130px]">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <span className="font-bold text-slate-700">{entry.value}</span>
                      <span>({percentage}%)</span>
                    </div>
                  </motion.div>
                );
              })}
              {categoryData.length === 0 && (
                <p className="text-slate-400 font-mono text-[10px] text-center italic">Create tasks to populate chart split vectors.</p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed KPI Stats Panel */}
        <div className="card-bg p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-[300px] shadow-sm">
          <div className="pb-2 border-b border-slate-100 mb-1">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500">
              Operations Progress index
            </h3>
            <p className="text-[10px] text-slate-400">Status compliance ratios inside database</p>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2 grow">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col justify-center">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Completed</span>
              <span className="text-lg font-black text-emerald-600 block leading-tight mt-1">
                {tasks.filter(t => t.status === "Completed").length}
              </span>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col justify-center">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Active & Queue</span>
              <span className="text-lg font-black text-amber-600 block leading-tight mt-1">
                {tasks.filter(t => t.status !== "Completed").length}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl col-span-2 flex flex-col justify-center">
              <span className="text-[9px] font-mono text-slate-400 block uppercase mb-1">Overall Completion Ratio</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0F6E56] rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((tasks.filter(t => t.status === "Completed").length / (tasks.length || 1)) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[11px] font-bold text-slate-800 font-mono shrink-0">
                  {Math.round((tasks.filter(t => t.status === "Completed").length / (tasks.length || 1)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 italic leading-relaxed pt-2 border-t border-slate-100">
            💡 <b>Efficiency Tip:</b> Set assembly filters below or authorization matrices when workflow limits run tight.
          </div>
        </div>

      </div>

      {/* Task Creation Drawer Form */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="card-bg p-5 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Workflow Insertion Manifest</h3>
            <p className="text-[10px] text-slate-500">Append factory command directly into the Room reactive SQLite state</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-600">Mandate Task Objective *</label>
              <input
                id="task-title-input"
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g., Calibrate Loom 3 Heat transfer rollers"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F6E56]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 font-mono">Operations Class</label>
              <select
                id="task-category-select"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as TaskCategory)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0F6E56]"
              >
                {Object.values(TaskCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 font-mono">Priority Urgency</label>
              <select
                id="task-priority-select"
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as TaskPriority)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0F6E56]"
              >
                {Object.values(TaskPriority).map(prio => (
                  <option key={prio} value={prio}>{prio}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 font-mono">Target Due Date</label>
              <input
                id="task-due-date-input"
                type="date"
                required
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0F6E56] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              {/* Layout helper spacer for 3-column rows */}
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-semibold text-slate-600">Detailed Instructions / Parameters</label>
              <input
                id="task-desc-input"
                type="text"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Specify color codes, target pressure metrics, or regulatory approvals"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F6E56]"
              />
            </div>

          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="task-dispatch-btn"
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F6E56] hover:bg-[#0C5844] transition-all cursor-pointer shadow-sm"
            >
              Dispatch Command Row
            </button>
          </div>
        </form>
      )}

      {/* Structured Filters Dashboard Menu */}
      <div className="card-bg p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono mr-1">
            <Filter className="w-3.5 h-3.5 text-[#0F6E56]" />
            Filters:
          </div>
          
          {/* Status filtering */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {["All", "Active", "Completed"].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#0F6E56] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Division priority filtering */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-white text-xs px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:border-[#0F6E56]"
          >
            <option value="All">All Priorities</option>
            {Object.values(TaskPriority).map(pri => (
              <option key={pri} value={pri}>{pri} Priority</option>
            ))}
          </select>

          {/* Assembly Section filtering */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white text-xs px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:border-[#0F6E56]"
          >
            <option value="All">All Categories</option>
            {Object.values(TaskCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredTasks.length} matching rows
        </span>
      </div>

      {/* Core Operational Planner Queue List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const isCompleted = task.status === "Completed";
          
          const isNearDue = (() => {
            if (isCompleted) return false;
            try {
              const now = new Date();
              const due = new Date(task.dueDate + "T23:59:59");
              if (isNaN(due.getTime())) return false;
              const diffMs = due.getTime() - now.getTime();
              return diffMs <= 24 * 60 * 60 * 1000;
            } catch {
              return false;
            }
          })();

          return (
            <div
              key={task.id}
              id={`task-card-${task.id}`}
              className={`card-bg rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group border ${
                isCompleted 
                  ? "opacity-60 border-slate-100" 
                  : isNearDue
                  ? "border border-rose-500 bg-rose-50/10 ring-1 ring-rose-500/10 hover:shadow-md"
                  : "border border-transparent hover:border-[#0F6E56]/40 hover:shadow-md"
              }`}
            >
              {/* Soft background radial shade */}
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-28 h-28 bg-[#0F6E56]/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>

              {/* Card Meta Row */}
              <div className="flex justify-between items-start gap-4 mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[#0F6E56]">
                    {task.id}
                  </span>
                  <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${getCategoryColor(task.category)}`}>
                    ● {task.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isNearDue && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-rose-600 text-white rounded animate-pulse flex items-center gap-1 uppercase tracking-wider shadow-sm">
                      <AlertCircle className="w-3 h-3" />
                      Near Due
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              {/* Content Description */}
              <div className="mb-4 relative z-10">
                <h4 className={`text-sm font-bold tracking-tight text-slate-900 transition-all ${isCompleted ? "line-through text-slate-400" : ""}`}>
                  {task.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5 font-medium">
                  {task.description}
                </p>
              </div>

              {/* Card Interactive Footer Action */}
              <div className="border-t border-slate-150 pt-3 flex items-center justify-between relative z-10 text-xs font-mono">
                <div className={`flex items-center gap-1.5 font-semibold ${isNearDue ? "text-rose-600 animate-pulse" : "text-slate-400"}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>DUE: {task.dueDate}</span>
                </div>

                {/* Progress checkbox action switch */}
                <button
                  id={`task-toggle-btn-${task.id}`}
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border cursor-pointer ${
                    isCompleted
                      ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                      : task.status === "In-Progress"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completed</span>
                    </>
                  ) : task.status === "In-Progress" ? (
                    <>
                      <AlignLeft className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span>In-Progress</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Queue Draft</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="col-span-full bg-slate-50 border border-slate-200 py-14 text-center rounded-2xl">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">No Matching Logistics Actions Found</h4>
            <p className="text-xs text-slate-500 mt-1">Adjust database query filter constraints above.</p>
          </div>
        )}
      </div>

    </div>
  );
};
