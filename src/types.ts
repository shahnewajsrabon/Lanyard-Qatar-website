/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  Admin = "Admin",
  Sales = "Sales",
  Design = "Design",
  Production = "Production"
}

export enum TaskCategory {
  FabricCutting = "Fabric Cutting",
  DyeSublimation = "Dye Sublimation",
  AccessoryStitching = "Stitching & Assembly",
  QualityControl = "Quality Control",
  Logistics = "Logistics",
  DesignProofing = "Design Proofing"
}

export enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical"
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: "Pending" | "In-Progress" | "Completed";
  dueDate: string;
  assignedRole: UserRole;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  unit: string;
  category: "Base Strap" | "Breakaway Safety" | "Attachments" | "Dyes & Inks";
  costPerUnit: number; // Qatari Riyal (QAR)
}

export interface DesignProof {
  id: string;
  orderId: string;
  clientName: string;
  lanyardWidth: "15mm" | "20mm" | "25mm";
  strapColorHex: string;
  pantoneCode: string;
  logoUrl: string | null;
  resolutionDpi: number;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy: string | null;
  weavingPattern: "Twill" | "Smooth Polyester" | "Satin Ribbon" | "Nylon Ribbed";
}

export enum ProductType {
  Lanyards = "Lanyards",
  Badges = "Badges",
  MousePads = "Mouse Pads",
  Mugs = "Mugs",
  Pens = "Pens"
}

export interface Order {
  id: string;
  clientName: string;
  quantity: number;
  width?: "15mm" | "20mm" | "25mm";
  lengthCm?: number;
  clipType?: "Lobster Swivel Clip" | "Heavy Duty Carabiner" | "Oval Hook" | "Quick Release Clip" | string;
  breakawaySafety?: boolean;
  totalCostQar: number;
  designStatus: "Pending" | "Approved" | "Weaving" | "Shipped";
  createdAt: string;
  deliveryDate: string;
  isCustomLogo: boolean;
  productType?: ProductType;
  badgeType?: "Plastic ID Card" | "Metal Badge" | "Acrylic VIP Badge" | string;
  badgeAttachment?: "Magnetic Bar" | "Safety Pin" | "Strap Clip" | string;
  mousePadSize?: "Standard (25x20cm)" | "Extended Desk (90x40cm)" | string;
  mousePadThickness?: "3mm Comfort" | "5mm Pro-Gamer" | string;
  mugStyle?: "Classic Ceramic (11oz)" | "Premium Matte Black" | "Travel Insulated Mug" | string;
  mugAccentColor?: boolean;
  penModel?: "Standard Plastic Clicker" | "Premium Metal Rollerball" | "Bamboo Eco-Stylus" | string;
  penInkColor?: "Blue Ink" | "Black Ink" | string;
}

export interface DeliveryShipment {
  id: string;
  orderId: string;
  clientName: string;
  status: "Warehouse" | "In-Transit" | "Customs" | "Delivered";
  routeStage: number; // 0 to 4
  currentLocation: string;
  eta: string;
}

export interface CommMessage {
  id: string;
  sender: string;
  senderRole: UserRole;
  department: "Logistics" | "Manufacturing" | "Sales Desk" | "Main Office" | "All Departments";
  content: string;
  timestamp: string;
}

export interface SystemLog {
  id: string;
  actor: string;
  role: UserRole;
  action: string;
  timestamp: string;
}

export interface CRMClient {
  id: string;
  name: string;
  companyName: string;
  contactNumber: string;
  email: string;
  status: "Lead" | "Active Partner" | "Contract Signed" | "Completed Campaign";
  contractValueQar: number;
  notes: string[];
}
