import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Search,
  User2,
  UserPen,
} from "lucide-react";

export type SidebarNavSubItem = {
  title: string;
  href: string;
};

export type SidebarNavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subItems?: SidebarNavSubItem[];
};

export const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Proyek",
    href: "/dashboard/proyek",
    icon: FileText,
    subItems: [
      { title: "Proyek", href: "/dashboard/proyek/proyek" },
      { title: "Category", href: "/dashboard/proyek/category" },
      { title: "Framework", href: "/dashboard/proyek/framework" },
    ],
  },
  {
    title: "Manajemen Proyek",
    href: "/dashboard/manajemen-proyek",
    icon: FileText,
    subItems: [
      { title: "Pending", href: "/dashboard/manajemen-proyek/pending" },
      { title: "On Progress", href: "/dashboard/manajemen-proyek/progress" },
      { title: "Revisi", href: "/dashboard/manajemen-proyek/revisi" },
      { title: "Selesai", href: "/dashboard/manajemen-proyek/selesai" },
    ],
  },
  {
    title: "Jadwal & Timeline",
    href: "/dashboard/timeline",
    icon: CalendarDays,
  },
  {
    title: "Management Accounts",
    href: "/dashboard/management-accounts",
    icon: UserPen,
    subItems: [
      { title: "Home", href: "/dashboard/management-accounts/home" },
      { title: "Type", href: "/dashboard/management-accounts/type" },
      { title: "Provider", href: "/dashboard/management-accounts/provider" },
    ],
  },
  {
    title: "Pencarian & Filter",
    href: "/dashboard/filter",
    icon: Search,
  },
];

export const generalNavItems: SidebarNavItem[] = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User2,
  },
];
