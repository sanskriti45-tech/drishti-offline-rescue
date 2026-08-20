import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    type: v.union(
      v.literal("flood"),
      v.literal("earthquake"),
      v.literal("fire"),
      v.literal("cyclone"),
      v.literal("landslide"),
      v.literal("collapse"),
    ),
    title: v.string(),
    description: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    affectedCount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const disasterId = await ctx.db.insert("disasters", {
      ...args,
      status: "active",
      reportedBy: userId,
    });

    return disasterId;
  },
});

export const list = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("flood"),
        v.literal("earthquake"),
        v.literal("fire"),
        v.literal("cyclone"),
        v.literal("landslide"),
        v.literal("collapse"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    if (args.type) {
      return await ctx.db
        .query("disasters")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("disasters").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("disasters") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
