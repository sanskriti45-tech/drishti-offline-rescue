import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useLocation } from "@/hooks/use-location";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Upload,
  CheckCircle,
  AlertTriangle,
  Droplets,
  Flame,
  Mountain,
  CloudRain,
  Building,
  Loader2,
} from "lucide-react";
import { saveOffline, generateOfflineId } from "@/lib/offline-db";

type ReportStep = "form" | "analyzing" | "result";

const disasterTypes = [
  { key: "flood", label: "Flood", icon: Droplets, color: "bg-blue-100 text-blue-600 border-blue-200", activeColor: "bg-blue-600 text-white border-blue-600" },
  { key: "fire", label: "Fire", icon: Flame, color: "bg-red-100 text-red-600 border-red-200", activeColor: "bg-red-600 text-white border-red-600" },
  { key: "earthquake", label: "Earthquake", icon: Mountain, color: "bg-amber-100 text-amber-600 border-amber-200", activeColor: "bg-amber-600 text-white border-amber-600" },
  { key: "cyclone", label: "Cyclone", icon: CloudRain, color: "bg-purple-100 text-purple-600 border-purple-200", activeColor: "bg-purple-600 text-white border-purple-600" },
  { key: "landslide", label: "Landslide", icon: Mountain, color: "bg-orange-100 text-orange-600 border-orange-200", activeColor: "bg-orange-600 text-white border-orange-600" },
  { key: "collapse", label: "Collapse", icon: Building, color: "bg-slate-100 text-slate-600 border-slate-200", activeColor: "bg-slate-600 text-white border-slate-600" },
];

const severityLevels = [
  { key: "low", label: "Low", color: "bg-blue-500 text-white" },
  { key: "medium", label: "Medium", color: "bg-amber-500 text-white" },
  { key: "high", label: "High", color: "bg-orange-500 text-white" },
  { key: "critical", label: "Critical", color: "bg-red-600 text-white" },
];

export default function ReportDisasterPage() {
  const [step, setStep] = useState<ReportStep>("form");
  const [type, setType] = useState<string>("");
  const [severity, setSeverity] = useState<string>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [affectedCount, setAffectedCount] = useState(10);
  const [hasPhoto, setHasPhoto] = useState(false);
  const { location } = useLocation();
  const { isOnline } = useOnlineStatus();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setStep("analyzing");
    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 3000));

    if (!isOnline) {
      await saveOffline({
        id: generateOfflineId(),
        type: "disaster",
        data: { type, severity, title, description, affectedCount, hasPhoto },
      });
    }

    setStep("result");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="mb-3 flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-lg font-bold">Report Disaster</h1>
          <p className="text-slate-300 text-xs">Help others by reporting what you see</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2">
        {step === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 py-4"
          >
            {/* Photo Upload */}
            <Card className="border-dashed border-2 border-slate-300 hover:border-emerald-400 transition-colors cursor-pointer bg-slate-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Camera className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Upload Photo</p>
                <p className="text-xs text-slate-500">Tap to take a photo or upload from gallery</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-xl"
                  onClick={() => setHasPhoto(true)}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Choose Photo
                </Button>
                {hasPhoto && (
                  <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Photo attached
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Disaster Type */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Type of Disaster</label>
              <div className="grid grid-cols-3 gap-2">
                {disasterTypes.map((dt) => (
                  <button
                    key={dt.key}
                    onClick={() => setType(dt.key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      type === dt.key ? dt.activeColor : dt.color
                    }`}
                  >
                    <dt.icon className="h-5 w-5" />
                    <span className="text-[10px] font-semibold">{dt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Severity</label>
              <div className="grid grid-cols-4 gap-2">
                {severityLevels.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSeverity(s.key)}
                    className={`py-3 rounded-xl text-xs font-semibold transition-all ${
                      severity === s.key ? s.color : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of what you see"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Details</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the situation in detail..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* People Affected */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Estimated People Affected</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAffectedCount(Math.max(1, affectedCount - 5))}
                  className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold"
                >
                  −
                </button>
                <span className="text-xl font-bold text-slate-900 w-16 text-center">{affectedCount}</span>
                <button
                  onClick={() => setAffectedCount(affectedCount + 5)}
                  className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl">
              <MapPin className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Location Captured</p>
                <p className="text-xs text-emerald-600">
                  {location
                    ? `${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°E`
                    : "Using fallback location"}
                </p>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!type || !title}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 text-base font-bold rounded-2xl disabled:opacity-50"
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              Submit Report
            </Button>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-emerald-600" />
            </motion.div>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">Analyzing Report...</h2>
            <p className="text-sm text-slate-500 text-center max-w-xs">
              AI is analyzing the disaster type and severity to help responders prioritize.
            </p>
            <div className="mt-6 space-y-2 w-full max-w-xs">
              {["Capturing location", "Analyzing image", "Classifying hazard", "Calculating priority"].map(
                (text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="flex items-center gap-2 text-xs text-slate-500"
                  >
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    {text}
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </motion.div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Report Submitted</h2>
            <p className="text-sm text-slate-500 text-center max-w-xs mb-6">
              Thank you for helping keep your community safe. Your report has been shared with emergency responders.
            </p>

            <Card className="w-full border-emerald-100 mb-4">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Type</span>
                  <span className="font-semibold capitalize">{type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Severity</span>
                  <span className="font-semibold capitalize">{severity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">People Affected</span>
                  <span className="font-semibold">{affectedCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-emerald-600">
                    {isOnline ? "Shared with Network" : "Saved Offline"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => navigate("/disasters")}
              className="rounded-2xl px-8"
            >
              View All Disasters
            </Button>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
