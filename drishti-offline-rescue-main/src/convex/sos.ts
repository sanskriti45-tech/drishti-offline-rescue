import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    message: v.optional(v.string()),
    offlineCreated: v.boolean(),
    peopleCount: v.optional(v.number()),
    hasInjured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const sosId = await ctx.db.insert("sosRequests", {
      userId,
      latitude: args.latitude,
      longitude: args.longitude,
      severity: args.severity,
      status: "pending",
      message: args.message,
      offlineCreated: args.offlineCreated,
      synced: true,
      peopleCount: args.peopleCount,
      hasInjured: args.hasInjured,
    });

    return sosId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sosRequests").order("desc").collect();
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sosRequests")
      .withIndex("by_synced", (q) => q.eq("synced", false))
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("sosRequests"),
    status: v.union(
      v.literal("pending"),
      v.literal("received"),
      v.literal("in_progress"),
      v.literal("resolved"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const markSynced = mutation({
  args: { id: v.id("sosRequests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { synced: true });
  },
});

export const getNearby = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    radiusKm: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("sosRequests").collect();
    const radius = args.radiusKm || 50;

    return all.filter((sos) => {
      const dist = haversineDistance(
        args.latitude,
        args.longitude,
        sos.latitude,
        sos.longitude,
      );
      return dist <= radius;
    });
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
