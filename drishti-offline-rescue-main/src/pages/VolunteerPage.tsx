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
  Heart,
  Utensils,
  Car,
  Shield,
  Home,
  Radio,
  Search,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  CheckCircle,
  Navigation,
  Phone,
  AlertTriangle,
  Zap,
  Star,
  X,
  Truck,
} from "lucide-react";

// --- Types ---
interface Skill {
  key: string;
  label: string;
  icon: any;
  color: string;
  activeColor: string;
  description: string;
}

interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  location: string;
  distance: string;
  requiredSkill: string;
  urgency: "low" | "medium" | "high" | "critical";
  peopleCount: number;
  postedBy: string;
  postedAgo: string;
  status: "open" | "accepted" | "in_progress" | "completed";
}

// --- Skills ---
const skills: Skill[] = [
  { key: "medical", label: "Medical", icon: Heart, color: "bg-red-50 text-red-600 border-red-200", activeColor: "bg-red-600 text-white border-red-600", description: "First aid, medication, triage" },
  { key: "food", label: "Food & Water", icon: Utensils, color: "bg-amber-50 text-amber-600 border-amber-200", activeColor: "bg-amber-600 text-white border-amber-600", description: "Distribute food and water" },
  { key: "transport", label: "Transport", icon: Car, color: "bg-blue-50 text-blue-600 border-blue-200", activeColor: "bg-blue-600 text-white border-blue-600", description: "Drive evacuees or supplies" },
  { key: "rescue", label: "Rescue", icon: Shield, color: "bg-emerald-50 text-emerald-600 border-emerald-200", activeColor: "bg-emerald-600 text-white border-emerald-600", description: "Physical rescue operations" },
  { key: "shelter", label: "Shelter Support", icon: Home, color: "bg-purple-50 text-purple-600 border-purple-200", activeColor: "bg-purple-600 text-white border-purple-600", description: "Manage shelter logistics" },
  { key: "communication", label: "Communication", icon: Radio, color: "bg-teal-50 text-teal-600 border-teal-200", activeColor: "bg-teal-600 text-white border-teal-600", description: "Relay messages, coordinate" },
  { key: "search", label: "Search Ops", icon: Search, color: "bg-orange-50 text-orange-600 border-orange-200", activeColor: "bg-orange-600 text-white border-orange-600", description: "Find missing persons" },
];

// --- Demo tasks ---
const sampleTasks: VolunteerTask[] = [
  {
    id: "vt1",
    title: "3 people need medical assistance",
    description: "Elderly couple and a child with minor injuries. Need basic first aid and bandages. Located on 2nd floor, building entrance partially blocked.",
    location: "Sector 14, Building 7",
    distance: "1.8 km",
    requiredSkill: "medical",
    urgency: "critical",
    peopleCount: 3,
    postedBy: "Rescue Team Alpha",
    postedAgo: "8 min ago",
    status: "open",
  },
  {
    id: "vt2",
    title: "Food distribution needed — 40 families",
    description: "Families at community shelter have not eaten in 6 hours. Need hot meals or packaged food delivered. Kitchen at Sector 5 school is operational.",
    location: "Sector 5, Community Hall",
    distance: "2.4 km",
    requiredSkill: "food",
    urgency: "high",
    peopleCount: 120,
    postedBy: "Shelter Manager",
    postedAgo: "22 min ago",
    status: "open",
  },
  {
    id: "vt3",
    title: "Evacuate 8 residents from flooded area",
    description: "Water level rising. 8 residents including 2 children need transport to shelter. Vehicle needed with high ground clearance.",
    location: "Block C, Houses 12-18",
    distance: "3.1 km",
    requiredSkill: "transport",
    urgency: "critical",
    peopleCount: 8,
    postedBy: "Sector Commander",
    postedAgo: "5 min ago",
    status: "open",
  },
  {
    id: "vt4",
    title: "Search team needed — collapsed building",
    description: "Possible people trapped under debris. Need volunteers for systematic search. Bring flashlights and basic tools.",
    location: "Old City, Chandni Chowk",
    distance: "4.2 km",
    requiredSkill: "search",
    urgency: "critical",
    peopleCount: 0,
    postedBy: "NDRF Coordinator",
    postedAgo: "12 min ago",
    status: "open",
  },
  {
    id: "vt5",
    title: "Shelter registration & management",
    description: "Community relief center needs volunteers to register incoming evacuees, manage supplies, and coordinate sleeping arrangements.",
    location: "Sector 5, Govt. School",
    distance: "2.4 km",
    requiredSkill: "shelter",
    urgency: "medium",
    peopleCount: 200,
    postedBy: "Relief Coordinator",
    postedAgo: "35 min ago",
    status: "open",
  },
  {
    id: "vt6",
    title: "Relay messages between rescue teams",
    description: "Radio network down in Sector 12. Need runners to relay critical updates between command center and field teams.",
    location: "Sector 12 — Route between bases",
    distance: "1.2 km",
    requiredSkill: "communication",
    urgency: "high",
    peopleCount: 0,
    postedBy: "Ops Commander",
    postedAgo: "15 min ago",
    status: "open",
  },
  {
    id: "vt7",
    title: "Rescue team needed — building extraction",
    description: "2 people stuck on rooftop of partially collapsed building. Need team for safe extraction using ladders.",
    location: "Phase 3, Block A",
    distance: "3.8 km",
    requiredSkill: "rescue",
    urgency: "critical",
    peopleCount: 2,
    postedBy: "Fire Response Unit",
    postedAgo: "3 min ago",
    status: "open",
  },
];

