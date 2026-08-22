"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Agents",
    href: "/admin/agents",
  },
  {
    label: "Regions",
    href: "/admin/regions",
  },
  {
    label: "All Leads",
    href: "/admin/leads",
  },
  {
    label: "Call Logs",
    href: "/admin/calls",
  },
  {
    label: "Reports",
    href: "/admin/reports",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b px-6 py-5">
        <h1 className="text-xl font-bold">Call Center</h1>
        <p className="text-sm text-gray-500">Admin CRM</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                active
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100">
          Logout
        </button>
      </div>
    </aside>
  );
}