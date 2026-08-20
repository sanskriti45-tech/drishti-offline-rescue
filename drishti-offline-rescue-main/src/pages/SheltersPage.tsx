import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useLocation } from "@/hooks/use-location";
import { BottomNav } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Home,
  MapPin,
  Users,
  Heart,
  Accessibility,
  Navigation,
  Star,
  ChevronRight,
  Search,
} from "lucide-react";

interface Shelter {
  id: string;
  name: string;
  distance: string;
  capacity: number;
  occupancy: number;
  medicalSupport: boolean;
  wheelchairAccessible: boolean;
  familyFriendly: boolean;
  status: string;
  address: string;
}

const sampleShelters: Shelter[] = [
  {
    id: "1",
    name: "Community Relief Center",
    distance: "1.2 km",
    capacity: 200,
    occupancy: 85,
    medicalSupport: true,
    wheelchairAccessible: true,
    familyFriendly: true,
    status: "open",
    address: "Sector 14, Community Hall",
  },
  {
    id: "2",
    name: "Government School Shelter",
    distance: "2.4 km",
    capacity: 300,
    occupancy: 210,
    medicalSupport: false,
    wheelchairAccessible: true,
    familyFriendly: true,
    status: "open",
    address: "Phase 3, Govt. Senior Secondary School",
  },
  {
    id: "3",
    name: "Sports Stadium Emergency Camp",
    distance: "3.8 km",
    capacity: 500,
    occupancy: 480,
    medicalSupport: true,
    wheelchairAccessible: false,
    familyFriendly: true,
    status: "open",
    address: "District Sports Complex",
  },
  {
    id: "4",
    name: "Temple Community Hall",
    distance: "0.8 km",
    capacity: 100,
    occupancy: 100,
    medicalSupport: false,
    wheelchairAccessible: false,
    familyFriendly: false,
    status: "full",
    address: "Old City, Main Temple Road",
  },
  {
    id: "5",
    name: "Red Cross Relief Camp",
    distance: "5.1 km",
    capacity: 250,
    occupancy: 120,
    medicalSupport: true,
    wheelchairAccessible: true,
    familyFriendly: true,
    status: "open",
    address: "NH-44, Near Hospital Junction",
  },
];

const statusStyles: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-700",
  full: "bg-red-100 text-red-700",
  closed: "bg-slate-100 text-slate-500",
};

export default function SheltersPage() {
  const [needsMedical, setNeedsMedical] = useState(false);
  const [needsWheelchair, setNeedsWheelchair] = useState(false);
  const [familySize, setFamilySize] = useState(1);
  const [showMatching, setShowMatching] = useState(false);
  const navigate = useNavigate();

  const getMatchScore = (shelter: Shelter) => {
    let score = 100;
    const remaining = shelter.capacity - shelter.occupancy;
    if (shelter.status === "full") score -= 60;
    if (remaining < familySize) score -= 40;
    if (needsMedical && !shelter.medicalSupport) score -= 30;
    if (needsWheelchair && !shelter.wheelchairAccessible) score -= 30;
    if (!shelter.familyFriendly && familySize > 2) score -= 15;
    return Math.max(0, score);
  };

  const sortedShelters = [...sampleShelters].sort(
    (a, b) => getMatchScore(b) - getMatchScore(a)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-bold mb-1">Find Shelter</h1>
          <p className="text-blue-200 text-xs">
            Smart matching based on your needs and capacity
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2">
        {/* Matching Panel */}
        <Card className="border-blue-100 shadow-md mb-4 -mt-0">
          <CardContent className="p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Your Requirements</h2>
            
            {/* Family Size */}
            <div className="mb-3">
              <label className="text-xs text-slate-500 mb-1 block">Number of People</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFamilySize(Math.max(1, familySize - 1))}
                  className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200"
                >
                  −
                </button>
                <span className="text-lg font-bold text-slate-900 w-8 text-center">{familySize}</span>
                <button
                  onClick={() => setFamilySize(familySize + 1)}
                  className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 mb-3">
              <button
                onClick={() => setNeedsMedical(!needsMedical)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  needsMedical ? "border-red-300 bg-red-50" : "border-slate-200"
                }`}
              >
                <Heart className={`h-4 w-4 ${needsMedical ? "text-red-500" : "text-slate-400"}`} />
                <span className={`text-sm font-medium ${needsMedical ? "text-red-700" : "text-slate-600"}`}>
                  Medical support needed
                </span>
              </button>
              <button
                onClick={() => setNeedsWheelchair(!needsWheelchair)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  needsWheelchair ? "border-blue-300 bg-blue-50" : "border-slate-200"
                }`}
              >
                <Accessibility className={`h-4 w-4 ${needsWheelchair ? "text-blue-500" : "text-slate-400"}`} />
                <span className={`text-sm font-medium ${needsWheelchair ? "text-blue-700" : "text-slate-600"}`}>
                  Wheelchair accessible
                </span>
              </button>
            </div>

            <Button
              onClick={() => setShowMatching(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              <Search className="h-4 w-4 mr-2" />
              Find Best Match
            </Button>
          </CardContent>
        </Card>

        {/* Shelter List */}
        <div className="space-y-3">
          {sortedShelters.map((shelter, i) => {
            const score = getMatchScore(shelter);
            const remaining = shelter.capacity - shelter.occupancy;
            const occupancyPercent = Math.round((shelter.occupancy / shelter.capacity) * 100);

            return (
              <motion.div
                key={shelter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`border-slate-100 shadow-sm hover:shadow-md transition-all ${
                  showMatching && score >= 80 ? "ring-2 ring-emerald-400" : ""
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 text-sm">{shelter.name}</h3>
                          <Badge className={`text-[10px] px-1.5 py-0 ${statusStyles[shelter.status]}`}>
                            {shelter.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {shelter.address} · {shelter.distance}
                        </p>
                      </div>
                      {showMatching && (
                        <div className={`text-right ${score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-slate-400"}`}>
                          <p className="text-lg font-bold">{score}%</p>
                          <p className="text-[10px] font-medium">match</p>
                        </div>
                      )}
                    </div>

                    {/* Capacity Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>Capacity: {shelter.occupancy}/{shelter.capacity}</span>
                        <span>{remaining} spots left</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            occupancyPercent >= 90
                              ? "bg-red-500"
                              : occupancyPercent >= 70
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {shelter.medicalSupport && (
                        <Badge className="text-[10px] bg-red-50 text-red-600 border border-red-200">
                          <Heart className="h-2.5 w-2.5 mr-0.5" /> Medical
                        </Badge>
                      )}
                      {shelter.wheelchairAccessible && (
                        <Badge className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200">
                          <Accessibility className="h-2.5 w-2.5 mr-0.5" /> Accessible
                        </Badge>
                      )}
                      {shelter.familyFriendly && (
                        <Badge className="text-[10px] bg-purple-50 text-purple-600 border border-purple-200">
                          <Users className="h-2.5 w-2.5 mr-0.5" /> Family
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full rounded-xl text-xs font-semibold"
                      disabled={shelter.status === "full"}
                    >
                      <Navigation className="h-3.5 w-3.5 mr-1.5" />
                      {shelter.status === "full" ? "Currently Full" : "Navigate Here"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