const urgencyStyles: Record<string, string> = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const skillColorMap: Record<string, string> = {
  medical: "bg-red-500",
  food: "bg-amber-500",
  transport: "bg-blue-500",
  rescue: "bg-emerald-500",
  shelter: "bg-purple-500",
  communication: "bg-teal-500",
  search: "bg-orange-500",
};

// --- Task card ---
function TaskCard({
  task,
  index,
  onAccept,
  isAccepted,
}: {
  task: VolunteerTask;
  index: number;
  onAccept: (task: VolunteerTask) => void;
  isAccepted: boolean;
}) {
  const skill = skills.find((s) => s.key === task.requiredSkill);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`border-slate-100 shadow-sm hover:shadow-md transition-all ${
        isAccepted ? "ring-2 ring-emerald-400" : ""
      }`}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isAccepted ? "bg-emerald-100" : skill?.color || "bg-slate-100"
            }`}>
              {isAccepted ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : skill ? (
                <skill.icon className="h-5 w-5" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                <Badge className={`text-[9px] px-1.5 py-0 ${urgencyStyles[task.urgency]}`}>
                  {task.urgency.toUpperCase()}
                </Badge>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                Posted by {task.postedBy} · {task.postedAgo}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed mb-3">{task.description}</p>

          {/* Info row */}
          <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-3 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5" />
              {task.location}
            </span>
            <span className="flex items-center gap-1">
              <Navigation className="h-2.5 w-2.5" />
              {task.distance}
            </span>
            {task.peopleCount > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-2.5 w-2.5" />
                {task.peopleCount} people
              </span>
            )}
          </div>

          {/* Action */}
          {isAccepted ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs font-semibold">
                <CheckCircle className="h-3.5 w-3.5" />
                Task Accepted — Head to location
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="rounded-xl text-xs font-semibold" size="sm">
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  Contact
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold" size="sm">
                  <Navigation className="h-3.5 w-3.5 mr-1" />
                  Navigate
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => onAccept(task)}
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold py-2.5"
            >
              <Zap className="h-4 w-4 mr-1.5" />
              ACCEPT TASK
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Main Page ---
export default function VolunteerPage() {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [acceptedTasks, setAcceptedTasks] = useState<Set<string>>(new Set());
  const [showAccepted, setShowAccepted] = useState(false);

  const toggleSkill = (key: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleAccept = useCallback((task: VolunteerTask) => {
    setAcceptedTasks((prev) => {
      const next = new Set(prev);
      next.add(task.id);
      return next;
    });
  }, []);

  // Filter tasks by selected skills (or show all if none selected)
  const filteredTasks =
    selectedSkills.size === 0
      ? sampleTasks
      : sampleTasks.filter((t) => selectedSkills.has(t.requiredSkill));

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  const activeTasks = sortedTasks.filter((t) => !acceptedTasks.has(t.id));
  const myTasks = sortedTasks.filter((t) => acceptedTasks.has(t.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-red-700 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-2 text-orange-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-bold">Volunteer Hub</h1>
                <p className="text-[10px] text-orange-200 uppercase tracking-wider">
                  {acceptedTasks.size} active task{acceptedTasks.size !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {acceptedTasks.size > 0 && (
              <button
                onClick={() => setShowAccepted(!showAccepted)}
                className="flex items-center gap-1.5 bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                My Tasks ({acceptedTasks.size})
              </button>
            )}
          </div>

          {/* Skill selector */}
          <p className="text-xs text-orange-200 mb-2 font-medium">I CAN HELP WITH</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {skills.map((skill) => {
              const isSelected = selectedSkills.has(skill.key);
              return (
                <button
                  key={skill.key}
                  onClick={() => toggleSkill(skill.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-white text-orange-700 border-white shadow-md"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                >
                  <skill.icon className="h-3 w-3" />
                  {skill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2 py-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white rounded-xl p-3 text-center border border-slate-100 shadow-sm">
            <p className="text-lg font-bold text-slate-900">{activeTasks.length}</p>
            <p className="text-[10px] text-slate-500 uppercase">Open Tasks</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
            <p className="text-lg font-bold text-red-700">
              {activeTasks.filter((t) => t.urgency === "critical").length}
            </p>
            <p className="text-[10px] text-red-500 uppercase">Critical</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
            <p className="text-lg font-bold text-emerald-700">{acceptedTasks.size}</p>
            <p className="text-[10px] text-emerald-500 uppercase">Accepted</p>
          </div>
        </div>

        {/* Active Tasks banner when viewing accepted */}
        <AnimatePresence mode="wait">
          {showAccepted && acceptedTasks.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  My Accepted Tasks
                </h2>
                <button
                  onClick={() => setShowAccepted(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {myTasks.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    onAccept={handleAccept}
                    isAccepted={true}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {showAccepted ? "Available Tasks" : "Nearby Tasks"}
              {selectedSkills.size > 0 && (
                <span className="text-orange-500 ml-1">
                  ({selectedSkills.size} filter{selectedSkills.size !== 1 ? "s" : ""})
                </span>
              )}
            </h2>
          </div>

          <div className="space-y-3">
            {activeTasks.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                index={i}
                onAccept={handleAccept}
                isAccepted={false}
              />
            ))}
          </div>

          {activeTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-sm font-semibold text-slate-700">No matching tasks</p>
              <p className="text-xs text-slate-500 mt-1">
                {acceptedTasks.size > 0
                  ? "All tasks in your skill area have been accepted!"
                  : "Try selecting different skills or check back later"}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
