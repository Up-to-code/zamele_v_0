import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const upsertFromClerk = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    userType: v.union(v.literal("student"), v.literal("teacher")),
    universityId: v.optional(v.string()),
    sectionId: v.optional(v.string()),
    year: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    canCreateCommunity: v.optional(v.boolean()),
    isVerified: v.optional(v.boolean()),
    plan: v.optional(v.union(v.literal("free"), v.literal("pro"), v.literal("max"))),
    points: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (existing) {
      // If updating avatarStorageId, generate the avatarUrl
      let avatarUrl = args.avatarUrl;
      if (args.avatarStorageId) {
        avatarUrl = await ctx.storage.getUrl(args.avatarStorageId) || undefined;
      }

      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        userType: args.userType,
        universityId: args.universityId,
        sectionId: args.sectionId,
        year: args.year,
        avatarUrl,
        avatarStorageId: args.avatarStorageId,
        canCreateCommunity: args.canCreateCommunity,
        isVerified: args.isVerified,
        plan: args.plan,
        points: args.points,
        lastLoginAt: now,
        updatedAt: now,
      });
      return existing._id;
    }

    // For new users, generate avatarUrl from storageId if provided
    let avatarUrl = args.avatarUrl;
    if (args.avatarStorageId) {
      avatarUrl = await ctx.storage.getUrl(args.avatarStorageId) || undefined;
    }

    const id = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      userType: args.userType,
      universityId: args.universityId,
      sectionId: args.sectionId,
      year: args.year,
      avatarUrl,
      avatarStorageId: args.avatarStorageId,
      canCreateCommunity: args.canCreateCommunity ?? false,
      isVerified: args.isVerified ?? false,
      plan: args.plan ?? "free",
      points: args.points ?? 0,
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const getByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();
    return user ?? null;
  },
});

export const updateProfileFields = mutation({
  args: {
    clerkUserId: v.string(),
    universityId: v.optional(v.string()),
    sectionId: v.optional(v.string()),
    year: v.optional(v.string()),
    name: v.optional(v.string()),
    userType: v.optional(v.union(v.literal("student"), v.literal("teacher"))),
    avatarStorageId: v.optional(v.id("_storage")),
    canCreateCommunity: v.optional(v.boolean()),
    isVerified: v.optional(v.boolean()),
    plan: v.optional(v.union(v.literal("free"), v.literal("pro"), v.literal("max"))),
    points: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
      
    if (!existing) {
      throw new Error("User not found");
    }
    
    const update: any = { updatedAt: Date.now() };
    
    if (args.universityId !== undefined) update.universityId = args.universityId;
    if (args.sectionId !== undefined) update.sectionId = args.sectionId;
    if (args.year !== undefined) update.year = args.year;
    if (args.name !== undefined) update.name = args.name;
    if (args.userType !== undefined) update.userType = args.userType;
    if (args.canCreateCommunity !== undefined) update.canCreateCommunity = args.canCreateCommunity;
    if (args.isVerified !== undefined) update.isVerified = args.isVerified;
    if (args.plan !== undefined) update.plan = args.plan;
    if (args.points !== undefined) update.points = args.points;
    
    // Handle avatar storage - if storage ID is provided, generate URL
    if (args.avatarStorageId !== undefined) {
      update.avatarStorageId = args.avatarStorageId;
      update.avatarUrl = await ctx.storage.getUrl(args.avatarStorageId) || undefined;
    }
    
    await ctx.db.patch(existing._id, update);
    return existing._id;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    // Generate an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

export const getAvatarUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    // Get a URL for a storage ID
    return await ctx.storage.getUrl(storageId);
  },
});

// Additional utility functions
export const getUserProfile = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();
    
    if (!user) return null;
    
    // Get avatar URL if storage ID exists
    let avatarUrl = user.avatarUrl;
    if (user.avatarStorageId) {
      avatarUrl = await ctx.storage.getUrl(user.avatarStorageId) || user.avatarUrl;
    }
    
    return {
      ...user,
      avatarUrl
    };
  },
});

export const updateUserPoints = mutation({
  args: {
    clerkUserId: v.string(),
    points: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
      
    if (!user) {
      throw new Error("User not found");
    }
    
    await ctx.db.patch(user._id, {
      points: args.points,
      updatedAt: Date.now(),
    });
    
    return user._id;
  },
});

export const addUserPoints = mutation({
  args: {
    clerkUserId: v.string(),
    pointsToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
      
    if (!user) {
      throw new Error("User not found");
    }
    
    const newPoints = (user.points || 0) + args.pointsToAdd;
    
    await ctx.db.patch(user._id, {
      points: newPoints,
      updatedAt: Date.now(),
    });
    
    return {
      _id: user._id,
      points: newPoints
    };
  },
});