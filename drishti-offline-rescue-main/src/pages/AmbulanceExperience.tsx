import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  MapPin,
  Navigation,
  Clock,
  Route,
  Shield,
  Heart,
  ChevronRight,
  Radio,
  Signal,
  AlertCircle,
  CheckCircle,
  Zap,
  Siren,
  CircleDot,
  Triangle,
} from "lucide-react";

type CallState = "connecting" | "connected" | "approaching" | "arrived" | "ended";

// --- Animated route visualization ---
function RouteVisualization({ progress }: { progress: number }) {
  return (
    <div className="relative h-32 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl overflow-hidden border border-slate-200">
      {/* Road */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 120">
        {/* Road path */}
        <path
          d="M 20 100 Q 100 100 140 80 Q 180 60 220 65 Q 260 70 300 50 Q 340 30 380 30"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Safe route (green) */}
        <path
          d="M 20 100 Q 100 100 140 80 Q 180 60 220 65 Q 260 70 300 50 Q 340 30 380 30"
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="2000"
          strokeDashoffset={2000 - (2000 * progress) / 100}
          className="transition-all duration-500"
        />
        {/* Blocked road indicator */}
        <g transform="translate(200, 55)">
          <circle r="8" fill="#f59e0b" opacity="0.2" />
          <circle r="4" fill="#f59e0b" />
          <text y="1" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">⚠</text>
        </g>
        {/* Ambulance position */}
        <g
          transform={`translate(${20 + (360 * progress) / 100}, ${
            progress < 30
              ? 100 - (20 * progress) / 30
              : progress < 60
              ? 80 + (5 * (progress - 30)) / 30
              : progress < 80
              ? 85 - (20 * (progress - 60)) / 20
              : 65 - (35 * (progress - 80)) / 20
          })`}
          className="transition-all duration-300"
        >
          <circle r="12" fill="#ef4444" opacity="0.15">
            <animate attributeName="r" values="12;16;12" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle r="8" fill="#ef4444" />
          <text y="1" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">🚑</text>
        </g>
        {/* Victim marker */}
        <g transform="translate(380, 30)">
          <circle r="10" fill="#ef4444" opacity="0.2">
            <animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle r="6" fill="#ef4444" />
          <text y="1" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">🆘</text>
        </g>
        {/* Start marker */}
        <g transform="translate(20, 100)">
          <circle r="6" fill="#3b82f6" />
          <text y="1" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">📍</text>
        </g>
      </svg>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Distance labels */}
      <div className="absolute top-2 left-3 text-[9px] font-bold text-slate-500 bg-white/80 px-1.5 py-0.5 rounded">
        START
      </div>
      <div className="absolute top-2 right-3 text-[9px] font-bold text-red-500 bg-white/80 px-1.5 py-0.5 rounded">
        VICTIM
      </div>
    </div>
  );
}

// --- Communication controls ---
function CommControls({
  isMuted,
  isSpeakerOff,
  onToggleMute,
  onToggleSpeaker,
  onEndCall,
}: {
  isMuted: boolean;
  isSpeakerOff: boolean;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onEndCall: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-5">
      <button
        onClick={onToggleMute}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
          isMuted ? "bg-white text-red-500 shadow-lg" : "bg-white/10 text-white"
        }`}
      >
        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </button>

      <button
        onClick={onEndCall}
        className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-xl shadow-red-500/40 hover:bg-red-600 transition-colors"
      >
        <PhoneOff className="h-7 w-7 text-white" />
      </button>

      <button
        onClick={onToggleSpeaker}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
          isSpeakerOff ? "bg-white text-amber-500 shadow-lg" : "bg-white/10 text-white"
        }`}
      >
        {isSpeakerOff ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
      </button>
    </div>
  );
}

