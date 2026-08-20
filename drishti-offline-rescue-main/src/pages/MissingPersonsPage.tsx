import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useLocation } from "@/hooks/use-location";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  UserPlus,
  UserCheck,
  MapPin,
  Clock,
  Camera,
  CheckCircle,
  AlertTriangle,
  Upload,
  Loader2,
  Phone,
  Shield,
  ChevronRight,
  X,
  Star,
  Heart,
  Users,
} from "lucide-react";

// --- Types ---
interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastSeenLocation: string;
  lastSeenTime: string;
  description: string;
  reportedBy: string;
  status: "missing" | "found" | "matched";
  avatar: string;
  height?: string;
  clothing?: string;
}

interface MatchResult {
  person: MissingPerson;
  confidence: number;
  matchReasons: string[];
}

// --- Demo data ---
const sampleMissing: MissingPerson[] = [
  {
    id: "mp1",
    name: "Ravi Shankar",
    age: 45,
    gender: "Male",
    lastSeenLocation: "Sector 14, Near Water Tank",
    lastSeenTime: "2 hours ago",
    description: "Last seen wearing blue shirt and dark pants. Diabetic, needs medication.",
    reportedBy: "Sunita Shankar (wife)",
    status: "missing",
    avatar: "👨",
    height: "5'8\"",
    clothing: "Blue shirt, dark pants",
  },
  {
    id: "mp2",
    name: "Priya Gupta",
    age: 8,
    gender: "Female",
    lastSeenLocation: "Block C, Playground Area",
    lastSeenTime: "3 hours ago",
    description: "Young girl, last seen playing near the park. Wearing red dress with white flowers.",
    reportedBy: "Manoj Gupta (father)",
    status: "missing",
    avatar: "👧",
    height: "3'2\"",
    clothing: "Red dress with white flowers",
  },
  {
    id: "mp3",
    name: "Elderly Couple — unnamed",
    age: 72,
    gender: "Male & Female",
    lastSeenLocation: "Old City, Near Temple",
    lastSeenTime: "5 hours ago",
    description: "Elderly couple, man uses walking stick. Both hard of hearing.",
    reportedBy: "Neighbor",
    status: "missing",
    avatar: "👴👵",
    height: "5'4\" & 5'1\"",
    clothing: "Traditional Indian attire",
  },
  {
    id: "mp4",
    name: "Amit Verma",
    age: 34,
    gender: "Male",
    lastSeenLocation: "Industrial Area, Block B",
    lastSeenTime: "1 hour ago",
    description: "Factory worker. Last seen during evacuation. Wearing yellow hard hat and work vest.",
    reportedBy: "Colleague",
    status: "missing",
    avatar: "👷",
    height: "5'10\"",
    clothing: "Yellow hard hat, orange work vest",
  },
  {
    id: "mp5",
    name: "Meena Devi",
    age: 28,
    gender: "Female",
    lastSeenLocation: "Sector 7, Bus Stand",
    lastSeenTime: "4 hours ago",
    description: "Pregnant woman, 7 months. Needs medical attention. Was trying to reach hospital.",
    reportedBy: "Husband",
    status: "matched",
    avatar: "🤰",
    height: "5'3\"",
    clothing: "Green salwar kameez",
  },
];

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  missing: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  found: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  matched: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

// --- Demo match results ---
const demoMatches: MatchResult[] = [
  {
    person: sampleMissing[0],
    confidence: 87,
    matchReasons: [
      "Location matches nearby rescue zone",
      "Age and gender consistent with sighting report",
      "Medical needs noted by rescuer team",
    ],
  },
  {
    person: sampleMissing[3],
    confidence: 72,
    matchReasons: [
      "Worker description matches rescued individual",
      "Clothing description partially matches",
      "Location proximity to rescue point",
    ],
  },
];

// --- Tabs ---
type Tab = "search" | "report" | "matches";

