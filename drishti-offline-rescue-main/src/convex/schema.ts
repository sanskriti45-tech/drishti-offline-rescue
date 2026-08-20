import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  VICTIM: "victim",
  RESPONDER: "responder",
  VOLUNTEER: "volunteer",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.VICTIM),
  v.literal(ROLES.RESPONDER),
  v.literal(ROLES.VOLUNTEER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      phone: v.optional(v.string()),
      latitude: v.optional(v.number()),
      longitude: v.optional(v.number()),
    }).index("email", ["email"]),

    sosRequests: defineTable({
      userId: v.id("users"),
      latitude: v.number(),
      longitude: v.number(),
      severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
      status: v.union(v.literal("pending"), v.literal("received"), v.literal("in_progress"), v.literal("resolved")),
      message: v.optional(v.string()),
      offlineCreated: v.boolean(),
      synced: v.boolean(),
      peopleCount: v.optional(v.number()),
      hasInjured: v.optional(v.boolean()),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"])
      .index("by_synced", ["synced"]),

    disasters: defineTable({
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
      status: v.union(v.literal("active"), v.literal("contained"), v.literal("resolved")),
      affectedCount: v.number(),
      reportedBy: v.id("users"),
    })
      .index("by_type", ["type"])
      .index("by_status", ["status"]),

    shelters: defineTable({
      name: v.string(),
      latitude: v.number(),
      longitude: v.number(),
      capacity: v.number(),
      currentOccupancy: v.number(),
      medicalSupport: v.boolean(),
      wheelchairAccessible: v.boolean(),
      familyFriendly: v.boolean(),
      status: v.union(v.literal("open"), v.literal("full"), v.literal("closed")),
    }).index("by_status", ["status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
