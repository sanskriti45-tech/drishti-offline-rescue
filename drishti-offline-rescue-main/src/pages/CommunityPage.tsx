import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  ThumbsUp,
  MessageCircle,
  Share2,
  Shield,
  CheckCircle,
  Heart,
  AlertTriangle,
  Camera,
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  avatar: string;
  location: string;
  time: string;
  content: string;
  image?: string;
  verified: boolean;
  likes: number;
  comments: number;
  type: string;
}

const samplePosts: Post[] = [
  {
    id: "1",
    author: "Priya Sharma",
    avatar: "👩",
    location: "Sector 14, Delhi",
    time: "5 min ago",
    content: "Water level rising rapidly near our building. Multiple families on 3rd floor. Need immediate evacuation assistance. We have 2 elderly people who cannot climb stairs.",
    verified: true,
    likes: 24,
    comments: 8,
    type: "emergency",
  },
  {
    id: "2",
    author: "Rahul Kumar",
    avatar: "👨",
    location: "Noida, Block C",
    time: "15 min ago",
    content: "Road between Sector 12 and 14 is completely blocked by fallen tree. Emergency vehicles cannot pass. Need chainsaw or heavy equipment to clear.",
    verified: true,
    likes: 18,
    comments: 5,
    type: "hazard",
  },
  {
    id: "3",
    author: "Anita Devi",
    avatar: "👩‍🦱",
    location: "Gurugram, Phase 2",
    time: "28 min ago",
    content: "Community shelter at Sector 5 school has space for about 50 more people. We have food and water supplies. Medical volunteer available.",
    verified: false,
    likes: 42,
    comments: 12,
    type: "shelter",
  },
  {
    id: "4",
    author: "Dr. Amit Patel",
    avatar: "👨‍⚕️",
    location: "Red Cross Camp",
    time: "45 min ago",
    content: "Medical camp operational at Red Cross center. Treating minor injuries and distributing basic medications. Bring anyone who needs medical attention.",
    verified: true,
    likes: 67,
    comments: 15,
    type: "medical",
  },
  {
    id: "5",
    author: "Volunteer Team Delhi",
    avatar: "🧑‍🚒",
    location: "Multiple Locations",
    time: "1 hr ago",
    content: "Our team of 12 volunteers is conducting door-to-door checks in Sector 14. We've reached 80% of buildings. Will update with status of each block.",
    verified: true,
    likes: 89,
    comments: 22,
    type: "update",
  },
];

const typeStyles: Record<string, { color: string; icon: any; label: string }> = {
  emergency: { color: "bg-red-50 text-red-600 border-red-200", icon: AlertTriangle, label: "Emergency" },
  hazard: { color: "bg-amber-50 text-amber-600 border-amber-200", icon: Shield, label: "Hazard" },
  shelter: { color: "bg-blue-50 text-blue-600 border-blue-200", icon: Heart, label: "Shelter" },
  medical: { color: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: Heart, label: "Medical" },
  update: { color: "bg-purple-50 text-purple-600 border-purple-200", icon: Shield, label: "Update" },
};

export default function CommunityPage() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-bold mb-1">Community</h1>
          <p className="text-purple-200 text-xs">
            Real-time updates from your community
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2">
        {/* New Post */}
        <Card className="border-purple-100 shadow-sm mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-lg">
                📝
              </div>
              <input
                placeholder="Share an update..."
                className="flex-1 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
              />
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-4">
          {samplePosts.map((post, i) => {
            const style = typeStyles[post.type];
            const isLiked = likedPosts.has(post.id);

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-slate-100 shadow-sm">
                  <CardContent className="p-4">
                    {/* Author */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">
                        {post.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{post.author}</p>
                          {post.verified && (
                            <Badge className="text-[9px] px-1 py-0 bg-emerald-50 text-emerald-600 border border-emerald-200 gap-0.5">
                              <CheckCircle className="h-2.5 w-2.5" />
                              VERIFIED
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" />
                          {post.location} · {post.time}
                        </p>
                      </div>
                      <Badge className={`text-[10px] px-1.5 py-0 border ${style.color}`}>
                        {style.label}
                      </Badge>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      {post.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                          isLiked ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
                        {post.likes + (isLiked ? 1 : 0)}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors ml-auto">
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                      </button>
                    </div>
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
