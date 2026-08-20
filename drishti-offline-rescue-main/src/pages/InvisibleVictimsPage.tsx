import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useLocation } from "@/hooks/use-location";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Radio,
  Zap,
  Users,
  AlertTriangle,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  MapPin,
  Wifi,
  WifiOff,
  Shield,
  ChevronRight,
  Target,
  Activity,
} from "lucide-react";

// --- Leaflet imports (dynamic) ---
import type L from "leaflet";

interface SOSPoint {
  id: string;
  lat: number;
  lng: number;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: number;
  peopleCount: number;
  label: string;
}

interface PriorityZone {
  id: string;
  centerLat: number;
  centerLng: number;
  radius: number;
  level: "low" | "medium" | "high";
  pointCount: number;
  label: string;
}

// --- Leaflet Map Component ---
function HeatmapMap({
  center,
  sosPoints,
  zones,
  selectedZone,
}: {
  center: [number, number];
  sosPoints: SOSPoint[];
  zones: PriorityZone[];
  selectedZone: string | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    (async () => {
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !mapRef.current) return;

      const L = leaflet.default || leaflet;
      const map = L.map(mapRef.current, {
        center,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);
      mapInstanceRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center]);

  // Update zones (heatmap circles)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old circles
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];

    (async () => {
      const leaflet = await import("leaflet");
      const L = leaflet.default || leaflet;

      zones.forEach((zone) => {
        const color =
          zone.level === "high"
            ? "#ef4444"
            : zone.level === "medium"
            ? "#f59e0b"
            : "#3b82f6";
        const fillOpacity = zone.level === "high" ? 0.35 : zone.level === "medium" ? 0.25 : 0.15;

        const circle = L.circle([zone.centerLat, zone.centerLng], {
          radius: zone.radius * 1000,
          color,
          fillColor: color,
          fillOpacity,
          weight: selectedZone === zone.id ? 3 : 1.5,
          dashArray: zone.level === "high" ? undefined : "6 4",
        }).addTo(map);
        circlesRef.current.push(circle);
      });
    })();
  }, [zones, selectedZone]);

  // Update SOS markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    (async () => {
      const leaflet = await import("leaflet");
      const L = leaflet.default || leaflet;

      sosPoints.forEach((point) => {
        const color =
          point.severity === "critical"
            ? "#dc2626"
            : point.severity === "high"
            ? "#ea580c"
            : point.severity === "medium"
            ? "#d97706"
            : "#2563eb";

        const icon = L.divIcon({
          className: "custom-sos-marker",
          html: `<div style="
            width:28px;height:28px;border-radius:50%;
            background:${color};
            border:3px solid white;
            box-shadow:0 2px 8px ${color}66;
            display:flex;align-items:center;justify-content:center;
            font-size:10px;color:white;font-weight:bold;
          ">SOS</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([point.lat, point.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="padding:4px;font-family:system-ui">
              <div style="font-weight:600;font-size:13px">${point.label}</div>
              <div style="font-size:11px;color:#666;margin-top:2px">${point.peopleCount} people · ${point.severity.toUpperCase()}</div>
            </div>`
          );
        markersRef.current.push(marker);
      });
    })();
  }, [sosPoints]);

  return <div ref={mapRef} className="h-full w-full rounded-2xl" />;
}

