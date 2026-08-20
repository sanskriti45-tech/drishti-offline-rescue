import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { BottomNav } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Camera,
  ChevronRight,
  Shield,
} from "lucide-react";

interface Disaster {
  id: string;
  type: string;
  title: string;
  location: string;
  severity: string;
  time: string;
  affected: number;
  icon: string;
  status: string;
  description: string;
}

const sampleDisasters: Disaster[] = [
  {
    id: "1",
    type: "flood",
    title: "Flash Floods Submerge Residential Areas",
    location: "Delhi, Sector 12 & 14",
    severity: "critical",
    time: "12 min ago",
    affected: 340,
    icon: "💧",
    status: "Active",
    description: "Rising water levels in residential areas. Multiple families stranded on upper floors.",
  },
  {
    id: "2",
    type: "fire",
    title: "Warehouse Fire Spreading to Adjacent Buildings",
    location: "Noida, Industrial Area Block C",
    severity: "critical",
    time: "28 min ago",
    affected: 85,
    icon: "🔥",
    status: "Active",
    description: "Large fire in industrial warehouse. Smoke affecting nearby residential areas.",
  },
  {
    id: "3",
    type: "earthquake",
    title: "Magnitude 5.2 Earthquake Recorded",
    location: "Gurugram, Phase 2 & 3",
    severity: "high",
    time: "1 hr ago",
    affected: 1200,
    icon: "🌍",
    status: "Active",
    description: "Significant seismic activity. Buildings showing structural cracks. Evacuations underway.",
  },
  {
    id: "4",
    type: "landslide",
    title: "Landslide Blocks Major Highway",
    location: "Shimla Highway KM 42",
    severity: "high",
    time: "2 hr ago",
    affected: 60,
    icon: "⛰️",
    status: "Contained",
    description: "Major landslide blocking highway. Emergency crews working to clear debris.",
  },
  {
    id: "5",
    type: "cyclone",
    title: "Cyclone Expected to Make Landfall",
    location: "Odisha Coast",
    severity: "medium",
    time: "3 hr ago",
    affected: 5000,
    icon: "🌀",
    status: "Active",
    description: "Category 2 cyclone approaching. Evacuations in coastal areas in progress.",
  },
  {
    id: "6",
    type: "flood",
    title: "River Overflowing Near Bridge",
    location: "Faridabad, NH-2 Bridge",
    severity: "medium",
    time: "4 hr ago",
    affected: 200,
    icon: "💧",
    status: "Contained",
    description: "Bridge partially submerged. Traffic diverted. Water levels slowly receding.",
  },
  {
    id: "7",
    type: "collapse",
    title: "Building Partially Collapsed",
    location: "Old Delhi, Chandni Chowk",
    severity: "critical",
    time: "5 hr ago",
    affected: 45,
    icon: "🏚️",
    status: "Active",
    description: "Historical building partially collapsed. Search and rescue operations ongoing.",
  },
];

const severityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const statusColors: Record<string, string> = {
  Active: "bg-red-50 text-red-600 border-red-200",
  Contained: "bg-amber-50 text-amber-600 border-amber-200",
  Resolved: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const typeFilters = ["all", "flood", "fire", "earthquake", "cyclone", "landslide", "collapse"];

export default function DisastersPage() {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const filtered = filter === "all"
    ? sampleDisasters
    : sampleDisasters.filter((d) => d.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Disaster Intelligence</p>
              <h1 className="text-lg font-bold">Recent Disasters</h1>
            </div>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              onClick={() => navigate("/disasters/report")}
            >
              <Camera className="h-4 w-4 mr-1" />
              Report
            </Button>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Shield className="h-3.5 w-3.5" />
            <span>{sampleDisasters.length} active incidents being monitored</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
          {typeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Disaster Cards */}
        <div className="space-y-3">
          {filtered.map((disaster, i) => (
            <motion.div
              key={disaster.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{disaster.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                          {disaster.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-[10px] px-1.5 py-0 ${severityColors[disaster.severity]}`}>
                          {disaster.severity.toUpperCase()}
                        </Badge>
                        <Badge className={`text-[10px] px-1.5 py-0 border ${statusColors[disaster.status]}`}>
                          {disaster.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                        {disaster.description}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {disaster.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {disaster.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {disaster.affected}
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

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-sm font-semibold text-slate-700">No disasters of this type</p>
            <p className="text-xs text-slate-500 mt-1">Try selecting a different filter</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