// --- Main Page ---
export default function AmbulanceExperience() {
  const navigate = useNavigate();
  const [callState, setCallState] = useState<CallState>("connecting");
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [eta, setEta] = useState(14);
  const [distance, setDistance] = useState(3.4);
  const [hazardWarnings, setHazardWarnings] = useState<string[]>([]);

  // Call timer
  useEffect(() => {
    if (callState === "ended") return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [callState]);

  // Simulate journey
  useEffect(() => {
    if (callState === "ended" || callState === "arrived") return;

    const timer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 1.5, 100);

        // Update ETA and distance
        const remaining = 100 - next;
        setEta(Math.max(0, Math.ceil(remaining * 0.14)));
        setDistance(Math.max(0, Math.round((remaining * 0.034) * 10) / 10));

        // Add hazard warnings at certain points
        if (next > 30 && next < 35 && hazardWarnings.length === 0) {
          setHazardWarnings(["Road flood detected ahead — rerouting"]);
        }
        if (next > 60 && next < 65 && hazardWarnings.length === 1) {
          setHazardWarnings((prev) => [...prev, "Debris cleared — safe passage confirmed"]);
        }

        if (next >= 100) {
          setCallState("arrived");
        }

        return next;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [callState, hazardWarnings.length]);

  // Auto-connect
  useEffect(() => {
    if (callState === "connecting") {
      const timer = setTimeout(() => setCallState("connected"), 2000);
      return () => clearTimeout(timer);
    }
  }, [callState]);

  // Auto-start approaching after connected
  useEffect(() => {
    if (callState === "connected") {
      const timer = setTimeout(() => setCallState("approaching"), 1500);
      return () => clearTimeout(timer);
    }
  }, [callState]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  const handleEndCall = useCallback(() => {
    setCallState("ended");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Connecting state */}
        {callState === "connecting" && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-screen px-6"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6"
            >
              <Phone className="h-10 w-10 text-blue-400" />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">Connecting to Victim...</h2>
            <p className="text-sm text-slate-400">Establishing emergency link via Drishti Network</p>
            <div className="flex items-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Active call */}
        {(callState === "connected" || callState === "approaching" || callState === "arrived") && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-screen"
          >
            {/* Top bar */}
            <div className="px-4 pt-12 pb-4">
              <div className="max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-emerald-400 rounded-full"
                    />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      {callState === "arrived" ? "ARRIVED" : "LIVE CALL"}
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-300">
                    {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                  </span>
                </div>

                {/* Victim info */}
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur rounded-2xl p-4 mb-4">
                  <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center text-2xl">
                    🆘
                  </div>
                  <div className="flex-1">
                    <h1 className="text-base font-bold">Family Trapped — Flood</h1>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Sector 14, Building 7
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge className="text-[9px] bg-red-500/20 text-red-400">CRITICAL</Badge>
                      <span className="text-[10px] text-slate-500">4 people</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 px-4 overflow-y-auto">
              <div className="max-w-lg mx-auto space-y-4">
                {/* ETA & Distance */}
                <div className="grid grid-cols-3 gap-3">
                  <motion.div
                    animate={callState === "arrived" ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`rounded-2xl p-4 text-center ${
                      callState === "arrived" ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-white/5"
                    }`}
                  >
                    <p className="text-3xl font-bold">{callState === "arrived" ? "0" : eta}</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-1">
                      {callState === "arrived" ? "ARRIVED" : "Min ETA"}
                    </p>
                  </motion.div>
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-bold">{distance}</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-1">KM Left</p>
                  </div>
                  <div className="bg-red-500/10 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-bold text-red-400 capitalize">Critical</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-1">Severity</p>
                  </div>
                </div>

                {/* Route visualization */}
                <RouteVisualization progress={progress} />

                {/* Hazard warnings */}
                <AnimatePresence>
                  {hazardWarnings.map((warning, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        i === hazardWarnings.length - 1 && warning.includes("safe")
                          ? "bg-emerald-500/10 border border-emerald-500/20"
                          : "bg-amber-500/10 border border-amber-500/20"
                      }`}
                    >
                      {warning.includes("safe") ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${
                        warning.includes("safe") ? "text-emerald-300" : "text-amber-300"
                      }`}>
                        {warning}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Road hazards */}
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Route Hazards</p>
                    <div className="space-y-1.5">
                      {[
                        { text: "Sector 12 Main Road", status: "blocked", icon: "🚧" },
                        { text: "Block C Inner Road", status: "avoided", icon: "🌳" },
                        { text: "Ring Road Bypass", status: "clear", icon: "✅" },
                      ].map((hazard) => (
                        <div key={hazard.text} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{hazard.icon}</span>
                            <span className="text-xs text-slate-300">{hazard.text}</span>
                          </div>
                          <Badge className={`text-[9px] ${
                            hazard.status === "clear" ? "bg-emerald-500/20 text-emerald-400" :
                            hazard.status === "avoided" ? "bg-amber-500/20 text-amber-400" :
                            "bg-red-500/20 text-red-400"
                          }`}>
                            {hazard.status.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Arrived state */}
                {callState === "arrived" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3"
                    >
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </motion.div>
                    <h2 className="text-lg font-bold text-emerald-400 mb-1">Rescue Team Arrived</h2>
                    <p className="text-xs text-slate-400">Victims located. Proceeding with evacuation.</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Bottom controls */}
            <div className="px-4 py-6 bg-gradient-to-t from-slate-900 to-transparent">
              <div className="max-w-lg mx-auto">
                <CommControls
                  isMuted={isMuted}
                  isSpeakerOff={isSpeakerOff}
                  onToggleMute={() => setIsMuted(!isMuted)}
                  onToggleSpeaker={() => setIsSpeakerOff(!isSpeakerOff)}
                  onEndCall={handleEndCall}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Call ended */}
        {callState === "ended" && (
          <motion.div
            key="ended"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-screen px-6"
          >
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <PhoneOff className="h-8 w-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Call Ended</h2>
            <p className="text-sm text-slate-400 text-center max-w-xs mb-8">
              Rescue mission logged. Duration: {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </p>

            <div className="w-full max-w-xs space-y-2 mb-6">
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 text-sm">
                <span className="text-slate-400">Victims Reached</span>
                <span className="font-bold text-emerald-400">4 of 4</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 text-sm">
                <span className="text-slate-400">Distance Traveled</span>
                <span className="font-bold">3.4 km</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 text-sm">
                <span className="text-slate-400">Hazards Avoided</span>
                <span className="font-bold text-amber-400">2</span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/responder")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 font-bold"
            >
              <Shield className="h-4 w-4 mr-2" />
              Back to Command Center
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
