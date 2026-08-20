import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useLocation } from "@/hooks/use-location";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Map,
  Camera,
  Home,
  Users,
  Wifi,
  WifiOff,
  Shield,
  ChevronRight,
  Zap,
  TrendingUp,
  Clock,
  ArrowUpRight,
  EyeOff,
  Scan,
  UserSearch,
  Siren,
  HandHeart,
  RefreshCw,
} from "lucide-react";

const quickActions = [
  { icon: AlertTriangle, label: "SOS", color: "bg-red-500", path: "/sos", textColor: "text-red-600", bgColor: "bg-red-50" },
  { icon: Map, label: "Rescue Map", color: "bg-emerald-500", path: "/map", textColor: "text-emerald-600", bgColor: "bg-emerald-50" },
  { icon: Camera, label: "Report", color: "bg-amber-500", path: "/disasters", textColor: "text-amber-600", bgColor: "bg-amber-50" },
  { icon: Home, label: "Shelter", color: "bg-blue-500", path: "/shelters", textColor: "text-blue-600", bgColor: "bg-blue-50" },
  { icon: Users, label: "Community", color: "bg-purple-500", path: "/community", textColor: "text-purple-600", bgColor: "bg-purple-50" },
  { icon: Shield, label: "Disasters", color: "bg-teal-500", path: "/disasters", textColor: "text-teal-600", bgColor: "bg-teal-50" },
];

const sampleAlerts = [
  {
    id: 1,
    type: "flood",
    title: "Flash Flood Warning",
    location: "Delhi, Sector 12",
    severity: "high",
    time: "12 min ago",
    affected: 340,
    icon: "💧",
  },
  {
    id: 2,
    type: "fire",
    title: "Building Fire Reported",
    location: "Noida, Block C",
    severity: "critical",
    time: "28 min ago",
    affected: 85,
    icon: "🔥",
  },
  {
    id: 3,
    type: "earthquake",
    title: "Seismic Activity Detected",
    location: "Gurugram, Phase 2",
    severity: "medium",
    time: "1 hr ago",
    affected: 1200,
    icon: "🌍",
  },
  {
    id: 4,
    type: "landslide",
    title: "Road Blocked — Landslide",
    location: "Shimla Highway KM 42",
    severity: "high",
    time: "2 hr ago",
    affected: 60,
    icon: "⛰️",
  },
];

const severityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

function DrishtiLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { isOnline } = useOnlineStatus();
  const { location } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <DrishtiLogo className="h-6 w-6" />
              </div>
              <div>
                <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider">Emergency Command Center</p>
                <h1 className="text-lg font-bold">Drishti</h1>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${isOnline ? "bg-emerald-500/30 text-emerald-100" : "bg-amber-500/30 text-amber-100"}`}>
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? "ONLINE" : "OFFLINE MODE"}
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-100 text-sm mb-4">
            <Map className="h-4 w-4" />
            <span>
              {location
                ? `${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°E`
                : "Locating..."}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-[10px] text-emerald-200 uppercase tracking-wider">Active SOS</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">3</p>
              <p className="text-[10px] text-emerald-200 uppercase tracking-wider">Rescues</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">8</p>
              <p className="text-[10px] text-emerald-200 uppercase tracking-wider">Shelters Open</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        {/* SOS Button */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/sos")}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertTriangle className="h-6 w-6" />
            </motion.div>
            SEND SOS
          </button>
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => navigate(action.path)}
                  className={`w-full ${action.bgColor} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform`}
                >
                  <action.icon className={`h-6 w-6 ${action.textColor}`} />
                  <span className={`text-xs font-semibold ${action.textColor}`}>{action.label}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nearby Alerts */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Nearby Alerts</h2>
            <button
              onClick={() => navigate("/disasters")}
              className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
            >
              View All <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {sampleAlerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{alert.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 text-sm truncate">{alert.title}</h3>
                          <Badge className={`text-[10px] px-1.5 py-0 ${severityColors[alert.severity]}`}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                          <Map className="h-3 w-3" />
                          {alert.location}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {alert.affected} affected
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Invisible Victims — HIGHLIGHTED */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/invisible-victims")}
            className="w-full relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all group"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(239,68,68,0.15),transparent_60%)]" />
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative px-5 py-5">
              {/* Top badge */}
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Critical Feature</span>
              </div>

              {/* Main content row */}
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-red-500/20"
                >
                  <EyeOff className="h-8 w-8 text-red-400" />
                </motion.div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-extrabold text-white mb-0.5 tracking-tight">Invisible Victims</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">People who can't reach emergency services.<br/>Drishti makes them visible to rescue teams.</p>
                </div>
                <div className="text-right shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30"
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-medium">7 offline SOS signals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-medium">2 high-priority zones</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-medium">Live heatmap</span>
                </div>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Other Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate("/hazard-scanner")}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Scan className="h-6 w-6 text-indigo-100" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm">AI Hazard Scanner</p>
                <p className="text-xs text-indigo-200">Detect blocked roads from photos</p>
              </div>
              <ChevronRight className="h-5 w-5 text-indigo-300" />
            </button>
            <button
              onClick={() => navigate("/missing-persons")}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-700 text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <UserSearch className="h-6 w-6 text-violet-100" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm">Missing Persons</p>
                <p className="text-xs text-violet-200">Find & reunite families</p>
              </div>
              <ChevronRight className="h-5 w-5 text-violet-300" />
            </button>
            <button
              onClick={() => navigate("/responder")}
              className="w-full bg-gradient-to-r from-red-700 to-red-800 text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Siren className="h-6 w-6 text-red-200" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm">Responder Dashboard</p>
                <p className="text-xs text-red-200">Command center for rescue teams</p>
              </div>
              <ChevronRight className="h-5 w-5 text-red-300" />
            </button>
            <button
              onClick={() => navigate("/volunteer")}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <HandHeart className="h-6 w-6 text-orange-100" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm">Volunteer Hub</p>
                <p className="text-xs text-orange-200">Accept tasks & help your community</p>
              </div>
              <ChevronRight className="h-5 w-5 text-orange-300" />
            </button>
            <button
              onClick={() => navigate("/sync")}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-cyan-100" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm">Sync Center</p>
                <p className="text-xs text-cyan-200">Manage offline data & sync status</p>
              </div>
              <ChevronRight className="h-5 w-5 text-cyan-300" />
            </button>
          </div>
        </motion.div>

        {/* Offline Mode Banner */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <WifiOff className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-800 text-sm">Offline Mode Active</p>
                <p className="text-xs text-amber-600">Core emergency features remain available.</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
