/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  Task,
  InventoryItem,
  DesignProof,
  Order,
  DeliveryShipment,
  CommMessage,
  CRMClient,
  SystemLog,
  TaskCategory,
  TaskPriority,
  ProductType
} from "../types";
import {
  DEFAULT_TASKS,
  DEFAULT_INVENTORY,
  DEFAULT_PROOFS,
  DEFAULT_ORDERS,
  DEFAULT_DELIVERIES,
  DEFAULT_MESSAGES,
  DEFAULT_CLIENTS,
  DEFAULT_LOGS
} from "../data/mockData";

interface WorkspaceContextProps {
  // Authentication & Gate
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  biometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentUser: string;
  
  // Navigation Module
  activeModule: "Dashboard" | "Tasks" | "Comm" | "Calendar" | "Settings";
  setActiveModule: (module: "Dashboard" | "Tasks" | "Comm" | "Calendar" | "Settings") => void;

  // Active Submodel (optional view helpers)
  activeSubModule: string | null;
  setActiveSubModule: (subModule: string | null) => void;

  // Relational Collections / SQLite Room Data replicas
  tasks: Task[];
  inventory: InventoryItem[];
  proofs: DesignProof[];
  orders: Order[];
  deliveries: DeliveryShipment[];
  messages: CommMessage[];
  clients: CRMClient[];
  systemLogs: SystemLog[];

