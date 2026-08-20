import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Camera,
  Upload,
  Scan,
  AlertTriangle,
  TreePine,
  Droplets,
  Flame,
  Building,
  Construction,
  Shield,
  Route,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  Eye,
  ChevronRight,
  MapPin,
} from "lucide-react";

// --- Demo hazard analysis results ---
interface DetectedHazard {
  id: string;
  type: "blocked_road" | "fallen_tree" | "flood" | "fire" | "structural_damage" | "debris";
  label: string;
  confidence: number;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

const HAZARD_TEMPLATES: Record<string, DetectedHazard[]> = {
  flood: [
    {
      id: "h1",
      type: "flood",
      label: "Flood Water",
      confidence: 96,
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Significant water accumulation covering roadway. Depth estimated 30-50cm. Not passable by standard vehicles.",
    },
    {
      id: "h2",
      type: "blocked_road",
      label: "Blocked Road",
      confidence: 91,
      icon: Construction,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "Road partially obstructed by flood debris and displaced vehicles.",
    },
  ],
  fire: [
    {
      id: "h3",
      type: "fire",
      label: "Active Fire",
      confidence: 94,
      icon: Flame,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Active fire detected. Visible flames and heavy smoke. Road within 200m of fire origin is unsafe.",
    },
    {
      id: "h4",
      type: "debris",
      label: "Debris on Road",
      confidence: 78,
      icon: Construction,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      description: "Fallen structural debris partially blocking adjacent lane.",
    },
  ],
  collapse: [
    {
      id: "h5",
      type: "structural_damage",
      label: "Structural Damage",
      confidence: 92,
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Significant structural collapse detected. Building debris across roadway. Extremely dangerous zone.",
    },
    {
      id: "h6",
      type: "blocked_road",
      label: "Blocked Road",
      confidence: 97,
      icon: Construction,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "Road completely blocked by collapsed structure. No passage possible.",
    },
    {
      id: "h7",
      type: "debris",
      label: "Fallen Debris",
      confidence: 85,
      icon: TreePine,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      description: "Scattered debris from nearby structures. Lane partially passable with caution.",
    },
  ],
  tree: [
    {
      id: "h8",
      type: "fallen_tree",
      label: "Fallen Tree",
      confidence: 98,
      icon: TreePine,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      description: "Large fallen tree completely blocking both lanes. Requires heavy equipment to clear.",
    },
    {
      id: "h9",
      type: "blocked_road",
      label: "Blocked Road",
      confidence: 89,
      icon: Construction,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "Road impassable due to fallen tree and branches.",
    },
  ],
};

const hazardTypeIcon: Record<string, { icon: string; color: string }> = {
  blocked_road: { icon: "🚧", color: "text-amber-600" },
  fallen_tree: { icon: "🌳", color: "text-emerald-600" },
  flood: { icon: "💧", color: "text-blue-600" },
  fire: { icon: "🔥", color: "text-red-600" },
  structural_damage: { icon: "🏚️", color: "text-purple-600" },
  debris: { icon: "🪨", color: "text-orange-600" },
};

// --- Scanning animation ---
function ScanAnimation({ progress }: { progress: number }) {
  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden">
      {/* Animated scan lines */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 via-emerald-500/20 to-emerald-500/0"
        animate={{ top: ["-20%", "120%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Center crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative"
        >
          <div className="w-20 h-20 border-2 border-emerald-400 rounded-xl" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-400/50" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-400/50" />
        </motion.div>
      </div>

      {/* Corner brackets */}
      {[
        "top-4 left-4",
        "top-4 right-4 rotate-90",
        "bottom-4 right-4 rotate-180",
        "bottom-4 left-4 -rotate-90",
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos}`}>
          <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
        </div>
      ))}

      {/* Progress text */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-emerald-400 text-xs font-mono font-semibold tracking-wider">
            AI ANALYZING...
          </span>
          <span className="text-emerald-400 text-xs font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Scanning status */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-full">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-emerald-400 rounded-full"
          />
          <span className="text-emerald-400 text-[10px] font-semibold tracking-wider">
            DRISHTI AI v2.1
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Hazard result card ---
function HazardCard({
  hazard,
  index,
}: {
  hazard: DetectedHazard;
  index: number;
}) {
  const Icon = hazard.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className={`border ${hazard.borderColor} shadow-sm`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hazard.bgColor}`}
            >
              <Icon className={`h-5 w-5 ${hazard.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-slate-900">{hazard.label}</h3>
                <Badge
                  className={`text-[10px] font-bold px-2 py-0 ${
                    hazard.confidence >= 90
                      ? "bg-red-100 text-red-700"
                      : hazard.confidence >= 75
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {hazard.confidence}%
                </Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{hazard.description}</p>

              {/* Confidence bar */}
              <div className="mt-2">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${hazard.confidence}%` }}
                    transition={{ delay: index * 0.15 + 0.3, duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      hazard.confidence >= 90
                        ? "bg-red-500"
                        : hazard.confidence >= 75
                        ? "bg-amber-500"
                        : "bg-slate-400"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Route impact card ---
function RouteImpact({ hazards }: { hazards: DetectedHazard[] }) {
  const blockedCount = hazards.filter(
    (h) => h.type === "blocked_road" || h.type === "structural_damage" || h.type === "flood"
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: hazards.length * 0.15 + 0.3 }}
    >
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Route className="h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-800">Route Impact Assessment</h3>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-amber-100">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-xs text-slate-700">
                <span className="font-bold text-amber-700">{blockedCount} road{blockedCount !== 1 ? "s" : ""}</span>{" "}
                {blockedCount !== 1 ? "have" : "has"} been marked unsafe
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-amber-100">
              <RefreshCw className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="text-xs text-slate-700">
                <span className="font-bold text-emerald-700">Alternative route</span> available via{" "}
                <span className="font-semibold">Sector 7 bypass</span>
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-amber-100">
              <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
              <p className="text-xs text-slate-700">
                <span className="font-bold text-blue-700">ETA updated</span> from 8 min to 14 min via safe route
              </p>
            </div>
          </div>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20">
            <Route className="h-4 w-4 mr-2" />
            Recalculate Rescue Route
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Main Page ---
export default function HazardScannerPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<"upload" | "scanning" | "results">("upload");
  const [progress, setProgress] = useState(0);
  const [detectedHazards, setDetectedHazards] = useState<DetectedHazard[]>([]);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<string>("flood");

  const simulateAnalysis = useCallback(
    async (demoType?: string) => {
      setPhase("scanning");
      setProgress(0);
      setDetectedHazards([]);

      // Animate progress
      for (let i = 0; i <= 100; i += 2) {
        await new Promise((r) => setTimeout(r, 40));
        setProgress(i);
      }

      // Pick hazard set
      const type = demoType || selectedDemo;
      const hazards = HAZARD_TEMPLATES[type] || HAZARD_TEMPLATES.flood;
      setDetectedHazards(hazards);
      setPhase("results");
    },
    [selectedDemo]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
      // Auto-start analysis
      simulateAnalysis();
    },
    [simulateAnalysis]
  );

  const reset = () => {
    setPhase("upload");
    setProgress(0);
    setDetectedHazards([]);
    setUploadedPreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-2 text-indigo-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500/30 rounded-xl flex items-center justify-center">
              <Scan className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold">AI Hazard Scanner</h1>
              <p className="text-[10px] text-indigo-300 uppercase tracking-wider">
                Detect dangers from photos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2">
        <AnimatePresence mode="wait">
          {/* Phase: Upload */}
          {phase === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 py-4"
            >
              {/* Upload area */}
              <Card className="border-dashed border-2 border-slate-300 hover:border-indigo-400 transition-colors cursor-pointer bg-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <Camera className="h-8 w-8 text-indigo-500" />
                  </motion.div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Upload Disaster Photo
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Take a photo or upload from gallery to detect hazards
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="h-4 w-4 mr-1.5" />
                      Choose Photo
                    </Button>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Camera className="h-4 w-4 mr-1.5" />
                      Take Photo
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </CardContent>
              </Card>

              {/* Quick demo */}
              <Card className="border-slate-100 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-900">Quick Demo</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    No photo? Try a demo scan to see the AI hazard detection in action.
                  </p>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { key: "flood", label: "Flood", icon: "💧" },
                      { key: "fire", label: "Fire", icon: "🔥" },
                      { key: "collapse", label: "Collapse", icon: "🏚️" },
                      { key: "tree", label: "Tree", icon: "🌳" },
                    ].map((demo) => (
                      <button
                        key={demo.key}
                        onClick={() => setSelectedDemo(demo.key)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                          selectedDemo === demo.key
                            ? "border-indigo-400 bg-indigo-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xl">{demo.icon}</span>
                        <span className="text-[10px] font-semibold text-slate-600">{demo.label}</span>
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={() => simulateAnalysis()}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-semibold"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    Run Demo Scan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Phase: Scanning */}
          {phase === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4 space-y-4"
            >
              <ScanAnimation progress={progress} />

              <div className="space-y-2">
                {[
                  { text: "Preprocessing image", threshold: 15 },
                  { text: "Detecting hazards", threshold: 35 },
                  { text: "Classifying danger type", threshold: 55 },
                  { text: "Estimating confidence", threshold: 75 },
                  { text: "Assessing route impact", threshold: 90 },
                ].map((step, i) => (
                  <motion.div
                    key={step.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: progress >= step.threshold ? 1 : 0.3,
                      x: progress >= step.threshold ? 0 : -10,
                    }}
                    className="flex items-center gap-2 px-4"
                  >
                    {progress >= step.threshold ? (
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        progress >= step.threshold
                          ? "text-slate-700 font-medium"
                          : "text-slate-400"
                      }`}
                    >
                      {step.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Phase: Results */}
          {phase === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-4 space-y-4"
            >
              {/* Summary banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-4 flex items-center gap-3"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <AlertTriangle className="h-8 w-8" />
                </motion.div>
                <div>
                  <p className="font-bold text-base">
                    {detectedHazards.length} Hazard{detectedHazards.length !== 1 ? "s" : ""} Detected
                  </p>
                  <p className="text-xs text-red-100">
                    This road has been marked unsafe for rescue vehicles
                  </p>
                </div>
              </motion.div>

              {/* Detected hazards */}
              <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Detected Hazards
                </h2>
                <div className="space-y-3">
                  {detectedHazards.map((hazard, i) => (
                    <HazardCard key={hazard.id} hazard={hazard} index={i} />
                  ))}
                </div>
              </div>

              {/* Route impact */}
              <RouteImpact hazards={detectedHazards} />

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl py-5"
                  onClick={reset}
                >
                  <Camera className="h-4 w-4 mr-1.5" />
                  Scan Again
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-5 font-semibold"
                  onClick={() => navigate("/map")}
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  View on Map
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
