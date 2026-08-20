import { useState, useEffect, useCallback } from "react";

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      // Fallback to Delhi
      setLocation({ latitude: 28.6139, longitude: 77.2090 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message || "Location unavailable");
        setLoading(false);
        // Fallback to Delhi
        setLocation({ latitude: 28.6139, longitude: 77.2090 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { location, error, loading, refresh };
}
