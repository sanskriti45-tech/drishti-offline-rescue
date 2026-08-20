import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  MapPin,
  Shield,
  Heart,
  Wifi,
  WifiOff,
  ArrowRight,
  Phone,
  Users,
  Zap,
} from "lucide-react";

// Illustrated rescue team SVG characters
function RescueTeamIllustration() {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-[340px]">
      {/* Background circles */}
      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-emerald-100/60 rounded-full blur-2xl"
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-sky-100/60 rounded-full blur-xl"
        animate={{ scale: [1.05, 1, 1.05], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Rescuer Characters */}
      <motion.div
        className="absolute bottom-4 left-[15%]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0 }}
      >
        <FirefighterChar />
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-[30%]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, delay: 0.3 }}
      >
        <PoliceChar />
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-[45%]"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, delay: 0.6 }}
      >
        <DoctorChar />
      </motion.div>
      <motion.div
        className="absolute bottom-4 right-[30%]"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.1, repeat: Infinity, delay: 0.9 }}
      >
        <ParamedicChar />
      </motion.div>
      <motion.div
        className="absolute bottom-4 right-[15%]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.9, repeat: Infinity, delay: 1.2 }}
      >
        <RescueChar />
      </motion.div>

      {/* Floating SOS Signal */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="relative">
          <motion.div
            className="absolute -inset-4 bg-red-400/20 rounded-full blur-lg"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="relative bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm tracking-wider shadow-lg shadow-red-500/30">
            SOS
          </div>
        </div>
      </motion.div>

      {/* Signal waves from SOS */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-1/2 -translate-x-1/2 border-2 border-emerald-400/30 rounded-full"
          style={{ width: 40 + i * 30, height: 40 + i * 30 }}
          animate={{
            scale: [1, 1.5],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function FirefighterChar() {
  return (
    <svg width="64" height="90" viewBox="0 0 64 90">
      {/* Body */}
      <rect x="16" y="35" width="32" height="40" rx="8" fill="#DC2626" />
      <rect x="20" y="42" width="8" height="8" rx="2" fill="#FCA5A5" />
      {/* Head */}
      <circle cx="32" cy="22" r="16" fill="#FBBF24" />
      <circle cx="32" cy="18" r="14" fill="#FCD34D" />
      {/* Helmet */}
      <path d="M18 18 Q32 4 46 18 L46 22 Q32 10 18 22Z" fill="#DC2626" />
      <rect x="28" y="8" width="8" height="6" rx="2" fill="#EF4444" />
      {/* Face */}
      <circle cx="27" cy="20" r="2" fill="#1E293B" />
      <circle cx="37" cy="20" r="2" fill="#1E293B" />
      <path d="M28 26 Q32 30 36 26" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Legs */}
      <rect x="20" y="72" width="10" height="14" rx="4" fill="#1E3A5F" />
      <rect x="34" y="72" width="10" height="14" rx="4" fill="#1E3A5F" />
    </svg>
  );
}

function PoliceChar() {
  return (
    <svg width="64" height="90" viewBox="0 0 64 90">
      <rect x="16" y="35" width="32" height="40" rx="8" fill="#1E40AF" />
      <rect x="20" y="42" width="8" height="8" rx="2" fill="#93C5FD" />
      <circle cx="32" cy="22" r="16" fill="#FBBF24" />
      <circle cx="32" cy="18" r="14" fill="#FCD34D" />
      {/* Police cap */}
      <rect x="16" y="10" width="32" height="8" rx="3" fill="#1E40AF" />
      <rect x="24" y="7" width="16" height="6" rx="2" fill="#2563EB" />
      <circle cx="32" cy="10" r="2" fill="#FCD34D" />
      {/* Badge */}
      <circle cx="32" cy="50" r="4" fill="#FCD34D" />
      <circle cx="27" cy="20" r="2" fill="#1E293B" />
      <circle cx="37" cy="20" r="2" fill="#1E293B" />
      <path d="M28 26 Q32 30 36 26" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="20" y="72" width="10" height="14" rx="4" fill="#1E293B" />
      <rect x="34" y="72" width="10" height="14" rx="4" fill="#1E293B" />
    </svg>
  );
}

function DoctorChar() {
  return (
    <svg width="64" height="90" viewBox="0 0 64 90">
      <rect x="16" y="35" width="32" height="40" rx="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
      {/* Red cross */}
      <rect x="28" y="46" width="8" height="16" rx="1" fill="#EF4444" />
      <rect x="24" y="50" width="16" height="8" rx="1" fill="#EF4444" />
      <circle cx="32" cy="22" r="16" fill="#FBBF24" />
      <circle cx="32" cy="18" r="14" fill="#FCD34D" />
      {/* Stethoscope hint */}
      <path d="M22 40 Q18 48 24 50" stroke="#6B7280" strokeWidth="1.5" fill="none" />
      <circle cx="27" cy="20" r="2" fill="#1E293B" />
      <circle cx="37" cy="20" r="2" fill="#1E293B" />
      <path d="M28 26 Q32 30 36 26" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="20" y="72" width="10" height="14" rx="4" fill="#374151" />
      <rect x="34" y="72" width="10" height="14" rx="4" fill="#374151" />
    </svg>
  );
}

function ParamedicChar() {
  return (
    <svg width="64" height="90" viewBox="0 0 64 90">
      <rect x="16" y="35" width="32" height="40" rx="8" fill="#059669" />
      <rect x="20" y="42" width="8" height="8" rx="2" fill="#6EE7B7" />
      <circle cx="32" cy="22" r="16" fill="#FBBF24" />
      <circle cx="32" cy="18" r="14" fill="#FCD34D" />
      {/* Cap */}
      <rect x="18" y="8" width="28" height="10" rx="4" fill="#059669" />
      <circle cx="27" cy="20" r="2" fill="#1E293B" />
      <circle cx="37" cy="20" r="2" fill="#1E293B" />
      <path d="M28 26 Q32 30 36 26" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="20" y="72" width="10" height="14" rx="4" fill="#065F46" />
      <rect x="34" y="72" width="10" height="14" rx="4" fill="#065F46" />
    </svg>
  );
}

function RescueChar() {
  return (
    <svg width="64" height="90" viewBox="0 0 64 90">
      <rect x="16" y="35" width="32" height="40" rx="8" fill="#F59E0B" />
      <rect x="20" y="42" width="8" height="8" rx="2" fill="#FDE68A" />
      <circle cx="32" cy="22" r="16" fill="#FBBF24" />
      <circle cx="32" cy="18" r="14" fill="#FCD34D" />
      {/* Hard hat */}
      <path d="M18 16 Q32 4 46 16 L44 20 Q32 10 20 20Z" fill="#F59E0B" />
      <rect x="22" y="18" width="20" height="3" rx="1" fill="#D97706" />
      <circle cx="27" cy="20" r="2" fill="#1E293B" />
      <circle cx="37" cy="20" r="2" fill="#1E293B" />
      <path d="M28 26 Q32 30 36 26" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="20" y="72" width="10" height="14" rx="4" fill="#78350F" />
      <rect x="34" y="72" width="10" height="14" rx="4" fill="#78350F" />
    </svg>
  );
}

function NetworkLostAnimation() {
  return (
    <motion.div
      className="flex items-center gap-3 bg-slate-900/80 text-white px-5 py-3 rounded-2xl backdrop-blur"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <WifiOff className="h-5 w-5 text-red-400" />
      <div>
        <p className="text-sm font-semibold tracking-wide">NETWORK LOST</p>
        <p className="text-xs text-slate-400">Drishti keeps working...</p>
      </div>
    </motion.div>
  );
}

function SignalHopAnimation() {
  return (
    <motion.div
      className="flex items-center gap-3 bg-emerald-900/80 text-white px-5 py-3 rounded-2xl backdrop-blur"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Zap className="h-5 w-5 text-emerald-400" />
      <div>
        <p className="text-sm font-semibold tracking-wide">MESH SIGNAL</p>
        <p className="text-xs text-emerald-300/70">Hopping through nearby devices</p>
      </div>
    </motion.div>
  );
}

function RescuedAnimation() {
  return (
    <motion.div
      className="flex items-center gap-3 bg-blue-900/80 text-white px-5 py-3 rounded-2xl backdrop-blur"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Shield className="h-5 w-5 text-blue-400" />
      <div>
        <p className="text-sm font-semibold tracking-wide">RESCUE DISPATCHED</p>
        <p className="text-xs text-blue-300/70">Team en route via safest path</p>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50 overflow-hidden">
      {/* Floating Nav */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-sm border border-emerald-100/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              DRISHTI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-slate-600 hover:text-emerald-600"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 shadow-lg shadow-emerald-600/20"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-100"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Offline-First Disaster Intelligence
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-4">
              DRISHTI
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-emerald-700 mb-3">
              When the Network Goes Dark,
              <br />
              No One Should Become Invisible.
            </p>
            <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              An offline-first disaster intelligence system that keeps victims
              reachable, helps rescuers find dangerous roads, and guides people to
              safer shelters — even when connectivity fails.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
          >
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-8 py-6 text-lg font-bold shadow-xl shadow-red-600/25 hover:shadow-red-600/40 transition-all w-full sm:w-auto"
              onClick={() => navigate("/auth?returnTo=/sos")}
            >
              <Phone className="mr-2 h-5 w-5" />
              SEND SOS
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-8 py-6 text-lg font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all w-full sm:w-auto"
              onClick={() => navigate("/auth?returnTo=/dashboard")}
            >
              Explore Drishti
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Rescue Team Illustration */}
          <RescueTeamIllustration />
        </div>
      </section>

      {/* How It Works - Story Flow */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              How Drishti Works
            </h2>
            <p className="text-slate-500 text-lg">
              Even without the internet, help finds a way.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-lg mx-auto">
            <NetworkLostAnimation />
            <SignalHopAnimation />
            <RescuedAnimation />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Built for When It Matters Most
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: AlertTriangle,
                title: "OFFLINE SOS",
                desc: "Send emergency signals even without internet. Your distress call hops through nearby devices until it reaches a responder.",
                color: "red",
              },
              {
                icon: MapPin,
                title: "SEE",
                desc: "AI-powered hazard detection identifies blocked roads, floods, fire, and collapsed buildings from photos.",
                color: "emerald",
              },
              {
                icon: Shield,
                title: "REACH",
                desc: "Invisible victims become visible. Offline SOS signals create high-priority rescue zones automatically.",
                color: "blue",
              },
              {
                icon: Heart,
                title: "SHELTER",
                desc: "Smart matching finds the right shelter based on family size, medical needs, and accessibility.",
                color: "purple",
              },
              {
                icon: Users,
                title: "COMMUNITY",
                desc: "Verified disaster updates from your community. Share information even in low-connectivity situations.",
                color: "amber",
              },
              {
                icon: Wifi,
                title: "MESH NETWORK",
                desc: "Signals travel device-to-device using Bluetooth and WiFi Direct when cellular networks fail.",
                color: "teal",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.color === "red"
                      ? "bg-red-50 text-red-600"
                      : feature.color === "emerald"
                      ? "bg-emerald-50 text-emerald-600"
                      : feature.color === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : feature.color === "purple"
                      ? "bg-purple-50 text-purple-600"
                      : feature.color === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-teal-50 text-teal-600"
                  } group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-50 to-emerald-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Every second counts.
            <br />
            Every life matters.
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            Join the network that doesn't go dark when everything else does.
          </p>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-10 py-7 text-lg font-bold shadow-xl shadow-emerald-600/25"
            onClick={() => navigate("/auth")}
          >
            Join Drishti
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-slate-400 text-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Eye className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-white">DRISHTI</span>
            <span>· Disaster Intelligence Platform</span>
          </div>
          <p>Built for the Drishti Hackathon</p>
        </div>
      </footer>
    </div>
  );
}

function Eye({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
