/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserRole,
  Task,
  TaskCategory,
  TaskPriority,
  InventoryItem,
  DesignProof,
  Order,
  DeliveryShipment,
  CommMessage,
  CRMClient,
  SystemLog,
  ProductType
} from "../types";

export const DEFAULT_TASKS: Task[] = [
  {
    id: "TSK-001",
    title: "Verify Weaving Specs for QP-942",
    category: TaskCategory.FabricCutting,
    priority: TaskPriority.High,
    status: "Completed",
    dueDate: "2026-05-24",
    assignedRole: UserRole.Production,
    description: "Align loom speed to accommodate 20mm premium woven lanyard specs."
  },
  {
    id: "TSK-002",
    title: "Approve Qatar Airways VIP Mockup",
    category: TaskCategory.DesignProofing,
    priority: TaskPriority.Critical,
    status: "In-Progress",
    dueDate: "2026-05-26",
    assignedRole: UserRole.Design,
    description: "Review color gamut calibration for deep maroon silk-finish lanyards."
  },
  {
    id: "TSK-003",
    title: "Verify Breakway Tensile Tests",
    category: TaskCategory.QualityControl,
    priority: TaskPriority.Medium,
    status: "Pending",
    dueDate: "2026-05-27",
    assignedRole: UserRole.Production,
    description: "Sample check breakaway clips for safety compliance with health sector standards."
  },
  {
    id: "TSK-004",
    title: "Schedule Education City Delivery Truck",
    category: TaskCategory.Logistics,
    priority: TaskPriority.High,
    status: "Pending",
    dueDate: "2026-05-28",
    assignedRole: UserRole.Admin,
    description: "Coordinate entry permits for diplomatic logistics vehicles at Gate 3."
  },
  {
    id: "TSK-051",
    title: "Refocalize Dye Sublimation Press Temp",
    category: TaskCategory.DyeSublimation,
    priority: TaskPriority.High,
    status: "Pending",
    dueDate: "2026-05-29",
    assignedRole: UserRole.Production,
    description: "Pre-heat transfer plate to exactly 195°C to avoid color bleeding under high humidity."
  },
  {
    id: "TSK-052",
    title: "Calibrate Stitching Machine Needle Force",
    category: TaskCategory.AccessoryStitching,
    priority: TaskPriority.Medium,
    status: "Completed",
    dueDate: "2026-05-25",
    assignedRole: UserRole.Production,
    description: "Calibrated needle depth for dual-row heavy-duty stitch on trigger-hooks."
  }
];

export const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: "INV-101",
    name: "Pure Polyester Strap Roll (20mm, White)",
    quantity: 145,
    minStock: 25,
    unit: "rolls",
    category: "Base Strap",
    costPerUnit: 180
  },
  {
    id: "INV-102",
    name: "Premium Nylon Ribbon Roll (15mm, Pearl Blue)",
    quantity: 18,
    minStock: 20,
    unit: "rolls",
    category: "Base Strap",
    costPerUnit: 220
  },
  {
    id: "INV-103",
    name: "Safe-Snap Breakway Couplers (Buckles)",
    quantity: 4500,
    minStock: 1000,
    unit: "pieces",
    category: "Breakaway Safety",
    costPerUnit: 0.8
  },
  {
    id: "INV-104",
    name: "Premium Swivel Trigger Clips (Heavy Metal)",
    quantity: 3200,
    minStock: 1500,
    unit: "pieces",
    category: "Attachments",
    costPerUnit: 1.40
  },
  {
    id: "INV-105",
    name: "Military-Grade Aluminum Carabiners",
    quantity: 850,
    minStock: 500,
    unit: "pieces",
    category: "Attachments",
    costPerUnit: 3.50
  },
  {
    id: "INV-106",
    name: "Maroon-D68 Dye Sub Ink (Premium Base)",
    quantity: 12,
    minStock: 5,
    unit: "liters",
    category: "Dyes & Inks",
    costPerUnit: 480
  }
];

