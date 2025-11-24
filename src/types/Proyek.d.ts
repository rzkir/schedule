import { Timestamp } from "firebase/firestore";

interface Link {
  id: string;
  label: string;
  url: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface depositList {
  id: string;
  label: string;
  price: number;
  percent: number;
}
interface frameworkList {
  name: string;
}

interface accountsList {
  label: string;
  email: string;
  password: string;
}

interface Proyek {
  id: string;
  title: string;
  description: string;
  start_date: Timestamp;
  end_date: Timestamp;
  status: "draft" | "published" | "archived";
  progres: "pending" | "progress" | "revisi" | "selesai";
  category: string;
  thumbnail: string;
  framework: string[];
  nama_user: string;
  accounts: accountsList[];
  price: number;
  deposit: depositList[];
  link: Link[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Categories
interface categories {
  id: string;
  name: string;
  createdAt: Timestamp | null;
}

// Framework
interface frameworks {
  id: string;
  name: string;
  createdAt: Timestamp | null;
}
