import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation as useRouteLocation } from "react-router";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Clock,
  Phone,
  Radio,
  AlertTriangle,
  Ambulance,
  Shield,
  Flame,
  Stethoscope,
  UserCheck,
  CheckCircle,
  XCircle,
  ChevronRight,
  Wifi,
  WifiOff,
  Target,
  Activity,
} from "lucide-react";

// --- Types ---
interface ResponderData {
  id: string;
  type: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  distance: string;
  eta: string;
  status: string;
}

interface VictimPosition {
  lat: number;
  lng: number;
  timestamp: number;
}

// --- Leaflet Map ---
function TrackingMap({
  victimPos,
  responders,
  victimPath,
}: {
  victimPos: { lat: number; lng: number };
  responders: ResponderData[];
  victimPath: { lat: number; lng: number }[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const victimMarkerRef = useRef<any>(null);
  const pathLineRef = useRef<any>(null);
  const responderMarkersRef = useRef<any[]>([]);
  const centerCircleRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let cancelled = false;

    (async () => {
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !mapRef.current) return;

      const L = leaflet.default || leaflet;
      const map = L.map(mapRef.current, {
        center: [victimPos.lat, victimPos.lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: "topright" }).addTo(map);

      // Victim marker (pulsing red dot)
      const victimIcon = L.divIcon({
        className: "victim-marker",
        html: `<div style="position:relative;width:24px;height:24px">
          <div style="position:absolute;inset:0;border-radius:50%;background:#ef4444;opacity:0.2;animation:pulse-ring 1.5s infinite"></div>
          <div style="position:absolute;inset:4px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 2px 8px #ef444488"></div>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const victimMarker = L.marker([victimPos.lat, victimPos.lng], { icon: victimIcon }).addTo(map);
      victimMarker.bindPopup("<b>You are here</b><br>Location tracking active");
      victimMarkerRef.current = victimMarker;

      // Center circle (500m radius)
      const circle = L.circle([victimPos.lat, victimPos.lng], {
        radius: 500,
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.05,
        weight: 1,
        dashArray: "6 4",
      }).addTo(map);
      centerCircleRef.current = circle;

      // Path line
      const pathLine = L.polyline([], { color: "#ef4444", weight: 2, opacity: 0.6, dashArray: "4 4" }).addTo(map);
      pathLineRef.current = pathLine;

      mapInstanceRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update victim marker position
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !victimMarkerRef.current) return;

    (async () => {
      const leaflet = await import("leaflet");
      const L = leaflet.default || leaflet;

      victimMarkerRef.current.setLatLng([victimPos.lat, victimPos.lng]);
      centerCircleRef.current.setLatLng([victimPos.lat, victimPos.lng]);

      if (victimPath.length > 1) {
        pathLineRef.current.setLatLngs(victimPath.map((p) => [p.lat, p.lng]));
      }
    })();
  }, [victimPos, victimPath]);

  // Update responder markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    (async () => {
      const leaflet = await import("leaflet");
      const L = leaflet.default || leaflet;

      // Clear old markers
      responderMarkersRef.current.forEach((m) => m.remove());
      responderMarkersRef.current = [];

      const responderPositions: Record<string, { latOffset: number; lngOffset: number }> = {
        r1: { latOffset: -0.008, lngOffset: 0.006 },
        r2: { latOffset: 0.005, lngOffset: -0.004 },
        r3: { latOffset: -0.012, lngOffset: -0.008 },
        r4: { latOffset: 0.009, lngOffset: 0.01 },
        r5: { latOffset: -0.003, lngOffset: 0.002 },
      };

      responders.forEach((r) => {
        const pos = responderPositions[r.id] || { latOffset: 0.01, lngOffset: 0.01 };
        const lat = victimPos.lat + pos.latOffset;
        const lng = victimPos.lng + pos.lngOffset;

        const iconColors: Record<string, string> = {
          ambulance: "#ef4444",
          police: "#2563eb",
          fire: "#f97316",
          hospital: "#10b981",
          volunteer: "#8b5cf6",
        };

        const iconEmojis: Record<string, string> = {
          ambulance: "🚑",
          police: "👮",
          fire: "🚒",
          hospital: "🏥",
          volunteer: "🧑",
        };

        const icon = L.divIcon({
          className: "responder-marker",
          html: `<div style="width:32px;height:32px;border-radius:50%;background:${iconColors[r.type] || "#666"};border:3px solid white;box-shadow:0 2px 8px ${iconColors[r.type] || "#666"}44;display:flex;align-items:center;justify-content:center;font-size:14px">${iconEmojis[r.type] || "📍"}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${r.name}</b><br>${r.status} · ETA ${r.eta}`);
        responderMarkersRef.current.push(marker);
      });
    })();
  }, [responders, victimPos]);

  return <div ref={mapRef} className="h-full w-full" />;
}

