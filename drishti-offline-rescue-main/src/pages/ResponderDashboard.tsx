import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Navigation,
  Radio,
  Wifi,
  WifiOff,
  Ambulance,
  ChevronRight,
  Phone,
  Heart,
  Zap,
  Siren,
  Route,
  TreePine,
  Home,
  Target,
  Eye,
  EyeOff,
  BarChart3,
  Activity,
  CircleDot,
} from "lucide-react";

// --- Data ---
interface Emergency {
  id: string;
  type: "sos" | "disaster" | "hazard";
  title: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  time: string;
  distance: string;
  peopleCount: number;
  status: "new" | "assigned" | "responding" | "resolved";
  icon: string;
}

interface RescueTeam {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "available" | "responding" | "offline";
  location: string;
}

interface BlockedRoad {
  id: string;
  name: string;
  reason: string;
  since: string;
  detour: string;
}

const sampleEmergencies: Emergency[] = [
  { id: "e1", type: "sos", title: "Family trapped — flood rising", location: "Sector 14, Building 7", severity: "critical", time: "2 min ago", distance: "1.2 km", peopleCount: 4, status: "new", icon: "🔴" },
  { id: "e2", type: "sos", title: "Elderly person, medical emergency", location: "Block C, House 34", severity: "critical", time: "5 min ago", distance: "1.8 km", peopleCount: 1, status: "new", icon: "🔴" },
  { id: "e3", type: "disaster", title: "Building fire spreading", location: "Industrial Area, Block B", severity: "high", time: "15 min ago", distance: "3.4 km", peopleCount: 22, status: "assigned", icon: "🔥" },
  { id: "e4", type: "sos", title: "Child trapped under debris", location: "Old City, Chandni Chowk", severity: "critical", time: "8 min ago", distance: "2.1 km", peopleCount: 1, status: "responding", icon: "🔴" },
  { id: "e5", type: "hazard", title: "Gas leak detected", location: "Phase 3, Market Road", severity: "high", time: "20 min ago", distance: "4.0 km", peopleCount: 50, status: "new", icon: "⚠️" },
  { id: "e6", type: "sos", title: "Injured workers — collapse", location: "Sector 9, Construction Site", severity: "medium", time: "25 min ago", distance: "2.8 km", peopleCount: 3, status: "responding", icon: "🟠" },
];

const sampleTeams: RescueTeam[] = [
  { id: "t1", name: "Alpha Unit", role: "Fire Response", avatar: "🚒", status: "responding", location: "Sector 12" },
  { id: "t2", name: "Bravo Unit", role: "Medical", avatar: "🚑", status: "available", location: "Central Hospital" },
  { id: "t3", name: "Charlie Unit", role: "Search & Rescue", avatar: "🧑‍🚒", status: "available", location: "Station 4" },
  { id: "t4", name: "Delta Unit", role: "Police", avatar: "👮", status: "responding", location: "Block C" },
  { id: "t5", name: "Echo Unit", role: "Volunteer Coord", avatar: "🧑", status: "available", location: "Relief Camp" },
];

const sampleBlockedRoads: BlockedRoad[] = [
  { id: "b1", name: "Sector 12 Main Road", reason: "Flood water — 40cm deep", since: "1 hr ago", detour: "Via Sector 7 ring road (+2.1 km)" },
  { id: "b2", name: "NH-44 Bridge", reason: "Structural damage", since: "2 hr ago", detour: "Via old bridge (+4.5 km)" },
  { id: "b3", name: "Block C Inner Road", reason: "Fallen tree + debris", since: "30 min ago", detour: "Via Block A bypass (+1.2 km)" },
];

const severityStyles: Record<string, string> = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const statusStyles: Record<string, string> = {
  new: "bg-red-100 text-red-700",
  assigned: "bg-amber-100 text-amber-700",
  responding: "bg-blue-100 text-blue-700",
  resolved: "bg-emerald-100 text-emerald-700",
};

// --- Tab type ---
type Tab = "overview" | "emergencies" | "teams" | "roads";

// --- Section Header ---
function SectionHeader({ icon: Icon, title, count, color }: { icon: any; title: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      </div>
      <Badge className="text-[10px] px-2 py-0 bg-slate-100 text-slate-600">{count}</Badge>
    </div>
  );
}

