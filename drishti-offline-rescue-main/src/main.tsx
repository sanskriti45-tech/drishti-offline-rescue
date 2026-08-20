import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const SOSPage = lazy(() => import("./pages/SOSPage.tsx"));
const MapPage = lazy(() => import("./pages/MapPage.tsx"));
const DisastersPage = lazy(() => import("./pages/DisastersPage.tsx"));
const ReportDisasterPage = lazy(() => import("./pages/ReportDisasterPage.tsx"));
const SheltersPage = lazy(() => import("./pages/SheltersPage.tsx"));
const CommunityPage = lazy(() => import("./pages/CommunityPage.tsx"));
const InvisibleVictimsPage = lazy(() => import("./pages/InvisibleVictimsPage.tsx"));
const HazardScannerPage = lazy(() => import("./pages/HazardScannerPage.tsx"));
const MissingPersonsPage = lazy(() => import("./pages/MissingPersonsPage.tsx"));
const ResponderDashboard = lazy(() => import("./pages/ResponderDashboard.tsx"));
const AmbulanceExperience = lazy(() => import("./pages/AmbulanceExperience.tsx"));
const VolunteerPage = lazy(() => import("./pages/VolunteerPage.tsx"));
const OfflineSyncCenter = lazy(() => import("./pages/OfflineSyncCenter.tsx"));
const SOSTrackingPage = lazy(() => import("./pages/SOSTrackingPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <span className="text-sm text-emerald-700 font-medium">Loading...</span>
      </div>
    </div>
  );
}

class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-6">
          <div className="max-w-md text-center bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-sm font-semibold text-slate-900 mb-2">Something went wrong</p>
            <p className="text-xs text-slate-500 break-words">{this.state.message}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/auth"
                element={<AuthPage redirectAfterAuth="/dashboard" />}
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/sos"
                element={
                  <RequireAuth>
                    <SOSPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/map"
                element={
                  <RequireAuth>
                    <MapPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/disasters"
                element={
                  <RequireAuth>
                    <DisastersPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/disasters/report"
                element={
                  <RequireAuth>
                    <ReportDisasterPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/shelters"
                element={
                  <RequireAuth>
                    <SheltersPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/community"
                element={
                  <RequireAuth>
                    <CommunityPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/invisible-victims"
                element={
                  <RequireAuth>
                    <InvisibleVictimsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/hazard-scanner"
                element={
                  <RequireAuth>
                    <HazardScannerPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/missing-persons"
                element={
                  <RequireAuth>
                    <MissingPersonsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/responder"
                element={
                  <RequireAuth>
                    <ResponderDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/ambulance"
                element={
                  <RequireAuth>
                    <AmbulanceExperience />
                  </RequireAuth>
                }
              />
              <Route
                path="/volunteer"
                element={
                  <RequireAuth>
                    <VolunteerPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/sync"
                element={
                  <RequireAuth>
                    <OfflineSyncCenter />
                  </RequireAuth>
                }
              />
              <Route
                path="/sos-tracking"
                element={
                  <RequireAuth>
                    <SOSTrackingPage />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