// --- Person Card ---
function PersonCard({ person, index }: { person: MissingPerson; index: number }) {
  const style = statusStyles[person.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
              {person.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-bold text-slate-900">{person.name}</h3>
                <Badge className={`text-[9px] px-1.5 py-0 border ${style.bg} ${style.text} ${style.border}`}>
                  {person.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 mb-1.5">{person.age} yrs · {person.gender} · {person.height}</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">{person.description}</p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5" />
                  {person.lastSeenLocation}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  {person.lastSeenTime}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Reported by: <span className="font-medium text-slate-500">{person.reportedBy}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Match Card ---
function MatchCard({ match, index }: { match: MatchResult; index: number }) {
  const { person, confidence, matchReasons } = match;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className={`border-2 ${confidence >= 80 ? "border-amber-300 shadow-amber-100" : "border-slate-200"} shadow-md`}>
        <CardContent className="p-4">
          {/* Match header */}
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center"
            >
              <Star className="h-4 w-4 text-amber-600" />
            </motion.div>
            <div>
              <p className="text-xs font-bold text-amber-700">Possible Match Found</p>
              <p className="text-[10px] text-slate-500">Confidence: {confidence}%</p>
            </div>
            <div className="ml-auto">
              <div className={`text-right ${confidence >= 80 ? "text-amber-600" : "text-slate-400"}`}>
                <p className="text-xl font-bold">{confidence}%</p>
              </div>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${confidence >= 80 ? "bg-amber-500" : "bg-slate-400"}`}
            />
          </div>

          {/* Person info */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
              {person.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">{person.name}</h3>
              <p className="text-[11px] text-slate-500">{person.age} yrs · {person.gender}</p>
              <p className="text-xs text-slate-600 mt-1">{person.description}</p>
            </div>
          </div>

          {/* Match reasons */}
          <div className="bg-slate-50 rounded-xl p-3 mb-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Why this matches</p>
            <div className="space-y-1.5">
              {matchReasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location & time */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {person.lastSeenLocation}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {person.lastSeenTime}
            </span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="rounded-xl text-xs font-semibold">
              <Phone className="h-3.5 w-3.5 mr-1" />
              Contact Reporter
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold">
              <Shield className="h-3.5 w-3.5 mr-1" />
              Mark as Found
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Report Form ---
function ReportForm({ onSubmit }: { onSubmit: () => void }) {
  const { location } = useLocation();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [clothing, setClothing] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);

  return (
    <div className="space-y-4">
      {/* Photo upload */}
      <Card className="border-dashed border-2 border-slate-300 hover:border-indigo-400 transition-colors cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Camera className="h-7 w-7 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">Photo of Missing Person</p>
          <p className="text-xs text-slate-500 mb-3">If available, upload a recent photo</p>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setHasPhoto(true)}>
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

      {/* Name */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the person's name"
          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Age & Gender */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Age</label>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            type="number"
            placeholder="Age"
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Clothing */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Clothing / Appearance</label>
        <input
          value={clothing}
          onChange={(e) => setClothing(e.target.value)}
          placeholder="What were they wearing?"
          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Additional Details</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Medical conditions, distinguishing features, any other details..."
          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Location */}
      <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl">
        <MapPin className="h-5 w-5 text-emerald-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Last Known Location</p>
          <p className="text-xs text-emerald-600">
            {location
              ? `${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°E`
              : "Using fallback location"}
          </p>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!name}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-5 text-base font-bold rounded-2xl disabled:opacity-50 shadow-lg shadow-red-600/20"
      >
        <UserPlus className="mr-2 h-5 w-5" />
        Submit Missing Person Report
      </Button>
    </div>
  );
}

// --- Main Page ---
export default function MissingPersonsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredPersons = sampleMissing.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReport = useCallback(async () => {
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsAnalyzing(false);
    setShowSubmitSuccess(true);
    setTimeout(() => {
      setShowSubmitSuccess(false);
      setTab("search");
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 text-white px-4 pt-12 pb-4 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-2 text-violet-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-violet-500/30 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold">Missing Persons</h1>
              <p className="text-[10px] text-violet-300 uppercase tracking-wider">
                Find & reunite families
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-violet-800/50 rounded-xl p-1">
            {([
              { key: "search", label: "Search", icon: Search },
              { key: "report", label: "Report", icon: UserPlus },
              { key: "matches", label: "Matches", icon: UserCheck },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  tab === t.key
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-violet-300 hover:text-white"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2">
        {/* Submit success toast */}
        <AnimatePresence>
          {showSubmitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-600 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg mb-4"
            >
              <CheckCircle className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-bold text-sm">Report Submitted</p>
                <p className="text-xs text-emerald-100">Your report is now visible to all rescue teams</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyzing overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center mb-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-10 w-10 text-violet-600 mx-auto" />
              </motion.div>
              <p className="text-sm font-bold text-slate-900 mt-4 mb-1">Processing Report...</p>
              <p className="text-xs text-slate-500">Cross-referencing with rescue network</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="py-4">
          <AnimatePresence mode="wait">
            {/* Search Tab */}
            {tab === "search" && (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, location, or description..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                    <p className="text-lg font-bold text-red-700">
                      {sampleMissing.filter((p) => p.status === "missing").length}
                    </p>
                    <p className="text-[10px] text-red-500 uppercase">Missing</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                    <p className="text-lg font-bold text-amber-700">
                      {sampleMissing.filter((p) => p.status === "matched").length}
                    </p>
                    <p className="text-[10px] text-amber-500 uppercase">Matched</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                    <p className="text-lg font-bold text-emerald-700">
                      {sampleMissing.filter((p) => p.status === "found").length}
                    </p>
                    <p className="text-[10px] text-emerald-500 uppercase">Found</p>
                  </div>
                </div>

                {/* Person list */}
                <div className="space-y-3">
                  {filteredPersons.map((person, i) => (
                    <PersonCard key={person.id} person={person} index={i} />
                  ))}
                </div>

                {filteredPersons.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-sm font-semibold text-slate-700">No results found</p>
                    <p className="text-xs text-slate-500 mt-1">Try a different search term</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Report Tab */}
            {tab === "report" && (
              <motion.div
                key="report"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <ReportForm onSubmit={handleReport} />
              </motion.div>
            )}

            {/* Matches Tab */}
            {tab === "matches" && (
              <motion.div
                key="matches"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="h-5 w-5 text-amber-600 mt-0.5" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-bold text-amber-800 mb-0.5">
                      {demoMatches.length} Possible Matches
                    </p>
                    <p className="text-xs text-amber-600">
                      Based on location, description, and rescue network data
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {demoMatches.map((match, i) => (
                    <MatchCard key={match.person.id} match={match} index={i} />
                  ))}
                </div>

                <Card className="border-slate-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-slate-500">
                      Matches are based on proximity, description similarity, and rescue team reports.{" "}
                      <span className="font-semibold text-slate-700">
                        Always verify in person before confirming.
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