// --- Responder status card ---
function ResponderStatusCard({ responder, index }: { responder: ResponderData; index: number }) {
  const Icon = responder.icon;

  const statusColors: Record<string, string> = {
    acknowledged: "bg-blue-100 text-blue-700",
    dispatched: "bg-purple-100 text-purple-700",
    en_route: "bg-emerald-100 text-emerald-700",
    arrived: "bg-emerald-600 text-white",
    notified: "bg-amber-100 text-amber-700",
  };

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}>
      <Card className="border-slate-100 shadow-sm">
        <CardContent className="p-3 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${responder.bgColor}`}>
            <Icon className={`h-4 w-4 ${responder.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{responder.name}</p>
            <p className="text-[10px] text-slate-400">{responder.distance} · ETA {responder.eta}</p>
          </div>
          <Badge className={`text-[9px] px-2 py-0 ${statusColors[responder.status] || "bg-slate-100 text-slate-600"}`}>
            {responder.status.replace("_", " ").toUpperCase()}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Main Page ---
export default function SOSTrackingPage() {
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  const { isOnline } = useOnlineStatus();

  const state = routeLocation.state as {
    sosLocation?: { lat: number; lng: number };
    responders?: ResponderData[];
    severity?: string;
    peopleCount?: number;
  } | null;

  const baseLocation = state?.sosLocation || { lat: 28.6139, lng: 77.209 };
  const initialResponders = state?.responders || [];

  const [victimPos, setVictimPos] = useState(baseLocation);
  const [victimPath, setVictimPath] = useState<{ lat: number; lng: number }[]>([baseLocation]);
  const [responders, setResponders] = useState<ResponderData[]>(
    initialResponders.length > 0
      ? initialResponders
      : [
          { id: "r1", type: "ambulance", name: "Ambulance Unit 7", icon: Ambulance, color: "text-red-600", bgColor: "bg-red-50", distance: "1.2 km", eta: "4 min", status: "dispatched" },
          { id: "r2", type: "police", name: "Sector 14 Police", icon: Shield, color: "text-blue-600", bgColor: "bg-blue-50", distance: "0.8 km", eta: "3 min", status: "en_route" },
          { id: "r3", type: "fire", name: "Fire Station Unit 3", icon: Flame, color: "text-orange-600", bgColor: "bg-orange-50", distance: "2.1 km", eta: "6 min", status: "dispatched" },
          { id: "r4", type: "hospital", name: "City Hospital ER", icon: Stethoscope, color: "text-emerald-600", bgColor: "bg-emerald-50", distance: "1.8 km", eta: "5 min", status: "acknowledged" },
          { id: "r5", type: "volunteer", name: "Volunteer Alpha", icon: UserCheck, color: "text-purple-600", bgColor: "bg-purple-50", distance: "0.5 km", eta: "2 min", status: "en_route" },
        ]
  );

  const [elapsed, setElapsed] = useState(0);
  const [isTracking, setIsTracking] = useState(true);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate victim GPS movement
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setVictimPos((prev) => {
        const newLat = prev.lat + (Math.random() - 0.5) * 0.0003;
        const newLng = prev.lng + (Math.random() - 0.5) * 0.0003;
        const newPos = { lat: newLat, lng: newLng };
        setVictimPath((path) => [...path.slice(-50), newPos]);
        return newPos;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isTracking]);

  // Simulate responders getting closer
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setResponders((prev) =>
        prev.map((r) => {
          if (r.status === "arrived") return r;

          const distNum = parseFloat(r.distance);
          const newDist = Math.max(0, distNum - (Math.random() * 0.15 + 0.05));
          const etaNum = parseInt(r.eta);
          const newEta = Math.max(0, etaNum - 1);

          let newStatus = r.status;
          if (newDist < 0.2 && r.status !== "arrived") newStatus = "arrived";
          else if (newDist < 0.5 && r.status === "dispatched") newStatus = "en_route";

          return {
            ...r,
            distance: `${newDist.toFixed(1)} km`,
            eta: `${newEta} min`,
            status: newStatus,
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  const arrivedCount = responders.filter((r) => r.status === "arrived").length;

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white px-4 pt-10 pb-3 shrink-0">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-emerald-200 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2.5 h-2.5 bg-red-400 rounded-full" />
              <span className="text-xs font-bold tracking-wider">LIVE TRACKING</span>
            </div>
            <span className="text-sm font-mono font-bold">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-100 text-[10px]">
            <MapPin className="h-3 w-3" />
            <span>{victimPos.lat.toFixed(5)}°N, {victimPos.lng.toFixed(5)}°E</span>
            <span className="text-emerald-300">· GPS Active</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative mx-4 -mt-1 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <TrackingMap victimPos={victimPos} responders={responders} victimPath={victimPath} />

        {/* Overlay: arrived banner */}
        <AnimatePresence>
          {arrivedCount > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-3 left-3 right-3 z-[1000]">
              <div className="bg-emerald-600 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-lg">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span className="text-xs font-bold">{arrivedCount} responder{arrivedCount !== 1 ? "s" : ""} arrived at your location</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow" />
              <span className="text-[9px] text-slate-600 font-medium">You</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full border border-white shadow" />
              <span className="text-[9px] text-slate-600 font-medium">Police</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow" />
              <span className="text-[9px] text-slate-600 font-medium">Ambulance</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full border border-white shadow" />
              <span className="text-[9px] text-slate-600 font-medium">Fire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="shrink-0 bg-white border-t border-slate-200 px-4 py-3">
        <div className="max-w-lg mx-auto">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">
                {responders.filter((r) => r.status !== "notified").length} Responders Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="flex items-center gap-1 text-emerald-600">
                  <Wifi className="h-3 w-3" />
                  <span className="text-[10px] font-bold">LIVE</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-600">
                  <WifiOff className="h-3 w-3" />
                  <span className="text-[10px] font-bold">OFFLINE</span>
                </div>
              )}
            </div>
          </div>

          {/* Responder list (compact) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {responders.filter((r) => r.status !== "notified").map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div key={r.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border whitespace-nowrap shrink-0 ${
                    r.status === "arrived" ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${r.color}`} />
                  <span className="text-[10px] font-bold text-slate-700">{r.name.split(" ").slice(0, 2).join(" ")}</span>
                  <span className="text-[9px] text-slate-400">· {r.eta}</span>
                  {r.status === "arrived" && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                </motion.div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <button className="flex flex-col items-center gap-1 py-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
              <Phone className="h-4 w-4 text-slate-600" />
              <span className="text-[9px] font-bold text-slate-600">Call Help</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
              <Radio className="h-4 w-4 text-slate-600" />
              <span className="text-[9px] font-bold text-slate-600">Broadcast</span>
            </button>
            <button
              onClick={() => setIsTracking(!isTracking)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-colors ${
                isTracking ? "bg-emerald-100" : "bg-slate-100"
              }`}
            >
              <Target className={`h-4 w-4 ${isTracking ? "text-emerald-600" : "text-slate-600"}`} />
              <span className={`text-[9px] font-bold ${isTracking ? "text-emerald-600" : "text-slate-600"}`}>
                {isTracking ? "Tracking" : "Paused"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
