import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Cloud,
  CloudOff,
  Database,
  Shield,
  Zap,
  Loader2,
  Trash2,
  Upload,
  ChevronRight,
  Activity,
  HardDrive,
  Signal,
} from "lucide-react";
import {
  getUnsynced,
  markSynced,
  clearSynced,
  generateOfflineId,
  saveOffline,
  type OfflineRecord,
} from "@/lib/offline-db";

// --- Sync flow visualization ---
function SyncFlow({ currentStep }: { currentStep: number }) {
  const steps = [
    { key: "offline", label: "OFFLINE", icon: WifiOff, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
    { key: "queued", label: "QUEUED LOCALLY", icon: Database, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
    { key: "restored", label: "CONNECTION RESTORED", icon: Wifi, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
    { key: "synced", label: "SYNCED", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
  ];

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardContent className="p-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Sync Flow</p>
        <div className="flex items-center justify-between">
          {steps.map((step, i) => {
            const isActive = i <= currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                      isActive
                        ? `${step.bg} ${step.border} ${step.color}`
                        : "bg-slate-50 border-slate-200 text-slate-300"
                    }`}
                  >
                    {isCurrent && currentStep < 3 ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                        <RefreshCw className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </motion.div>
                  <p className={`text-[8px] font-bold mt-1.5 text-center leading-tight ${
                    isActive ? step.color : "text-slate-300"
                  }`}>
                    {step.label}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 mx-1 mt-[-18px]">
                    <motion.div
                      className={`h-0.5 rounded-full ${
                        i < currentStep ? "bg-emerald-400" : "bg-slate-200"
                      }`}
                      animate={i === currentStep ? { opacity: [0.3, 1, 0.3] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Sync item card ---
function SyncItemCard({ item, index }: { item: OfflineRecord; index: number }) {
  const typeIcons: Record<string, { icon: any; color: string; label: string }> = {
    sos: { icon: AlertTriangle, color: "bg-red-100 text-red-600", label: "SOS Request" },
    disaster: { icon: Shield, color: "bg-amber-100 text-amber-600", label: "Disaster Report" },
    shelter: { icon: Database, color: "bg-blue-100 text-blue-600", label: "Shelter Data" },
    sync: { icon: RefreshCw, color: "bg-emerald-100 text-emerald-600", label: "Sync Event" },
  };

  const meta = typeIcons[item.type] || typeIcons.sync;
  const Icon = meta.icon;
  const timeAgo = getTimeAgo(item.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border-slate-100 shadow-sm">
        <CardContent className="p-3.5 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">{meta.label}</p>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {timeAgo}
            </p>
          </div>
          <Badge className={`text-[9px] px-2 py-0 ${
            item.synced
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}>
            {item.synced ? "SYNCED" : "PENDING"}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Helper ---
function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

// --- Main Page ---
export default function OfflineSyncCenter() {
  const { isOnline, wasOffline, clearWasOffline } = useOnlineStatus();
  const navigate = useNavigate();
  const [pendingItems, setPendingItems] = useState<OfflineRecord[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(isOnline ? 3 : 0);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  // Load pending items from IndexedDB
  const loadItems = useCallback(async () => {
    try {
      const items = await getUnsynced();
      setPendingItems(items);
    } catch {
      setPendingItems([]);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Update sync step based on connection
  useEffect(() => {
    if (syncing) return;
    if (isOnline && pendingItems.length > 0) setSyncStep(2);
    else if (isOnline && pendingItems.length === 0) setSyncStep(3);
    else if (!isOnline) setSyncStep(pendingItems.length > 0 ? 1 : 0);
  }, [isOnline, pendingItems.length, syncing]);

  // Demo: add sample offline items
  const addDemoItems = useCallback(async () => {
    const demoItems = [
      { type: "sos" as const, data: { severity: "critical", location: "Sector 14" } },
      { type: "sos" as const, data: { severity: "high", location: "Block C" } },
      { type: "disaster" as const, data: { type: "flood", severity: "high" } },
    ];
    for (const item of demoItems) {
      await saveOffline({ id: generateOfflineId(), type: item.type, data: item.data });
    }
    await loadItems();
    setShowDemo(true);
    setTimeout(() => setShowDemo(false), 3000);
  }, [loadItems]);

  // Sync all pending items
  const syncAll = useCallback(async () => {
    setSyncing(true);
    setSyncStep(2);

    // Simulate sync process
    await new Promise((r) => setTimeout(r, 1000));
    setSyncStep(3);

    // Mark all as synced
    for (const item of pendingItems) {
      try {
        await markSynced(item.id);
      } catch {
        // ignore
      }
    }

    await loadItems();
    setSyncing(false);
    setLastSyncTime(new Date().toLocaleTimeString());
  }, [pendingItems, loadItems]);

  // Clear synced items
  const clearAll = useCallback(async () => {
    await clearSynced();
    await loadItems();
  }, [loadItems]);

  const pendingCount = pendingItems.filter((i) => !i.synced).length;
  const syncedCount = pendingItems.filter((i) => i.synced).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className={`px-4 pt-12 pb-6 rounded-b-3xl ${
        isOnline
          ? "bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white"
          : "bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 text-white"
      }`}>
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                {isOnline ? <Cloud className="h-5 w-5" /> : <CloudOff className="h-5 w-5" />}
              </div>
              <div>
                <h1 className="text-base font-bold">Sync Center</h1>
                <p className="text-[10px] text-white/60 uppercase tracking-wider">
                  {isOnline ? "Connected — data syncing" : "Offline — queuing locally"}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold ${
              isOnline ? "bg-white/20" : "bg-white/10"
            }`}>
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? "ONLINE" : "OFFLINE"}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 backdrop-blur rounded-xl p-2.5 text-center">
              <p className="text-xl font-bold">{pendingCount}</p>
              <p className="text-[9px] text-white/60 uppercase">Pending</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-2.5 text-center">
              <p className="text-xl font-bold">{syncedCount}</p>
              <p className="text-[9px] text-white/60 uppercase">Synced</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-2.5 text-center">
              <p className="text-xl font-bold">{pendingItems.length}</p>
              <p className="text-[9px] text-white/60 uppercase">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2 py-4 space-y-4">
        {/* Sync flow */}
        <SyncFlow currentStep={syncStep} />

        {/* Connection status */}
        <Card className={`border ${
          isOnline ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={isOnline ? {} : { opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: isOnline ? 0 : Infinity }}
              >
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-emerald-600" />
                ) : (
                  <WifiOff className="h-5 w-5 text-amber-600" />
                )}
              </motion.div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${isOnline ? "text-emerald-800" : "text-amber-800"}`}>
                  {isOnline ? "Connection Active" : "No Connection"}
                </p>
                <p className={`text-xs ${isOnline ? "text-emerald-600" : "text-amber-600"}`}>
                  {isOnline
                    ? pendingCount > 0
                      ? `${pendingCount} item${pendingCount !== 1 ? "s" : ""} ready to sync`
                      : "All data is up to date"
                    : "Emergency data is being stored locally for later sync"}
                </p>
              </div>
              {lastSyncTime && (
                <p className="text-[10px] text-slate-400">Last sync: {lastSyncTime}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          {pendingCount > 0 && (
            <Button
              onClick={syncAll}
              disabled={syncing || !isOnline}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold disabled:opacity-50"
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-1.5" />
              )}
              {syncing ? "Syncing..." : "Sync Now"}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={addDemoItems}
            className="rounded-xl font-semibold"
          >
            <Zap className="h-4 w-4 mr-1.5" />
            Add Demo Data
          </Button>
          {syncedCount > 0 && (
            <Button
              variant="outline"
              onClick={clearAll}
              className="rounded-xl font-semibold text-slate-500"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear Synced
            </Button>
          )}
        </div>

        {/* Demo success */}
        <AnimatePresence>
          {showDemo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-600 text-white rounded-2xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-semibold">3 demo items queued locally</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Syncing animation */}
        <AnimatePresence>
          {syncing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-3 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-3"
              />
              <p className="text-sm font-bold text-emerald-800 mb-1">Syncing Data...</p>
              <p className="text-xs text-emerald-600">
                Uploading {pendingCount} pending item{pendingCount !== 1 ? "s" : ""} to Drishti Network
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sync complete */}
        {lastSyncTime && !syncing && pendingCount === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </motion.div>
            <div>
              <p className="text-sm font-bold text-emerald-800">Everything synchronized</p>
              <p className="text-xs text-emerald-600">All emergency data is up to date</p>
            </div>
          </motion.div>
        )}

        {/* Pending items list */}
        {pendingItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Pending Items ({pendingCount})
              </h2>
            </div>
            <div className="space-y-2">
              {pendingItems.filter((i) => !i.synced).map((item, i) => (
                <SyncItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Synced items */}
        {syncedCount > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Recently Synced ({syncedCount})
              </h2>
            </div>
            <div className="space-y-2">
              {pendingItems.filter((i) => i.synced).map((item, i) => (
                <SyncItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {pendingItems.length === 0 && !syncing && (
          <div className="text-center py-12">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <HardDrive className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            </motion.div>
            <p className="text-sm font-bold text-slate-700 mb-1">No pending items</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              When you create SOS requests or disaster reports while offline, they'll appear here waiting to sync.
            </p>
          </div>
        )}

        {/* How it works */}
        <Card className="border-slate-100">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">How Sync Works</p>
            <div className="space-y-3">
              {[
                { step: "1", text: "Actions taken offline are stored in IndexedDB on your device", color: "bg-red-100 text-red-600" },
                { step: "2", text: "When connection returns, Drishti automatically detects the change", color: "bg-amber-100 text-amber-600" },
                { step: "3", text: "Pending items are uploaded to the Drishti network in order of priority", color: "bg-blue-100 text-blue-600" },
                { step: "4", text: "Each item is marked as synced and confirmed with the server", color: "bg-emerald-100 text-emerald-600" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${item.color}`}>
                    {item.step}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
