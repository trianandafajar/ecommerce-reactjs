export type MetricTone = "cyan" | "amber" | "emerald" | "rose";

export interface AdminMetric {
  label: string;
  value: string;
  delta: string;
  tone: MetricTone;
  note: string;
}

export interface AdminOrderRow {
  id: string;
  customer: string;
  email: string;
  amount: string;
  status: "Pending" | "Paid" | "Shipped" | "Completed" | "Cancelled";
  updatedAt: string;
}

export interface AdminCustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: string;
  status: "Active" | "Blocked";
  lastSeen: string;
}

export interface AdminProductRow {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: "Published" | "Draft" | "Archived";
  updatedAt: string;
  description: string;
}

export const adminMetrics: AdminMetric[] = [
  {
    label: "Active customers",
    value: "3,782",
    delta: "+11.01%",
    tone: "emerald",
    note: "New signups this month",
  },
  {
    label: "Open orders",
    value: "428",
    delta: "+6.4%",
    tone: "cyan",
    note: "Waiting for fulfillment",
  },
  {
    label: "Revenue",
    value: "$248.9M",
    delta: "+18.2%",
    tone: "amber",
    note: "Compared to last month",
  },
  {
    label: "At-risk orders",
    value: "14",
    delta: "-3.1%",
    tone: "rose",
    note: "Needs follow-up today",
  },
];

export const adminOrders: AdminOrderRow[] = [
  {
    id: "#ORD-24891",
    customer: "Nadia Putri",
    email: "nadia@example.com",
    amount: "$1,490,000",
    status: "Pending",
    updatedAt: "2 min ago",
  },
  {
    id: "#ORD-24890",
    customer: "Bima Santoso",
    email: "bima@example.com",
    amount: "$3,420,000",
    status: "Paid",
    updatedAt: "18 min ago",
  },
  {
    id: "#ORD-24889",
    customer: "Maya Lestari",
    email: "maya@example.com",
    amount: "$820,000",
    status: "Shipped",
    updatedAt: "45 min ago",
  },
  {
    id: "#ORD-24888",
    customer: "Rizky Hidayat",
    email: "rizky@example.com",
    amount: "$760,000",
    status: "Completed",
    updatedAt: "1 hr ago",
  },
  {
    id: "#ORD-24887",
    customer: "Alya Ramadhani",
    email: "alya@example.com",
    amount: "$2,180,000",
    status: "Cancelled",
    updatedAt: "2 hr ago",
  },
];

export const adminCustomers: AdminCustomerRow[] = [
  {
    id: "CUS-201",
    name: "Nadia Putri",
    email: "nadia@example.com",
    phone: "+62 812 3456 7890",
    city: "Bandung",
    orders: "12 orders",
    status: "Active",
    lastSeen: "Active now",
  },
  {
    id: "CUS-202",
    name: "Bima Santoso",
    email: "bima@example.com",
    phone: "+62 813 9876 5432",
    city: "Jakarta",
    orders: "7 orders",
    status: "Active",
    lastSeen: "6 min ago",
  },
  {
    id: "CUS-203",
    name: "Maya Lestari",
    email: "maya@example.com",
    phone: "+62 811 2233 4455",
    city: "Surabaya",
    orders: "5 orders",
    status: "Active",
    lastSeen: "12 min ago",
  },
  {
    id: "CUS-204",
    name: "Rizky Hidayat",
    email: "rizky@example.com",
    phone: "+62 817 5566 7788",
    city: "Yogyakarta",
    orders: "3 orders",
    status: "Blocked",
    lastSeen: "3 days ago",
  },
];

export const adminProducts: AdminProductRow[] = [
  {
    id: "PRD-001",
    name: "Astra Mechanical Keyboard",
    sku: "AST-KEY-001",
    category: "Keyboards",
    price: "$1,450,000",
    stock: 24,
    status: "Published",
    updatedAt: "2 days ago",
    description: "Hot-swappable 75% board with silent tactiles and walnut case.",
  },
  {
    id: "PRD-002",
    name: "Orbit Desk Mat",
    sku: "ORB-MAT-002",
    category: "Accessories",
    price: "$240,000",
    stock: 58,
    status: "Published",
    updatedAt: "7 hours ago",
    description: "Smooth stitched desk mat with anti-slip base.",
  },
  {
    id: "PRD-003",
    name: "Halo Switch Set",
    sku: "HAL-SWT-003",
    category: "Switches",
    price: "$180,000",
    stock: 0,
    status: "Draft",
    updatedAt: "1 day ago",
    description: "Linear switch pack tuned for soft bottoms and long travel.",
  },
  {
    id: "PRD-004",
    name: "Alpine Keycaps",
    sku: "ALP-KCP-004",
    category: "Keycaps",
    price: "$620,000",
    stock: 11,
    status: "Published",
    updatedAt: "5 hours ago",
    description: "PBT keycap set with high-contrast legends.",
  },
  {
    id: "PRD-005",
    name: "Nova Wrist Rest",
    sku: "NOV-WRS-005",
    category: "Accessories",
    price: "$150,000",
    stock: 8,
    status: "Archived",
    updatedAt: "4 days ago",
    description: "Ergonomic foam wrist rest wrapped in easy-clean fabric.",
  },
];

export const orderStages = [
  { label: "Pending", value: 14, accent: "bg-amber-500" },
  { label: "Paid", value: 78, accent: "bg-cyan-500" },
  { label: "Shipped", value: 63, accent: "bg-sky-500" },
  { label: "Completed", value: 89, accent: "bg-emerald-500" },
];
