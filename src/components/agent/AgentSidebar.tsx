"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/agent/dashboard",
  },
  {
    label: "Import Leads",
    href: "/agent/import-leads",
  },
  {
    label: "My Leads",
    href: "/agent/leads",
  },
  {
    label: "Calls",
    href: "/agent/calling",
  },
  {
    label: "Call History",
    href: "/agent/call-history",
  },
];

export default function AgentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b px-6 py-5">
        <h1 className="text-xl font-bold">Call Center</h1>
        <p className="text-sm text-gray-500">Agent Panel</p>
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