// --- Emergency Card ---
function EmergencyCard({ emergency, index, onRespond }: { emergency: Emergency; index: number; onRespond: (e: Emergency) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`border-slate-100 shadow-sm hover:shadow-md transition-all ${
        emergency.severity === "critical" && emergency.status === "new" ? "ring-1 ring-red-200" : ""
      }`}>
        <CardContent className="p-3.5">
          <div className="flex items-start gap-3">
            <div className="relative">
              <span className="text-xl">{emergency.icon}</span>
              {emergency.status === "new" && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 truncate">{emergency.title}</h3>
                <Badge className={`text-[9px] px-1.5 py-0 ${severityStyles[emergency.severity]}`}>
                  {emergency.severity.toUpperCase()}
                </Badge>
                <Badge className={`text-[9px] px-1.5 py-0 ${statusStyles[emergency.status]}`}>
                  {emergency.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{emergency.location}</span>
                <span className="flex items-center gap-1"><Navigation className="h-2.5 w-2.5" />{emergency.distance}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{emergency.time}</span>
                <span className="flex items-center gap-1"><Users className="h-2.5 w-2.5" />{emergency.peopleCount} people</span>
              </div>
            </div>
            {emergency.status === "new" && (
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0"
                onClick={() => onRespond(emergency)}
              >
                RESPOND
              </Button>
            )}
            {emergency.status === "responding" && (
              <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold shrink-0">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Siren className="h-3 w-3" />
                </motion.div>
                EN ROUTE
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Responding overlay ---
function RespondingOverlay({ emergency, onClose }: { emergency: Emergency; onClose: () => void }) {
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="w-full bg-white rounded-t-3xl overflow-hidden"
      >
        {/* Header with live indicator */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-5 pt-6 pb-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 bg-white rounded-full"
              />
              <span className="text-xs font-bold tracking-wider uppercase">Responding to Emergency</span>
            </div>
            <span className="text-sm font-mono font-bold">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              {emergency.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold mb-0.5">{emergency.title}</h2>
              <p className="text-xs text-red-100 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {emergency.location} · {emergency.distance} away
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-slate-900">{emergency.distance.split(" ")[0]}</p>
              <p className="text-[10px] text-slate-500 uppercase">KM Away</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-red-700">{emergency.peopleCount}</p>
              <p className="text-[10px] text-red-500 uppercase">People</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-amber-700 capitalize">{emergency.severity}</p>
              <p className="text-[10px] text-amber-500 uppercase">Severity</p>
            </div>
          </div>

          {/* Route info */}
          <Card className="border-emerald-100 bg-emerald-50/50">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Route className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-emerald-800">Safe route calculated</p>
                <p className="text-[10px] text-emerald-600">Avoiding 2 blocked roads · ETA {Math.ceil(parseFloat(emergency.distance) * 2.5)} min</p>
              </div>
              <Badge className="text-[9px] bg-emerald-100 text-emerald-700">OPTIMIZED</Badge>
            </CardContent>
          </Card>

          {/* Victim details */}
          <Card className="border-slate-100">
            <CardContent className="p-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Victim Details</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">SOS Type</span>
                  <span className="font-semibold text-slate-900 capitalize">{emergency.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Signal Source</span>
                  <span className="font-semibold text-slate-900">Direct / Mesh</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Priority</span>
                  <Badge className={`text-[9px] ${severityStyles[emergency.severity]}`}>{emergency.severity.toUpperCase()}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Control buttons */}
          <div className="grid grid-cols-3 gap-3 pb-2">
            <button className="flex flex-col items-center gap-1.5 py-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
              <Phone className="h-5 w-5 text-slate-600" />
              <span className="text-[10px] font-semibold text-slate-600">Call Victim</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 py-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
              <Radio className="h-5 w-5 text-slate-600" />
              <span className="text-[10px] font-semibold text-slate-600">Broadcast</span>
            </button>
            <button
              onClick={() => navigate("/ambulance")}
              className="flex flex-col items-center gap-1.5 py-4 bg-red-100 rounded-2xl hover:bg-red-200 transition-colors"
            >
              <Ambulance className="h-5 w-5 text-red-600" />
              <span className="text-[10px] font-semibold text-red-600">Start Rescue</span>
            </button>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Page ---
export default function ResponderDashboard() {
  const { isOnline } = useOnlineStatus();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [respondingTo, setRespondingTo] = useState<Emergency | null>(null);
  const [emergencies, setEmergencies] = useState(sampleEmergencies);

  const newCount = emergencies.filter((e) => e.status === "new").length;
  const respondingCount = emergencies.filter((e) => e.status === "responding").length;
  const availableTeams = sampleTeams.filter((t) => t.status === "available").length;

  const handleRespond = useCallback((emergency: Emergency) => {
    setEmergencies((prev) =>
      prev.map((e) => (e.id === emergency.id ? { ...e, status: "responding" as const } : e))
    );
    setRespondingTo(emergency);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white px-4 pt-12 pb-4 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Responder Command Center</p>
                <h1 className="text-base font-bold">Operations Dashboard</h1>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold ${
              isOnline ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
            }`}>
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? "LIVE" : "OFFLINE"}
            </div>
          </div>

          {/* Live stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <motion.div
              animate={newCount > 0 ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-red-500/20 backdrop-blur rounded-xl p-2.5 text-center"
            >
              <p className="text-xl font-bold text-red-400">{newCount}</p>
              <p className="text-[9px] text-red-300/70 uppercase">New SOS</p>
            </motion.div>
            <div className="bg-blue-500/20 backdrop-blur rounded-xl p-2.5 text-center">
              <p className="text-xl font-bold text-blue-400">{respondingCount}</p>
              <p className="text-[9px] text-blue-300/70 uppercase">Responding</p>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur rounded-xl p-2.5 text-center">
              <p className="text-xl font-bold text-emerald-400">{availableTeams}</p>
              <p className="text-[9px] text-emerald-300/70 uppercase">Teams Free</p>
            </div>
            <div className="bg-amber-500/20 backdrop-blur rounded-xl p-2.5 text-center">
              <p className="text-xl font-bold text-amber-400">{sampleBlockedRoads.length}</p>
              <p className="text-[9px] text-amber-300/70 uppercase">Roads Blocked</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1">
            {([
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "emergencies", label: "Emergencies", icon: AlertTriangle },
              { key: "teams", label: "Teams", icon: Users },
              { key: "roads", label: "Roads", icon: Route },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  tab === t.key ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <t.icon className="h-3 w-3" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2 py-4">
        <AnimatePresence mode="wait">
          {/* Overview */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Active SOS Signals */}
              <div>
                <SectionHeader icon={AlertTriangle} title="Active SOS Signals" count={newCount} color="bg-red-500/20 text-red-400" />
                <div className="space-y-2">
                  {emergencies.filter((e) => e.type === "sos" && e.status === "new").map((e, i) => (
                    <EmergencyCard key={e.id} emergency={e} index={i} onRespond={handleRespond} />
                  ))}
                </div>
              </div>

              {/* High Priority Zones */}
              <div>
                <SectionHeader icon={Target} title="High Priority Zones" count={2} color="bg-orange-500/20 text-orange-400" />
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Sector 14 Flood Zone", sos: 4, people: 12, color: "from-red-500/20 to-red-500/5" },
                    { name: "Old City Collapse", sos: 2, people: 6, color: "from-orange-500/20 to-orange-500/5" },
                  ].map((zone, i) => (
                    <motion.div key={zone.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-3">
                          <p className="text-xs font-bold text-white mb-1">{zone.name}</p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400">
                            <span className="text-red-400 font-bold">{zone.sos} SOS</span>
                            <span>{zone.people} people</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Active Rescue Teams */}
              <div>
                <SectionHeader icon={Users} title="Rescue Teams" count={sampleTeams.length} color="bg-blue-500/20 text-blue-400" />
                <div className="space-y-2">
                  {sampleTeams.map((team, i) => (
                    <motion.div key={team.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-3 flex items-center gap-3">
                          <span className="text-xl">{team.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white">{team.name}</p>
                            <p className="text-[10px] text-slate-400">{team.role} · {team.location}</p>
                          </div>
                          <Badge className={`text-[9px] px-2 py-0 ${
                            team.status === "available" ? "bg-emerald-500/20 text-emerald-400" :
                            team.status === "responding" ? "bg-blue-500/20 text-blue-400" :
                            "bg-slate-500/20 text-slate-400"
                          }`}>
                            {team.status.toUpperCase()}
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Emergencies tab */}
          {tab === "emergencies" && (
            <motion.div key="emergencies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {emergencies.map((e, i) => (
                <EmergencyCard key={e.id} emergency={e} index={i} onRespond={handleRespond} />
              ))}
            </motion.div>
          )}

          {/* Teams tab */}
          {tab === "teams" && (
            <motion.div key="teams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {sampleTeams.map((team, i) => (
                <motion.div key={team.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="bg-white border-slate-100 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{team.avatar}</span>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">{team.name}</p>
                          <p className="text-[11px] text-slate-500">{team.role}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-2.5 w-2.5" /> {team.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-[9px] px-2 py-0 ${
                            team.status === "available" ? "bg-emerald-100 text-emerald-700" :
                            team.status === "responding" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-500"
                          }`}>
                            {team.status.toUpperCase()}
                          </Badge>
                          {team.status === "available" && (
                            <Button size="sm" variant="outline" className="mt-2 text-[10px] h-7 rounded-lg">
                              Assign
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Blocked Roads tab */}
          {tab === "roads" && (
            <motion.div key="roads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">
                  <span className="font-bold">{sampleBlockedRoads.length} roads blocked</span> — auto-rerouting active for all rescue vehicles
                </p>
              </div>
              {sampleBlockedRoads.map((road, i) => (
                <motion.div key={road.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="bg-white border-slate-100 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                          <TreePine className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-slate-900">{road.name}</h3>
                          <p className="text-[11px] text-red-600 font-medium">{road.reason}</p>
                          <div className="mt-2 bg-emerald-50 rounded-lg p-2">
                            <p className="text-[10px] text-emerald-700">
                              <span className="font-bold">Detour:</span> {road.detour}
                            </p>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" /> Blocked since {road.since}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Responding overlay */}
      <AnimatePresence>
        {respondingTo && (
          <RespondingOverlay emergency={respondingTo} onClose={() => setRespondingTo(null)} />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
