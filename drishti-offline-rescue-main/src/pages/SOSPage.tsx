import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useLocation } from "@/hooks/use-location";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  WifiOff,
  CheckCircle,
  X,
  MapPin,
  Users,
  Heart,
  Zap,
  ArrowLeft,
  Radio,
  Ambulance,
  Shield,
  Flame,
  Stethoscope,
  UserCheck,
  ChevronRight,
  Navigation,
  Phone,
  Clock,
} from "lucide-react";
import { saveOffline, generateOfflineId } from "@/lib/offline-db";

type SOSStep =
  | "idle"
  | "confirm"
  | "details"
  | "sending"
  | "notifying"
  | "sent"
  | "tracking"
  | "mesh";

// --- Responder types ---
interface Responder {
  id: string;
  type: "hospital" | "police" | "fire" | "ambulance" | "volunteer";
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  distance: string;
  eta: string;
  status: "notified" | "acknowledged" | "dispatched" | "en_route" | "arrived";
}

const initialResponders: Responder[] = [
  { id: "r1", type: "ambulance", name: "Ambulance Unit 7", icon: Ambulance, color: "text-red-600", bgColor: "bg-red-50", distance: "1.2 km", eta: "4 min", status: "notified" },
  { id: "r2", type: "police", name: "Sector 14 Police Station", icon: Shield, color: "text-blue-600", bgColor: "bg-blue-50", distance: "0.8 km", eta: "3 min", status: "notified" },
  { id: "r3", type: "fire", name: "Fire Station Unit 3", icon: Flame, color: "text-orange-600", bgColor: "bg-orange-50", distance: "2.1 km", eta: "6 min", status: "notified" },
  { id: "r4", type: "hospital", name: "City Hospital ER", icon: Stethoscope, color: "text-emerald-600", bgColor: "bg-emerald-50", distance: "1.8 km", eta: "5 min", status: "notified" },
  { id: "r5", type: "volunteer", name: "Volunteer Team Alpha", icon: UserCheck, color: "text-purple-600", bgColor: "bg-purple-50", distance: "0.5 km", eta: "2 min", status: "notified" },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  notified: { label: "Notified", color: "bg-amber-100 text-amber-700" },
  acknowledged: { label: "Acknowledged", color: "bg-blue-100 text-blue-700" },
  dispatched: { label: "Dispatched", color: "bg-purple-100 text-purple-700" },
  en_route: { label: "En Route", color: "bg-emerald-100 text-emerald-700" },
  arrived: { label: "Arrived", color: "bg-emerald-600 text-white" },
};