  // Mutator Actions (Thread-safe emulation)
  addTask: (title: string, category: TaskCategory, priority: TaskPriority, description: string, customDueDate?: string) => void;
  toggleTaskStatus: (id: string) => void;
  purchaseMaterial: (id: string, rollsQty: number) => void;
  approveDesignProof: (id: string, approverName: string) => void;
  rejectDesignProof: (id: string) => void;
  createNewOrder: (orderData: Omit<Order, "id" | "createdAt" | "totalCostQar" | "designStatus">) => void;
  addCRMClient: (clientData: Omit<CRMClient, "id">) => void;
  addCRMNote: (clientId: string, note: string) => void;
  dispatchShipment: (orderId: string, info: string) => void;
  advanceShipmentStage: (id: string) => void;
  postMessage: (dept: "Logistics" | "Manufacturing" | "Sales Desk" | "Main Office" | "All Departments", text: string) => void;
  addLog: (action: string) => void;
  clearLogs: () => void;
  resetAllData: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication states
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const saved = localStorage.getItem("lanyard_locked");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("lanyard_biometric_enabled");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("lanyard_active_role");
    return (saved as UserRole) || UserRole.Admin;
  });

  const [activeModule, setActiveModule] = useState<"Dashboard" | "Tasks" | "Comm" | "Calendar" | "Settings">("Dashboard");
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null);

  // Collections state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("lanyard_tasks");
    if (saved) {
      try {
        const parsed: Task[] = JSON.parse(saved);
        const seenIds = new Set<string>();
        return parsed.map((item, index) => {
          let uniqueId = item.id;
          if (!uniqueId || seenIds.has(uniqueId)) {
            uniqueId = `TSK-${Date.now().toString().slice(-4)}-${index}-${Math.floor(1000 + Math.random() * 9000)}`;
          }
          seenIds.add(uniqueId);
          return { ...item, id: uniqueId };
        });
      } catch (e) {
        return DEFAULT_TASKS;
      }
    }
    return DEFAULT_TASKS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("lanyard_inventory");
    return saved ? JSON.parse(saved) : DEFAULT_INVENTORY;
  });

  const [proofs, setProofs] = useState<DesignProof[]>(() => {
    const saved = localStorage.getItem("lanyard_proofs");
    return saved ? JSON.parse(saved) : DEFAULT_PROOFS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("lanyard_orders");
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  const [deliveries, setDeliveries] = useState<DeliveryShipment[]>(() => {
    const saved = localStorage.getItem("lanyard_deliveries");
    return saved ? JSON.parse(saved) : DEFAULT_DELIVERIES;
  });

  const [messages, setMessages] = useState<CommMessage[]>(() => {
    const saved = localStorage.getItem("lanyard_messages");
    if (saved) {
      try {
        const parsed: CommMessage[] = JSON.parse(saved);
        const seenIds = new Set<string>();
        return parsed.map((item, index) => {
          let uniqueId = item.id;
          if (!uniqueId || seenIds.has(uniqueId)) {
            uniqueId = `MSG-${Date.now().toString().slice(-4)}-${index}-${Math.floor(1000 + Math.random() * 9000)}`;
          }
          seenIds.add(uniqueId);
          return { ...item, id: uniqueId };
        });
      } catch (e) {
        return DEFAULT_MESSAGES;
      }
    }
    return DEFAULT_MESSAGES;
  });

  const [clients, setClients] = useState<CRMClient[]>(() => {
    const saved = localStorage.getItem("lanyard_clients");
    return saved ? JSON.parse(saved) : DEFAULT_CLIENTS;
  });

  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem("lanyard_logs");
    if (saved) {
      try {
        const parsed: SystemLog[] = JSON.parse(saved);
        const seenIds = new Set<string>();
        return parsed.map((item, index) => {
          let uniqueId = item.id;
          if (!uniqueId || seenIds.has(uniqueId)) {
            uniqueId = `LOG-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 8)}`;
          }
          seenIds.add(uniqueId);
          return { ...item, id: uniqueId };
        });
      } catch (e) {
        return DEFAULT_LOGS;
      }
    }
    return DEFAULT_LOGS;
  });

  // Map users to roles for audit logs
  let currentUser = "System Administrator";
  if (activeRole === UserRole.Sales) currentUser = "Tariq Mahmood (Sales)";
  if (activeRole === UserRole.Design) currentUser = "Aisha Al-Kuwari (Design)";
  if (activeRole === UserRole.Production) currentUser = "Hassan Raza (Production)";

  // Persistent synchronizations
  useEffect(() => {
    localStorage.setItem("lanyard_locked", JSON.stringify(isLocked));
  }, [isLocked]);

  useEffect(() => {
    localStorage.setItem("lanyard_biometric_enabled", JSON.stringify(biometricEnabled));
  }, [biometricEnabled]);

  useEffect(() => {
    localStorage.setItem("lanyard_active_role", activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem("lanyard_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("lanyard_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("lanyard_proofs", JSON.stringify(proofs));
  }, [proofs]);

  useEffect(() => {
    localStorage.setItem("lanyard_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("lanyard_deliveries", JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem("lanyard_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("lanyard_clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("lanyard_logs", JSON.stringify(systemLogs));
  }, [systemLogs]);

  // Action helpers
  const addLog = (actionText: string) => {
    const newLog: SystemLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      actor: currentUser,
      role: activeRole,
      action: actionText,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  const addTask = (title: string, category: TaskCategory, priority: TaskPriority, description: string, customDueDate?: string) => {
    const newTask: Task = {
      id: `TSK-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      category,
      priority,
      status: "Pending",
      dueDate: customDueDate || new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().substring(0, 10), // +3 days
      assignedRole: UserRole.Production,
      description
    };
    setTasks(prev => [newTask, ...prev]);
    addLog(`Created factory task: [${title}] graded ${priority}`);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextStatus = task.status === "Pending" ? "In-Progress" : task.status === "In-Progress" ? "Completed" : "Pending";
          addLog(`Updated task [${task.title}] to status ${nextStatus}`);
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const purchaseMaterial = (id: string, qty: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedQty = item.quantity + qty;
          addLog(`Procured restock: +${qty} ${item.unit} of [${item.name}]`);
          return { ...item, quantity: updatedQty };
        }
        return item;
      })
    );
  };

  const approveDesignProof = (id: string, approverName: string) => {
    setProofs(prev =>
      prev.map(proof => {
        if (proof.id === id) {
          addLog(`Approved technical print proof specs for client [${proof.clientName}]`);
          // Check if associated order exists and update status
          setOrders(ordersPrev =>
            ordersPrev.map(ord => {
              if (ord.id === proof.orderId) {
                return { ...ord, designStatus: "Approved" };
              }
              return ord;
            })
          );
          return { ...proof, status: "Approved", approvedBy: `${approverName} (${activeRole})` };
        }
        return proof;
      })
    );
  };

  const rejectDesignProof = (id: string) => {
    setProofs(prev =>
      prev.map(proof => {
        if (proof.id === id) {
          addLog(`Rejected print specs for client [${proof.clientName}] — pending redesign`);
          return { ...proof, status: "Rejected", approvedBy: null };
        }
        return proof;
      })
    );
  };

  const createNewOrder = (orderData: Omit<Order, "id" | "createdAt" | "totalCostQar" | "designStatus">) => {
    const id = `QORD-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
    
    // Choose active dynamic pricing based on Product Category
    const pType = orderData.productType || ProductType.Lanyards;
    let unitPrice = 10.0; // default backup price

    if (pType === ProductType.Lanyards) {
      const baseCostMultiplier = orderData.width === "15mm" ? 6.5 : orderData.width === "20mm" ? 8.5 : 9.5;
      const clipCost = orderData.clipType?.includes("Carabiner") ? 3.5 : 1.5;
      const safetyCost = orderData.breakawaySafety ? 0.8 : 0;
      unitPrice = baseCostMultiplier + clipCost + safetyCost;
    } else if (pType === ProductType.Badges) {
      const badgeBase = orderData.badgeType === "Plastic ID Card" ? 5.0 : orderData.badgeType === "Metal Badge" ? 11.0 : 8.0;
      const attachmentCost = orderData.badgeAttachment === "Magnetic Bar" ? 1.5 : orderData.badgeAttachment === "Safety Pin" ? 0.5 : 0.8;
      unitPrice = badgeBase + attachmentCost;
    } else if (pType === ProductType.MousePads) {
      const sizeBase = orderData.mousePadSize?.includes("Extended") ? 25.0 : 12.0;
      const thicknessCost = orderData.mousePadThickness === "5mm Pro-Gamer" ? 6.0 : 3.0;
      unitPrice = sizeBase + thicknessCost;
    } else if (pType === ProductType.Mugs) {
      const mugBase = orderData.mugStyle === "Premium Matte Black" ? 22.0 : orderData.mugStyle === "Travel Insulated Mug" ? 30.0 : 15.0;
      const accentCost = orderData.mugAccentColor ? 3.0 : 0.0;
      unitPrice = mugBase + accentCost;
    } else if (pType === ProductType.Pens) {
      const penBase = orderData.penModel === "Premium Metal Rollerball" ? 8.5 : orderData.penModel === "Bamboo Eco-Stylus" ? 3.5 : 1.5;
      unitPrice = penBase; // standard ink choices blue/black are free
    }

    const totalCostQar = Math.round(orderData.quantity * unitPrice);

    const newOrder: Order = {
      ...orderData,
      id,
      productType: pType,
      totalCostQar,
      designStatus: "Pending",
      createdAt: new Date().toISOString().substring(0, 10),
      deliveryDate: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().substring(0, 10) // 15 days out
    };

    setOrders(prev => [newOrder, ...prev]);

    // Automatically trigger a design proof template for this order
    const proofId = `PRF-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
    const mapColors: Record<string, string> = {
      "Qatar Airways": "#5E1933",
      "Education City (QF)": "#0D2C54",
      "Katara Cultural Village": "#DAA520",
      "Msheireb Properties": "#394F49"
    };

    const newProof: DesignProof = {
      id: proofId,
      orderId: id,
      clientName: orderData.clientName,
      lanyardWidth: orderData.width || "20mm",
      strapColorHex: mapColors[orderData.clientName] || "#0F6E56",
      pantoneCode: "PMS 3425 C",
      logoUrl: orderData.isCustomLogo ? "https://images.unsplash.com/photo-1557683316-973673baf926?w=120&auto=format&fit=crop&q=60" : null,
      resolutionDpi: 600,
      status: "Pending",
      approvedBy: null,
      weavingPattern: orderData.width === "25mm" ? "Satin Ribbon" : "Twill"
    };

    setProofs(prev => [newProof, ...prev]);
    addLog(`Calculated invoice & generated new production order [${id}] for [${orderData.clientName}] of product type [${pType}] total value QAR ${totalCostQar.toLocaleString()}`);
  };

  const addCRMClient = (clientData: Omit<CRMClient, "id">) => {
    const id = `CRM-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
    const newClient: CRMClient = {
      ...clientData,
      id
    };
    setClients(prev => [...prev, newClient]);
    addLog(`Registered high-value client lead: [${clientData.companyName}] — Contract QAR ${clientData.contractValueQar.toLocaleString()}`);
  };

  const addCRMNote = (clientId: string, note: string) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          addLog(`Logged interaction note for client [${c.companyName}]`);
          return {
            ...c,
            notes: [...c.notes, note]
          };
        }
        return c;
      })
    );
  };

  const dispatchShipment = (orderId: string, location: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const shipmentId = `DLV-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
    const newShipment: DeliveryShipment = {
      id: shipmentId,
      orderId,
      clientName: order.clientName,
      status: "In-Transit",
      routeStage: 2,
      currentLocation: location,
      eta: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().substring(0, 16).replace("T", " ")
    };

    setDeliveries(prev => [...prev, newShipment]);
    
    // Update order status
    setOrders(ordersPrev =>
      ordersPrev.map(ord => {
        if (ord.id === orderId) {
          return { ...ord, designStatus: "Shipped" };
        }
        return ord;
      })
    );

    addLog(`Dispatched order [${orderId}] to shipping terminal. Current hub: [${location}]`);
  };

  const advanceShipmentStage = (id: string) => {
    setDeliveries(prev =>
      prev.map(sh => {
        if (sh.id === id) {
          const nextStage = sh.routeStage + 1;
          let nextLoc = sh.currentLocation;
          let nextStat: "Warehouse" | "In-Transit" | "Customs" | "Delivered" = sh.status;

          if (nextStage === 3) {
            nextStat = "Customs";
            nextLoc = "Hamad International Port Gateway";
          } else if (nextStage >= 4) {
            nextStat = "Delivered";
            nextLoc = `${sh.clientName} HQ Administrative Offices`;
            // Secure order completion
            setOrders(prevOrders =>
              prevOrders.map(o => (o.id === sh.orderId ? { ...o, designStatus: "Shipped" } : o))
            );
          }

          addLog(`Logistics transit: shipment [${sh.id}] advanced to [${nextLoc}] (${nextStat})`);
          return {
            ...sh,
            routeStage: Math.min(nextStage, 4),
            status: nextStat,
            currentLocation: nextLoc
          };
        }
        return sh;
      })
    );
  };

  const postMessage = (dept: "Logistics" | "Manufacturing" | "Sales Desk" | "Main Office" | "All Departments", text: string) => {
    const newMsg: CommMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      sender: currentUser.split(" (")[0],
      senderRole: activeRole,
      department: dept,
      content: text,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setMessages(prev => [...prev, newMsg]);
    addLog(`Dispatched department message to channel [${dept}]`);
  };

  const clearLogs = () => {
    setSystemLogs([]);
  };

  const resetAllData = () => {
    localStorage.removeItem("lanyard_tasks");
    localStorage.removeItem("lanyard_inventory");
    localStorage.removeItem("lanyard_proofs");
    localStorage.removeItem("lanyard_orders");
    localStorage.removeItem("lanyard_deliveries");
    localStorage.removeItem("lanyard_messages");
    localStorage.removeItem("lanyard_clients");
    localStorage.removeItem("lanyard_logs");

    setTasks(DEFAULT_TASKS);
    setInventory(DEFAULT_INVENTORY);
    setProofs(DEFAULT_PROOFS);
    setOrders(DEFAULT_ORDERS);
    setDeliveries(DEFAULT_DELIVERIES);
    setMessages(DEFAULT_MESSAGES);
    setClients(DEFAULT_CLIENTS);
    setSystemLogs([
      {
        id: "LOG-RST",
        actor: "System Audit",
        role: UserRole.Admin,
        action: "All transactional state databases factory re-seeded offline-first",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
      }
    ]);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        isLocked,
        setIsLocked,
        biometricEnabled,
        setBiometricEnabled,
        activeRole,
        setActiveRole,
        currentUser,
        activeModule,
        setActiveModule,
        activeSubModule,
        setActiveSubModule,
        tasks,
        inventory,
        proofs,
        orders,
        deliveries,
        messages,
        clients,
        systemLogs,
        addTask,
        toggleTaskStatus,
        purchaseMaterial,
        approveDesignProof,
        rejectDesignProof,
        createNewOrder,
        addCRMClient,
        addCRMNote,
        dispatchShipment,
        advanceShipmentStage,
        postMessage,
        addLog,
        clearLogs,
        resetAllData
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
