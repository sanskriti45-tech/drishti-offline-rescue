import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useLocation } from "@/hooks/use-location";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  AlertTriangle,
  Home,
  Shield,
  RotateCcw,
  Filter,
  ChevronRight,
} from "lucide-react";

// Dynamic import for Leaflet to avoid SSR issues
function MapView({ center, markers }: { center: [number, number]; markers: MapMarker[] }) {
  const [MapContainer, setMapContainer] = useState<React.ComponentType<any> | null>(null);
  const [TileLayer, setTileLayer] = useState<React.ComponentType<any> | null>(null);
  const [Marker, setMarker] = useState<React.ComponentType<any> | null>(null);
  const [Popup, setPopup] = useState<React.ComponentType<any> | null>(null);
  const [Ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      import("react-leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([rl]) => {
      setMapContainer(() => rl.MapContainer);
      setTileLayer(() => rl.TileLayer);
      setMarker(() => rl.Marker);
      setPopup(() => rl.Popup);
      setReady(true);
    });
  }, []);

  if (!Ready || !MapContainer || !TileLayer || !Marker || !Popup) {
    return (
      <div className="h-[50vh] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-2"
          />
          <p className="text-sm text-slate-500">Loading map...</p>
        </div>
      </div>
    );
  }

  const MC = MapContainer;
  const TL = TileLayer;
  const MR = Marker;
  const PP = Popup;

  return (
    <div className="h-[50vh] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <MC
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TL
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <MR key={m.id} position={[m.lat, m.lng]}>
            <PP>
              <div className="text-center p-1">
                <p className="font-semibold text-sm">{m.label}</p>
                <p className="text-xs text-slate-500">{m.description}</p>
              </div>
            </PP>
          </MR>
        ))}
      </MC>
    </div>
  );
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  description: string;
  type: "victim" | "shelter" | "risk" | "safe";
}

const sampleMarkers: MapMarker[] = [
  { id: "1", lat: 28.62, lng: 77.21, label: "SOS Signal", description: "2 people, high priority", type: "victim" },
  { id: "2", lat: 28.60, lng: 77.23, label: "Community Shelter", description: "Open, 80/200 capacity", type: "shelter" },
  { id: "3", lat: 28.61, lng: 77.19, label: "Flood Zone", description: "High risk, road blocked", type: "risk" },
  { id: "4", lat: 28.63, lng: 77.22, label: "Safe Route", description: "Clear road to hospital", type: "safe" },
  { id: "5", lat: 28.59, lng: 77.24, label: "Medical Center", description: "Emergency services available", type: "safe" },
  { id: "6", lat: 28.64, lng: 77.20, label: "SOS Signal", description: "1 person, critical", type: "victim" },
];

const markerStyles = {
  victim: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "🔴" },
  shelter: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "🏠" },
  risk: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "⚠️" },
  safe: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "🟢" },
};

export default function MapPage() {
  const { location } = useLocation();
  const { isOnline } = useOnlineStatus();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const center: [number, number] = location
    ? [location.latitude, location.longitude]
    : [28.6139, 77.209];

  const filteredMarkers = filter === "all"
    ? sampleMarkers
    : sampleMarkers.filter((m) => m.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-bold mb-1">Rescue Map</h1>
          <p className="text-emerald-200 text-xs">
            {isOnline ? "Live updates active" : "Offline — showing cached data"}
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2">
        {/* Map */}
        <div className="mb-4">
          <MapView center={center} markers={filteredMarkers} />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
          {[
            { key: "all", label: "All", icon: "📍" },
            { key: "victim", label: "Victims", icon: "🔴" },
            { key: "risk", label: "Risks", icon: "⚠️" },
            { key: "shelter", label: "Shelters", icon: "🏠" },
            { key: "safe", label: "Safe Routes", icon: "🟢" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f.key
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
              }`}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Map Markers ({filteredMarkers.length})
          </h2>
          <button
            onClick={() => navigate("/map")}
            className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="h-3 w-3" /> Center
          </button>
        </div>

        {/* Marker List */}
        <div className="space-y-2">
          {filteredMarkers.map((marker, i) => {
            const style = markerStyles[marker.type];
            return (
              <motion.div
                key={marker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`border ${style.border} shadow-sm`}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="text-xl">{style.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${style.text}`}>{marker.label}</p>
                      <p className="text-xs text-slate-500">{marker.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="rounded-2xl py-6 flex flex-col items-center gap-2 border-emerald-200 hover:bg-emerald-50"
            onClick={() => navigate("/sos")}
          >
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-xs font-semibold">Report SOS</span>
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl py-6 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50"
            onClick={() => navigate("/shelters")}
          >
            <Home className="h-5 w-5 text-blue-500" />
            <span className="text-xs font-semibold">Find Shelter</span>
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