// --- Zone detail panel ---
function ZoneDetail({
  zone,
  points,
  onClose,
}: {
  zone: PriorityZone;
  points: SOSPoint[];
  onClose: () => void;
}) {
  const zonePoints = points.filter((p) => {
    const dist = haversineDistance(zone.centerLat, zone.centerLng, p.lat, p.lng);
    return dist <= zone.radius;
  });

  const totalPeople = zonePoints.reduce((sum, p) => sum + p.peopleCount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-0 left-0 right-0 z-[1000]"
    >
      <Card className="mx-4 mb-4 border-0 shadow-2xl rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  zone.level === "high"
                    ? "bg-red-500"
                    : zone.level === "medium"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
              />
              <h3 className="font-bold text-slate-900 text-sm">{zone.label}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-red-50 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-red-700">{zonePoints.length}</p>
              <p className="text-[10px] text-red-500 uppercase tracking-wider">SOS Signals</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-amber-700">{totalPeople}</p>
              <p className="text-[10px] text-amber-500 uppercase tracking-wider">People</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-blue-700">{zone.radius}km</p>
              <p className="text-[10px] text-blue-500 uppercase tracking-wider">Radius</p>
            </div>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {zonePoints.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    p.severity === "critical"
                      ? "bg-red-500"
                      : p.severity === "high"
                      ? "bg-orange-500"
                      : p.severity === "medium"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                />
                <span className="text-xs text-slate-700 flex-1">{p.label}</span>
                <span className="text-[10px] text-slate-400">{p.peopleCount}p</span>
              </div>
            ))}
          </div>

          <Button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold">
            <Shield className="h-4 w-4 mr-1.5" />
            Dispatch Rescue Team
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Simulation controls ---
function SimulationPanel({
  isSimulating,
  onStart,
  onReset,
  pointCount,
  zoneCount,
}: {
  isSimulating: boolean;
  onStart: () => void;
  onReset: () => void;
  pointCount: number;
  zoneCount: number;
}) {
  return (
    <Card className="border-emerald-100 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Play className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Simulation Mode</h3>
            <p className="text-[10px] text-slate-500">Demo for hackathon judges</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-slate-900">{pointCount}</p>
            <p className="text-[10px] text-slate-500 uppercase">SOS Signals</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-slate-900">{zoneCount}</p>
            <p className="text-[10px] text-slate-500 uppercase">Priority Zones</p>
          </div>
        </div>

        <div className="space-y-2">
          {!isSimulating ? (
            <Button
              onClick={onStart}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-500/20"
            >
              <Zap className="h-4 w-4 mr-2" />
              Simulate Offline SOS
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Radio className="h-4 w-4" />
              </motion.div>
              <span className="text-sm font-semibold">Simulating SOS signals...</span>
            </div>
          )}
          {pointCount > 0 && (
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full rounded-xl"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Simulation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Priority legend ---
function PriorityLegend() {
  return (
    <div className="flex items-center gap-4 px-1">
      {[
        { color: "bg-red-500", label: "High Priority" },
        { color: "bg-amber-500", label: "Medium" },
        { color: "bg-blue-400", label: "Low" },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
          <span className="text-[10px] text-slate-500 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// --- Stats bar ---
function StatsBar({ sosPoints, zones }: { sosPoints: SOSPoint[]; zones: PriorityZone[] }) {
  const totalPeople = sosPoints.reduce((sum, p) => sum + p.peopleCount, 0);
  const criticalCount = sosPoints.filter(
    (p) => p.severity === "critical" || p.severity === "high"
  ).length;

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center">
        <p className="text-xl font-bold text-red-600">{sosPoints.length}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Offline SOS</p>
      </div>
      <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center">
        <p className="text-xl font-bold text-amber-600">{totalPeople}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">People at Risk</p>
      </div>
      <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center">
        <p className="text-xl font-bold text-emerald-600">{zones.length}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Rescue Zones</p>
      </div>
    </div>
  );
}

// --- Haversine distance helper ---
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- Generate random SOS points around a center ---
function generateSOSPoints(
  centerLat: number,
  centerLng: number,
  count: number
): SOSPoint[] {
  const severities: Array<"low" | "medium" | "high" | "critical"> = [
    "low",
    "medium",
    "high",
    "critical",
  ];
  const labels = [
    "Stranded family",
    "Injured person",
    "Trapped residents",
    "Flooded home",
    "Collapsed structure",
    "Blocked exit",
    "Medical emergency",
    "Elderly couple",
    "Children trapped",
    "Power outage zone",
    "Gas leak suspected",
    "Water rising fast",
  ];

  return Array.from({ length: count }, (_, i) => {
    const offsetLat = (Math.random() - 0.5) * 0.04;
    const offsetLng = (Math.random() - 0.5) * 0.04;
    return {
      id: `sim_${Date.now()}_${i}`,
      lat: centerLat + offsetLat,
      lng: centerLng + offsetLng,
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: Date.now() - Math.floor(Math.random() * 3600000),
      peopleCount: Math.floor(Math.random() * 8) + 1,
      label: labels[Math.floor(Math.random() * labels.length)],
    };
  });
}

// --- Build priority zones from SOS points ---
function buildZones(points: SOSPoint[]): PriorityZone[] {
  if (points.length === 0) return [];

  // Cluster by proximity (simple grid-based)
  const gridSize = 0.015; // ~1.5km grid
  const clusters: Map<string, SOSPoint[]> = new Map();

  points.forEach((p) => {
    const key = `${Math.round(p.lat / gridSize)}_${Math.round(p.lng / gridSize)}`;
    if (!clusters.has(key)) clusters.set(key, []);
    clusters.get(key)!.push(p);
  });

  const zones: PriorityZone[] = [];
  clusters.forEach((cluster, key) => {
    if (cluster.length < 1) return;

    const avgLat = cluster.reduce((s, p) => s + p.lat, 0) / cluster.length;
    const avgLng = cluster.reduce((s, p) => s + p.lng, 0) / cluster.length;

    const criticalCount = cluster.filter(
      (p) => p.severity === "critical" || p.severity === "high"
    ).length;

    let level: "low" | "medium" | "high" = "low";
    if (criticalCount >= 3 || cluster.length >= 5) level = "high";
    else if (criticalCount >= 1 || cluster.length >= 3) level = "medium";

    zones.push({
      id: `zone_${key}`,
      centerLat: avgLat,
      centerLng: avgLng,
      radius: level === "high" ? 2.5 : level === "medium" ? 1.8 : 1.2,
      level,
      pointCount: cluster.length,
      label:
        level === "high"
          ? "HIGH PRIORITY RESCUE ZONE"
          : level === "medium"
          ? "Medium Priority Zone"
          : "Low Priority Area",
    });
  });

  return zones.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.level] - order[b.level];
  });
}

// --- Main Page ---
export default function InvisibleVictimsPage() {
  const { location } = useLocation();
  const navigate = useNavigate();
  const [sosPoints, setSOSPoints] = useState<SOSPoint[]>([]);
  const [zones, setZones] = useState<PriorityZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const center: [number, number] = location
    ? [location.latitude, location.longitude]
    : [28.6139, 77.209];

  const runSimulation = useCallback(async () => {
    setIsSimulating(true);

    // Generate points in waves
    const wave1 = generateSOSPoints(center[0], center[1], 3);
    setSOSPoints(wave1);
    setZones(buildZones(wave1));
    await new Promise((r) => setTimeout(r, 800));

    const wave2 = generateSOSPoints(center[0], center[1], 4);
    const all1 = [...wave1, ...wave2];
    setSOSPoints(all1);
    setZones(buildZones(all1));
    await new Promise((r) => setTimeout(r, 800));

    const wave3 = generateSOSPoints(center[0], center[1], 3);
    const all2 = [...all1, ...wave3];
    setSOSPoints(all2);
    setZones(buildZones(all2));

    setIsSimulating(false);
  }, [center]);

  const resetSimulation = useCallback(() => {
    setSOSPoints([]);
    setZones([]);
    setSelectedZone(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white px-4 pt-10 pb-4 shrink-0">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center">
                <EyeOff className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h1 className="text-base font-bold">Invisible Victims</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  People who cannot reach emergency services
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-red-500/20 text-red-300 px-2.5 py-1 rounded-full text-[10px] font-semibold">
              <EyeOff className="h-3 w-3" />
              {sosPoints.length} OFFLINE
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Stats */}
        <div className="px-4 pt-3 pb-2 shrink-0">
          <StatsBar sosPoints={sosPoints} zones={zones} />
        </div>

        {/* Map */}
        <div className="flex-1 mx-4 mb-2 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
          <HeatmapMap
            center={center}
            sosPoints={sosPoints}
            zones={zones}
            selectedZone={selectedZone}
          />

          {/* Legend overlay */}
          <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
            <PriorityLegend />
          </div>

          {/* Zone detail panel */}
          <AnimatePresence>
            {selectedZone && (
              <ZoneDetail
                zone={zones.find((z) => z.id === selectedZone)!}
                points={sosPoints}
                onClose={() => setSelectedZone(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Bottom controls */}
        <div className="px-4 pb-4 pt-1 shrink-0 space-y-3">
          {/* Explanation card */}
          {sosPoints.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="border-slate-100 shadow-sm bg-white/80 backdrop-blur">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Eye className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-0.5">
                      No invisible victims detected
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      When people send SOS without internet, their signals become
                      invisible. Use the simulation to see how Drishti makes them
                      visible to rescue teams.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Zone list */}
          {zones.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() =>
                    setSelectedZone(selectedZone === zone.id ? null : zone.id)
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedZone === zone.id
                      ? zone.level === "high"
                        ? "bg-red-50 border-red-300 text-red-700"
                        : zone.level === "medium"
                        ? "bg-amber-50 border-amber-300 text-amber-700"
                        : "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      zone.level === "high"
                        ? "bg-red-500"
                        : zone.level === "medium"
                        ? "bg-amber-500"
                        : "bg-blue-400"
                    }`}
                  />
                  {zone.label}
                  <span className="text-[10px] opacity-70">({zone.pointCount})</span>
                </button>
              ))}
            </div>
          )}

          {/* Simulation panel */}
          <SimulationPanel
            isSimulating={isSimulating}
            onStart={runSimulation}
            onReset={resetSimulation}
            pointCount={sosPoints.length}
            zoneCount={zones.length}
          />
        </div>
      </div>
    </div>
  );
}
