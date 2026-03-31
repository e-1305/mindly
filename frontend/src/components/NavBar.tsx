import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Heart, Users, Settings, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../lib/store";
import clsx from "clsx";

export default function NavBar() {
  const { user } = useAuthStore();
  const { pathname } = useLocation();

  const links =
    user?.role === "hr"
      ? [
          { to: "/hr",       icon: Building2,       label: "Org"      },
          { to: "/settings", icon: Settings,         label: "Settings" },
        ]
      : user?.role === "manager"
      ? [
          { to: "/manager",  icon: Users,            label: "Team"     },
          { to: "/settings", icon: Settings,         label: "Settings" },
        ]
      : [
          { to: "/checkin",   icon: Heart,           label: "Check-in" },
          { to: "/dashboard", icon: LayoutDashboard, label: "My trends" },
          { to: "/settings",  icon: Settings,        label: "Settings" },
        ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <span className="hidden md:block font-bold text-primary-600 text-lg tracking-tight">mindly</span>
      <div className="flex gap-2">
        {links.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} className="relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl text-xs font-medium transition-colors">
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary-50 rounded-2xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ color: active ? "#4f46e5" : "#9ca3af" }}
                transition={{ duration: 0.15 }}
                className="relative z-10"
              >
                <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
              </motion.div>
              <span className={clsx("relative z-10 transition-colors", active ? "text-primary-600" : "text-gray-400")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