export const DEFAULT_PROOFS: DesignProof[] = [
  {
    id: "PRF-201",
    orderId: "QORD-401",
    clientName: "Qatar Airways",
    lanyardWidth: "20mm",
    strapColorHex: "#5E1933", // Burgundy maroon
    pantoneCode: "PMS 222 C",
    logoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&auto=format&fit=crop&q=60",
    resolutionDpi: 600,
    status: "Pending",
    approvedBy: null,
    weavingPattern: "Twill"
  },
  {
    id: "PRF-202",
    orderId: "QORD-402",
    clientName: "Education City (QF)",
    lanyardWidth: "15mm",
    strapColorHex: "#0D2C54", // Qatar Foundation Deep Blue
    pantoneCode: "PMS 295 C",
    logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&auto=format&fit=crop&q=60",
    resolutionDpi: 300,
    status: "Approved",
    approvedBy: "Fatima Al-Thani (Admin)",
    weavingPattern: "Smooth Polyester"
  },
  {
    id: "PRF-203",
    orderId: "QORD-403",
    clientName: "Msheireb Properties",
    lanyardWidth: "25mm",
    strapColorHex: "#394F49", // Operations Deep Teal Accent
    pantoneCode: "PMS 5477 C",
    logoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&auto=format&fit=crop&q=60",
    resolutionDpi: 600,
    status: "Pending",
    approvedBy: null,
    weavingPattern: "Satin Ribbon"
  }
];

export const DEFAULT_ORDERS: Order[] = [
  {
    id: "QORD-401",
    clientName: "Qatar Airways",
    productType: ProductType.Lanyards,
    quantity: 5000,
    width: "20mm",
    lengthCm: 90,
    clipType: "Lobster Swivel Clip",
    breakawaySafety: true,
    totalCostQar: 42500,
    designStatus: "Pending",
    createdAt: "2026-05-20",
    deliveryDate: "2026-06-15",
    isCustomLogo: true
  },
  {
    id: "QORD-402",
    clientName: "Education City (QF)",
    productType: ProductType.Lanyards,
    quantity: 2500,
    width: "15mm",
    lengthCm: 85,
    clipType: "Oval Hook",
    breakawaySafety: true,
    totalCostQar: 21250,
    designStatus: "Approved",
    createdAt: "2026-05-18",
    deliveryDate: "2026-06-05",
    isCustomLogo: true
  },
  {
    id: "QORD-403",
    clientName: "Katara Cultural Village",
    productType: ProductType.Lanyards,
    quantity: 1200,
    width: "25mm",
    lengthCm: 95,
    clipType: "Heavy Duty Carabiner",
    breakawaySafety: false,
    totalCostQar: 11400,
    designStatus: "Weaving",
    createdAt: "2026-05-22",
    deliveryDate: "2026-06-10",
    isCustomLogo: false
  },
  {
    id: "QORD-404",
    clientName: "Msheireb Properties",
    productType: ProductType.Lanyards,
    quantity: 4000,
    width: "20mm",
    lengthCm: 90,
    clipType: "Quick Release Clip",
    breakawaySafety: true,
    totalCostQar: 34800,
    designStatus: "Pending",
    createdAt: "2026-05-24",
    deliveryDate: "2026-06-20",
    isCustomLogo: true
  },
  {
    id: "QORD-405",
    clientName: "Msheireb Properties",
    productType: ProductType.Badges,
    quantity: 1500,
    badgeType: "Metal Badge",
    badgeAttachment: "Magnetic Bar",
    totalCostQar: 18750,
    designStatus: "Approved",
    createdAt: "2026-05-25",
    deliveryDate: "2026-06-12",
    isCustomLogo: true
  },
  {
    id: "QORD-406",
    clientName: "Qatar Airways",
    productType: ProductType.Mugs,
    quantity: 800,
    mugStyle: "Classic Ceramic (11oz)",
    mugAccentColor: true,
    totalCostQar: 14400,
    designStatus: "Pending",
    createdAt: "2026-05-25",
    deliveryDate: "2026-06-18",
    isCustomLogo: true
  }
];

