"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  UserPlus,
  CalendarCheck,
  GraduationCap,
} from "lucide-react";
import Cookies from "js-cookie";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Enrollment", href: "/enrollments", icon: UserPlus },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck },
  { name: "Marks", href: "/marks", icon: GraduationCap },
  { name: "Students", href: "/students", icon: Users },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Library", href: "/library", icon: BookOpen },
];
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        SMS ADMIN
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-2 text-red-400 hover:bg-gray-800 rounded"
        >
          <LogOut size={20} />
          LogOut
        </button>
      </div>
    </div>
  );
}
