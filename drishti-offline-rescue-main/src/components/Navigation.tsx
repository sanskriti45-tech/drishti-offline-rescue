import { NavLink, useLocation } from "react-router";
import { Home, AlertTriangle, Map, Heart, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/sos", icon: AlertTriangle, label: "SOS" },
  { to: "/disasters", icon: Shield, label: "Alerts" },
  { to: "/map", icon: Map, label: "Map" },
  { to: "/shelters", icon: Heart, label: "Shelters" },
  { to: "/community", icon: Users, label: "Community" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-emerald-100 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to === "/dashboard" && location.pathname === "/");

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-0.5 py-1.5 px-3 relative"
            >
              <div
                className={cn(
                  "relative flex flex-col items-center gap-0.5 transition-colors duration-200",
                  isActive ? "text-emerald-600" : "text-gray-400"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    isActive ? "text-emerald-600" : "text-gray-400"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