export default function SOSPage() {
  const [step, setStep] = useState<SOSStep>("idle");
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("high");
  const [peopleCount, setPeopleCount] = useState(1);
  const [hasInjured, setHasInjured] = useState(false);
  const [message, setMessage] = useState("");
  const [responders, setResponders] = useState<Responder[]>(initialResponders);
  const [notifyingIndex, setNotifyingIndex] = useState(-1);
  const { isOnline } = useOnlineStatus();
  const { location } = useLocation();
  const navigate = useNavigate();

  // Animate responder notifications
  useEffect(() => {
    if (step !== "notifying") return;

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < initialResponders.length) {
        setNotifyingIndex(idx);
        setResponders((prev) =>
          prev.map((r, i) =>
            i === idx ? { ...r, status: "acknowledged" as const } : r
          )
        );
        idx++;
      } else {
        clearInterval(interval);
        // All notified — dispatch after brief pause
        setTimeout(() => {
          setResponders((prev) =>
            prev.map((r, i) => {
              if (i === 0) return { ...r, status: "dispatched" as const };
              if (i === 4) return { ...r, status: "dispatched" as const };
              return r;
            })
          );
          setTimeout(() => setStep("tracking"), 1200);
        }, 800);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [step]);

  const handleSendSOS = useCallback(async () => {
    setStep("sending");

    const sosData = {
      latitude: location?.latitude || 28.6139,
      longitude: location?.longitude || 77.2090,
      severity,
      message,
      offlineCreated: !isOnline,
      peopleCount,
      hasInjured,
    };

    if (isOnline) {
      await new Promise((r) => setTimeout(r, 1500));
      setStep("notifying");
    } else {
      const id = generateOfflineId();
      await saveOffline({ id, type: "sos", data: sosData });
      await new Promise((r) => setTimeout(r, 1500));
      setStep("mesh");
    }
  }, [location, severity, message, isOnline, peopleCount, hasInjured]);

  const reset = () => {
    setStep("idle");
    setSeverity("high");
    setPeopleCount(1);
    setHasInjured(false);
    setMessage("");
    setResponders(initialResponders);
    setNotifyingIndex(-1);
  };

  const sosLocation = {
    lat: location?.latitude || 28.6139,
    lng: location?.longitude || 77.209,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-red-200 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-red-200 text-xs font-medium uppercase tracking-wider">Emergency SOS</p>
              <h1 className="text-lg font-bold">
                {step === "tracking" ? "Live Tracking" : "Send Distress Signal"}
              </h1>
            </div>
          </div>
          {!isOnline && step !== "tracking" && (
            <div className="mt-3 flex items-center gap-2 bg-red-800/50 text-red-100 px-3 py-2 rounded-xl text-xs">
              <WifiOff className="h-3.5 w-3.5" />
              Offline — SOS will be saved locally and transmitted via mesh
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        <AnimatePresence mode="wait">
          {/* Idle */}
          {step === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center py-12">
              <motion.button
                onClick={() => setStep("confirm")}
                className="relative w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-2xl shadow-red-500/40 flex flex-col items-center justify-center gap-2"
                whileTap={{ scale: 0.9 }}
                animate={{ boxShadow: ["0 25px 50px -12px rgba(239,68,68,0.4)", "0 25px 50px -12px rgba(239,68,68,0.6)", "0 25px 50px -12px rgba(239,68,68,0.4)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {[1, 2, 3].map((i) => (
                  <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-red-400" animate={{ scale: [1, 1.5 + i * 0.2], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                ))}
                <AlertTriangle className="h-16 w-16 relative z-10" />
                <span className="text-2xl font-extrabold tracking-wider relative z-10">SOS</span>
                <span className="text-[10px] text-red-200 relative z-10">TAP FOR EMERGENCY</span>
              </motion.button>
              <p className="mt-8 text-center text-slate-500 text-sm max-w-xs">
                Tap the button above to send an emergency signal. Nearby hospitals, police, fire brigade, and volunteers will be notified immediately.
              </p>
            </motion.div>
          )}

          {/* Confirm */}
          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
              <Card className="border-red-100 shadow-lg">
                <CardContent className="p-6 text-center">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Are you in immediate danger?</h2>
                  <p className="text-sm text-slate-500 mb-4">
                    This will immediately notify nearby:
                  </p>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    {[
                      { icon: "🏥", label: "Hospitals" },
                      { icon: "👮", label: "Police" },
                      { icon: "🚒", label: "Fire Brigade" },
                      { icon: "🚑", label: "Ambulance" },
                      { icon: "🧑", label: "Volunteers" },
                    ].map((r) => (
                      <div key={r.label} className="flex flex-col items-center gap-1">
                        <span className="text-lg">{r.icon}</span>
                        <span className="text-[8px] text-slate-500 font-medium">{r.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <Button onClick={() => setStep("details")} className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold rounded-2xl">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      YES — SEND SOS
                    </Button>
                    <Button onClick={reset} variant="outline" className="w-full py-4 rounded-2xl">CANCEL</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Details */}
          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Emergency Details</h2>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Severity Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["low", "medium", "high", "critical"] as const).map((s) => (
                    <button key={s} onClick={() => setSeverity(s)} className={`py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${severity === s ? (s === "critical" ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : s === "high" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : s === "medium" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-blue-500 text-white shadow-lg shadow-blue-500/30") : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Number of People</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200">−</button>
                  <span className="text-2xl font-bold text-slate-900 w-12 text-center">{peopleCount}</span>
                  <button onClick={() => setPeopleCount(peopleCount + 1)} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200">+</button>
                </div>
              </div>

              <button onClick={() => setHasInjured(!hasInjured)} className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${hasInjured ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"}`}>
                <Heart className={`h-5 w-5 ${hasInjured ? "text-red-500" : "text-slate-400"}`} />
                <span className={`text-sm font-semibold ${hasInjured ? "text-red-700" : "text-slate-600"}`}>People are injured</span>
              </button>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Optional Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your situation..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>

              <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-2xl">
                <MapPin className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Location Captured</p>
                  <p className="text-xs text-emerald-600">
                    {location ? `${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°E` : "Using fallback location"}
                  </p>
                </div>
              </div>

              <Button onClick={handleSendSOS} className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold rounded-2xl shadow-xl shadow-red-600/20">
                <AlertTriangle className="mr-2 h-5 w-5" />
                SEND SOS NOW
              </Button>
            </motion.div>
          )}

          {/* Sending */}
          {step === "sending" && (
            <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-16">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full mb-6" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {isOnline ? "Transmitting SOS..." : "Saving SOS Locally..."}
              </h2>
              <p className="text-sm text-slate-500">
                {isOnline ? "Sending your distress signal to Drishti Network" : "Storing your signal for mesh transmission"}
              </p>
            </motion.div>
          )}

          {/* Notifying responders */}
          {step === "notifying" && (
            <motion.div key="notifying" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-6">
              <div className="text-center mb-6">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Radio className="h-8 w-8 text-red-600" />
                </motion.div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Notifying Responders</h2>
                <p className="text-sm text-slate-500">Your SOS is being sent to nearby help providers</p>
              </div>

              <div className="space-y-2">
                {responders.map((responder, i) => {
                  const Icon = responder.icon;
                  const isNotified = i <= notifyingIndex;
                  const statusMeta = statusLabels[responder.status];
                  return (
                    <motion.div key={responder.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                      <Card className={`border transition-all ${isNotified ? "border-emerald-200 shadow-sm" : "border-slate-100"}`}>
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isNotified ? responder.bgColor : "bg-slate-50"}`}>
                            <Icon className={`h-5 w-5 ${isNotified ? responder.color : "text-slate-300"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${isNotified ? "text-slate-900" : "text-slate-400"}`}>{responder.name}</p>
                            <p className="text-[10px] text-slate-400">{responder.distance} · ETA {responder.eta}</p>
                          </div>
                          {isNotified ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                              <Badge className={`text-[9px] px-2 py-0 ${statusMeta.color}`}>{statusMeta.label}</Badge>
                            </motion.div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-slate-200 rounded-full" />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Tracking — redirect to tracking page */}
          {step === "tracking" && (
            <motion.div key="tracking" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
              <Card className="border-emerald-100 shadow-lg">
                <CardContent className="p-6 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">SOS Dispatched</h2>
                  <p className="text-sm text-slate-500 mb-6">
                    {responders.filter((r) => r.status !== "notified").length} responders are responding to your location
                  </p>

                  {/* Responders summary */}
                  <div className="space-y-2 mb-6">
                    {responders.filter((r) => r.status !== "notified").map((r) => {
                      const Icon = r.icon;
                      return (
                        <div key={r.id} className="flex items-center gap-3 bg-emerald-50 rounded-xl px-3 py-2">
                          <Icon className={`h-4 w-4 ${r.color}`} />
                          <span className="text-xs font-semibold text-slate-700 flex-1 text-left">{r.name}</span>
                          <Badge className={`text-[9px] ${statusLabels[r.status].color}`}>{statusLabels[r.status].label}</Badge>
                        </div>
                      );
                    })}
                  </div>

                  <Button onClick={() => navigate("/sos-tracking", { state: { sosLocation, responders, severity, peopleCount } })} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 text-base font-bold rounded-2xl shadow-lg shadow-emerald-600/20">
                    <Navigation className="mr-2 h-5 w-5" />
                    Track Rescue LIVE
                  </Button>
                  <Button onClick={reset} variant="ghost" className="mt-3 text-slate-500">
                    Send Another SOS
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Mesh (Offline) */}
          {step === "mesh" && (
            <motion.div key="mesh" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
              <div className="text-center mb-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <WifiOff className="h-8 w-8 text-amber-600" />
                </motion.div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">SOS Saved Offline</h2>
                <p className="text-sm text-slate-500">Your emergency signal is being transmitted through nearby devices.</p>
              </div>

              <Card className="border-slate-100 shadow-lg mb-6">
                <CardContent className="p-6">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Mesh Signal Path</p>
                  <div className="flex flex-col items-center gap-1">
                    {[
                      { label: "YOUR DEVICE", icon: "📱", color: "bg-red-100 border-red-300 text-red-700", delay: 0 },
                      { label: "NEARBY DEVICE", icon: "📲", color: "bg-amber-100 border-amber-300 text-amber-700", delay: 0.5 },
                      { label: "NEARBY DEVICE", icon: "📲", color: "bg-amber-100 border-amber-300 text-amber-700", delay: 1.0 },
                      { label: "RESPONDER VEHICLE", icon: "🚑", color: "bg-blue-100 border-blue-300 text-blue-700", delay: 1.5 },
                      { label: "DRISHTI NETWORK", icon: "🌐", color: "bg-emerald-100 border-emerald-300 text-emerald-700", delay: 2.0 },
                    ].map((node, i) => (
                      <div key={node.label} className="flex flex-col items-center w-full">
                        {i > 0 && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 24, opacity: 1 }} transition={{ delay: node.delay - 0.3, duration: 0.3 }}>
                            <motion.div className="w-0.5 h-6 bg-gradient-to-b from-emerald-400 to-emerald-600" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: node.delay }} />
                          </motion.div>
                        )}
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: node.delay }} className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 ${node.color}`}>
                          <span className="text-xl">{node.icon}</span>
                          <span className="text-xs font-bold tracking-wider">{node.label}</span>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={() => navigate("/sos-tracking", { state: { sosLocation, responders, severity, peopleCount } })} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-4 font-bold mb-3">
                <Navigation className="mr-2 h-4 w-4" />
                Track Rescue LIVE
              </Button>
              <Button onClick={reset} variant="outline" className="w-full rounded-2xl">
                Send Another SOS
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step !== "tracking" && <BottomNav />}
    </div>
  );
}
