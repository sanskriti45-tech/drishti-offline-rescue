import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("shelters").collect();
  },
});

export const findBestMatch = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    peopleCount: v.optional(v.number()),
    needsMedical: v.optional(v.boolean()),
    needsWheelchair: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("shelters").collect();
    const openShelters = all.filter((s) => s.status === "open");

    return openShelters
      .map((shelter) => {
        const dist = haversineDistance(
          args.latitude,
          args.longitude,
          shelter.latitude,
          shelter.longitude,
        );
        let score = 100;

        score -= Math.min(dist * 2, 30);

        const remaining = shelter.capacity - shelter.currentOccupancy;
        if (args.peopleCount && remaining < args.peopleCount) score -= 40;
        if (remaining < 5) score -= 20;
        if (args.needsMedical && !shelter.medicalSupport) score -= 30;
        if (args.needsWheelchair && !shelter.wheelchairAccessible) score -= 30;

        return {
          ...shelter,
          distance: Math.round(dist * 10) / 10,
          matchScore: Math.max(0, Math.round(score)),
          remainingCapacity: remaining,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  },
});

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