export const DEFAULT_DELIVERIES: DeliveryShipment[] = [
  {
    id: "DLV-301",
    orderId: "QORD-402",
    clientName: "Education City (QF)",
    status: "In-Transit",
    routeStage: 2, // 2 out of 4 (In customs/local clearing)
    currentLocation: "Wathnan Logistics Gate",
    eta: "2026-06-05 10:00"
  },
  {
    id: "DLV-302",
    orderId: "QORD-403",
    clientName: "Katara Cultural Village",
    status: "Warehouse",
    routeStage: 1, // At local production warehouse finishing stitching
    currentLocation: "Salwa Industrial Zone Plant 2",
    eta: "2026-06-10 14:30"
  }
];

export const DEFAULT_MESSAGES: CommMessage[] = [
  {
    id: "MSG-501",
    sender: "Tariq Mahmood",
    senderRole: UserRole.Sales,
    department: "Sales Desk",
    content: "Qatar Airways logistics office requested confirmation on the deep maroon safety snaps color matching. Can design verify?",
    timestamp: "2026-05-25 12:15"
  },
  {
    id: "MSG-502",
    sender: "Aisha Al-Kuwari",
    senderRole: UserRole.Design,
    department: "Main Office",
    content: "Validated maroon dye batch PM-222 against VIP guidelines. We are ready to run print proofs when the sales manager flags QP-942.",
    timestamp: "2026-05-25 12:44"
  },
  {
    id: "MSG-503",
    sender: "Hassan Raza",
    senderRole: UserRole.Production,
    department: "Manufacturing",
    content: "Loom 4 warp is re-threaded. Beginning fabric test for Katara Cultural Village. Standard layout, 25mm black nylon.",
    timestamp: "2026-05-25 13:10"
  }
];

export const DEFAULT_CLIENTS: CRMClient[] = [
  {
    id: "CRM-801",
    name: "Khalid Al-Shafi",
    companyName: "Qatar Airways",
    contactNumber: "+974 4449 6111",
    email: "khalid@qatarairways.com.qa",
    status: "Active Partner",
    contractValueQar: 245000,
    notes: ["Prefers fast-release trigger snaps", "Requires high-density satin lanyards for executive staff"]
  },
  {
    id: "CRM-802",
    name: "Dr. Fatima Al-Khor",
    companyName: "Education City (QF)",
    contactNumber: "+974 4454 0000",
    email: "f.alkhor@qf.org.qa",
    status: "Contract Signed",
    contractValueQar: 112000,
    notes: ["Require breakaway couplers for safety policy", "Delivery requested directly to Student Center"]
  },
  {
    id: "CRM-803",
    name: "Yousef Al-Malki",
    companyName: "Katara Cultural Village",
    contactNumber: "+974 4408 0000",
    email: "y.almalki@katara.global",
    status: "Active Partner",
    contractValueQar: 78500,
    notes: ["Logo stamp must use high-opacity screen print", "Black carabiners attachment requested"]
  },
  {
    id: "CRM-804",
    name: "Jassim Al-Sowaidi",
    companyName: "Msheireb Properties",
    contactNumber: "+974 4009 6666",
    email: "jassim.s@msheireb.com",
    status: "Lead",
    contractValueQar: 154000,
    notes: ["Eco-friendly recycled polyester options requested"]
  }
];

export const DEFAULT_LOGS: SystemLog[] = [
  {
    id: "LOG-001",
    actor: "Hassan Raza",
    role: UserRole.Production,
    action: "Calibrated needle depth for heavy-duty dual stitching",
    timestamp: "2026-05-25 11:30"
  },
  {
    id: "LOG-002",
    actor: "Aisha Al-Kuwari",
    role: UserRole.Design,
    action: "Generated active print-gantry spectrum settings",
    timestamp: "2026-05-25 12:45"
  },
  {
    id: "LOG-003",
    actor: "System Audit",
    role: UserRole.Admin,
    action: "Database initialized under secure local hardware simulation",
    timestamp: "2026-05-25 13:57"
  }
];
