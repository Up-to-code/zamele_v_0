// convex/users.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Helper function to get user by clerk ID
 * Usage: Use this in any mutation/query that needs to fetch user data by Clerk ID
 * Example: const user = await getUserByClerkId(ctx, "user_123");
 */
async function getUserByClerkId(ctx: any, clerkUserId: string) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkUserId", (q: any) => q.eq("clerkUserId", clerkUserId))
    .unique();
  if (!user) throw new Error("User not found");
  return user;
}

/**
 * Update specific user profile fields
 * This is the missing function that's causing the error
 */
export const updateProfileFields = mutation({
  args: {
    clerkUserId: v.string(),
    universityId: v.optional(v.string()),
    sectionId: v.optional(v.string()),
    year: v.optional(v.string()),
    name: v.optional(v.string()),
    userType: v.optional(v.union(v.literal("student"), v.literal("teacher"))),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId);

    const update: any = { updatedAt: Date.now() };
    if (args.universityId !== undefined) update.universityId = args.universityId as Id<"universities"> | undefined;
    if (args.sectionId !== undefined) update.sectionId = args.sectionId as Id<"sections"> | undefined;
    if (args.year !== undefined) update.year = args.year;
    if (args.name !== undefined) update.name = args.name;
    if (args.userType !== undefined) update.userType = args.userType;

    // Handle avatar
    if (args.avatarStorageId !== undefined) {
      update.avatarStorageId = args.avatarStorageId;
      update.avatarUrl = await ctx.storage.getUrl(args.avatarStorageId) ?? undefined;
    }

    await ctx.db.patch(user._id, update);
    return user._id;
  },
});

/**
 * Helper function to get safe field values with defaults
 * Usage: Use this when returning user data to ensure all fields have safe default values
 * Example: const safeUser = getUserWithDefaults(user);
 */
function getUserWithDefaults(user: any) {
  return {
    ...user,
    isBlocked: user.isBlocked ?? false,
    canComment: user.canComment ?? true,
    canCreateCommunity: user.canCreateCommunity ?? false,
    canCreateCourse: user.canCreateCourse ?? false,
    canCreateUniversity: user.canCreateUniversity ?? false,
    isVerified: user.isVerified ?? false,
    isActive: user.isActive ?? true,
    plan: user.plan ?? 'free',
    points: user.points ?? 0,
    tags: user.tags ?? [],
  };
}

/**
 * Migration function to fix invalid section IDs
 * Usage: Run this once to clean up existing data with invalid section IDs
 * Run with: npx convex run users:migrateUserSectionIds
 */
export const migrateUserSectionIds = mutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    for (const user of users) {
      // If sectionId is a string like "bus", set it to undefined
      if (user.sectionId && typeof user.sectionId === "string" && !user.sectionId.includes("|")) {
        await ctx.db.patch(user._id, {
          sectionId: undefined,
          updatedAt: Date.now()
        });
      }
    }
    
    return `Migrated ${users.length} users`;
  },
});

/**
 * Create or update a user from Clerk authentication
 * Usage: Call this when a user signs in or updates their profile via Clerk
 * Example: 
 * const userId = await convex.mutation(users.upsertFromClerk, {
 *   clerkUserId: "user_123",
 *   email: "user@example.com",
 *   name: "John Doe",
 *   userType: "student"
 * });
 */
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
    isBlocked: v.optional(v.boolean()), // NEW: Block user status
    canCreateCommunity: v.optional(v.boolean()),
    canCreateCourse: v.optional(v.boolean()), // NEW: Permission to create courses
    canCreateUniversity: v.optional(v.boolean()), // NEW: Permission to create universities
    isVerified: v.optional(v.boolean()),
    plan: v.optional(v.union(v.literal("free"), v.literal("pro"), v.literal("max"))),
    points: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q: any) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    // Generate avatar URL if storage ID is provided
    let avatarUrl = args.avatarUrl;
    if (args.avatarStorageId) {
      avatarUrl = await ctx.storage.getUrl(args.avatarStorageId) ?? undefined;
    }

    if (existing) {
      // Update existing user with safe defaults and proper ID types
      const updateData = {
        email: args.email,
        name: args.name,
        userType: args.userType,
        universityId: args.universityId as Id<"universities"> | undefined,
        sectionId: args.sectionId as Id<"sections"> | undefined,
        year: args.year,
        avatarUrl,
        avatarStorageId: args.avatarStorageId,
        isBlocked: args.isBlocked ?? existing.isBlocked ?? false, // NEW: Handle blocked status
        canComment: existing.canComment ?? true,
        canCreateCommunity: args.canCreateCommunity ?? existing.canCreateCommunity ?? false,
        canCreateCourse: args.canCreateCourse ?? existing.canCreateCourse ?? false, // NEW: Handle course creation
        canCreateUniversity: args.canCreateUniversity ?? existing.canCreateUniversity ?? false, // NEW: Handle university creation
        isVerified: args.isVerified ?? existing.isVerified ?? false,
        isActive: existing.isActive ?? true,
        plan: args.plan ?? existing.plan ?? 'free',
        points: args.points ?? existing.points ?? 0,
        tags: args.tags ?? existing.tags ?? [],
        lastLoginAt: now,
        updatedAt: now,
      };

      await ctx.db.patch(existing._id, updateData);
      return existing._id;
    }

    // Create new user with defaults and proper ID types
    const id = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      userType: args.userType,
      universityId: args.universityId as Id<"universities"> | undefined,
      sectionId: args.sectionId as Id<"sections"> | undefined,
      year: args.year,
      avatarUrl,
      avatarStorageId: args.avatarStorageId,
      isBlocked: args.isBlocked ?? false, // NEW: Default to not blocked
      canComment: true,
      canCreateCommunity: args.canCreateCommunity ?? false,
      canCreateCourse: args.canCreateCourse ?? false, // NEW: Default no course creation
      canCreateUniversity: args.canCreateUniversity ?? false, // NEW: Default no university creation
      isVerified: args.isVerified ?? false,
      isActive: true,
      plan: args.plan ?? "free",
      points: args.points ?? 0,
      tags: args.tags ?? [],
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

/**
 * Fetch user by Clerk ID
 * Usage: Get user data by their Clerk authentication ID
 * Example: const user = await convex.query(users.getByClerkId, { clerkUserId: "user_123" });
 */
export const getByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q: any) => q.eq("clerkUserId", clerkUserId))
      .unique();
    if (!user) return null;

    // Ensure avatar URL is fresh
    const avatarUrl = user.avatarStorageId
      ? await ctx.storage.getUrl(user.avatarStorageId) ?? user.avatarUrl
      : user.avatarUrl;

    // Return user with safe defaults
    return {
      ...getUserWithDefaults(user),
      avatarUrl,
    };
  },
});

/**
 * Update specific user profile fields
 * Usage: Update user profile information
 * Example: 
 * await convex.mutation(users.updateProfile, {
 *   clerkUserId: "user_123",
 *   name: "New Name",
 *   universityId: "university_456"
 * });
 */
export const updateProfile = mutation({
  args: {
    clerkUserId: v.string(),
    universityId: v.optional(v.string()),
    sectionId: v.optional(v.string()),
    year: v.optional(v.string()),
    name: v.optional(v.string()),
    userType: v.optional(v.union(v.literal("student"), v.literal("teacher"))),
    avatarStorageId: v.optional(v.id("_storage")),
    isBlocked: v.optional(v.boolean()), // NEW: Can block/unblock user
    canCreateCommunity: v.optional(v.boolean()),
    canCreateCourse: v.optional(v.boolean()), // NEW: Update course creation permission
    canCreateUniversity: v.optional(v.boolean()), // NEW: Update university creation permission
    isVerified: v.optional(v.boolean()),
    plan: v.optional(v.union(v.literal("free"), v.literal("pro"), v.literal("max"))),
    points: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId);

    const update: any = { updatedAt: Date.now() };
    if (args.universityId !== undefined) update.universityId = args.universityId as Id<"universities"> | undefined;
    if (args.sectionId !== undefined) update.sectionId = args.sectionId as Id<"sections"> | undefined;
    if (args.year !== undefined) update.year = args.year;
    if (args.name !== undefined) update.name = args.name;
    if (args.userType !== undefined) update.userType = args.userType;
    if (args.isBlocked !== undefined) update.isBlocked = args.isBlocked; // NEW: Handle blocking
    if (args.canCreateCommunity !== undefined) update.canCreateCommunity = args.canCreateCommunity;
    if (args.canCreateCourse !== undefined) update.canCreateCourse = args.canCreateCourse; // NEW: Handle course permission
    if (args.canCreateUniversity !== undefined) update.canCreateUniversity = args.canCreateUniversity; // NEW: Handle university permission
    if (args.isVerified !== undefined) update.isVerified = args.isVerified;
    if (args.plan !== undefined) update.plan = args.plan;
    if (args.points !== undefined) update.points = args.points;
    if (args.tags !== undefined) update.tags = args.tags;

    // Handle avatar
    if (args.avatarStorageId !== undefined) {
      update.avatarStorageId = args.avatarStorageId;
      update.avatarUrl = args.avatarStorageId
        ? await ctx.storage.getUrl(args.avatarStorageId) ?? undefined
        : undefined;
    }

    await ctx.db.patch(user._id, update);
    return user._id;
  },
});

/**
 * Block or unblock a user
 * Usage: Prevent a user from accessing the platform
 * Example: await convex.mutation(users.blockUser, { clerkUserId: "user_123", isBlocked: true });
 */
export const blockUser = mutation({
  args: {
    clerkUserId: v.string(),
    isBlocked: v.boolean(),
  },
  handler: async (ctx, { clerkUserId, isBlocked }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    await ctx.db.patch(user._id, {
      isBlocked,
      updatedAt: Date.now(),
    });
    return user._id;
  },
});

/**
 * Update user permissions
 * Usage: Grant or revoke specific permissions to a user
 * Example:
 * await convex.mutation(users.updatePermissions, {
 *   clerkUserId: "user_123",
 *   canCreateCourse: true,
 *   canCreateUniversity: false
 * });
 */
export const updatePermissions = mutation({
  args: {
    clerkUserId: v.string(),
    canCreateCommunity: v.optional(v.boolean()),
    canCreateCourse: v.optional(v.boolean()),
    canCreateUniversity: v.optional(v.boolean()),
    canComment: v.optional(v.boolean()),
  },
  handler: async (ctx, { clerkUserId, ...permissions }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    
    const update: any = { updatedAt: Date.now() };
    if (permissions.canCreateCommunity !== undefined) update.canCreateCommunity = permissions.canCreateCommunity;
    if (permissions.canCreateCourse !== undefined) update.canCreateCourse = permissions.canCreateCourse;
    if (permissions.canCreateUniversity !== undefined) update.canCreateUniversity = permissions.canCreateUniversity;
    if (permissions.canComment !== undefined) update.canComment = permissions.canComment;

    await ctx.db.patch(user._id, update);
    return user._id;
  },
});

/**
 * Soft delete a user (mark as inactive)
 * Usage: Deactivate a user account without permanent deletion
 * Example: await convex.mutation(users.softDeleteUser, { clerkUserId: "user_123" });
 */
export const softDeleteUser = mutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    await ctx.db.patch(user._id, {
      isActive: false,
      updatedAt: Date.now(),
    });
    return user._id;
  },
});

/**
 * Generate upload URL for files
 * Usage: Get a URL to upload files to Convex storage
 * Example: const uploadUrl = await convex.mutation(users.generateUploadUrl);
 */
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Get avatar URL from storage ID
 * Usage: Convert storage ID to accessible URL
 * Example: const avatarUrl = await convex.query(users.getAvatarUrl, { storageId: "storage_123" });
 */
export const getAvatarUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId) ?? null;
  },
});

/**
 * Fetch user profile with basic stats
 * Usage: Get comprehensive user profile with post counts and activity stats
 * Example: const profile = await convex.query(users.getUserProfile, { clerkUserId: "user_123" });
 */
export const getUserProfile = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q: any) => q.eq("clerkUserId", clerkUserId))
      .unique();
    if (!user) return null;

    // Get counts instead of full data for better performance
    const postCount = await ctx.db
      .query("posts")
      .withIndex("by_author", (q: any) => q.eq("authorId", user._id))
      .filter((q: any) => q.neq(q.field("isDeleted"), true))
      .collect()
      .then(posts => posts.length);

    const commentCount = await ctx.db
      .query("comments")
      .withIndex("by_author", (q: any) => q.eq("authorId", user._id))
      .filter((q: any) => q.neq(q.field("isDeleted"), true))
      .collect()
      .then(comments => comments.length);

    const communityCount = await ctx.db
      .query("communityMembers")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .filter((q: any) => q.eq(q.field("status"), "active"))
      .collect()
      .then(memberships => memberships.length);

    const avatarUrl = user.avatarStorageId
      ? await ctx.storage.getUrl(user.avatarStorageId) ?? user.avatarUrl
      : user.avatarUrl;

    // Return user with safe defaults
    const userWithDefaults = getUserWithDefaults(user);

    return {
      ...userWithDefaults,
      avatarUrl,
      stats: {
        postCount,
        commentCount,
        communityCount,
      },
    };
  },
});

/**
 * Update user points
 * Usage: Set user's points to a specific value
 * Example: await convex.mutation(users.updateUserPoints, { clerkUserId: "user_123", points: 100 });
 */
export const updateUserPoints = mutation({
  args: {
    clerkUserId: v.string(),
    points: v.number(),
  },
  handler: async (ctx, { clerkUserId, points }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    await ctx.db.patch(user._id, {
      points,
      updatedAt: Date.now(),
    });
    return user._id;
  },
});

/**
 * Add points to user (increment)
 * Usage: Add points to user's current total
 * Example: await convex.mutation(users.addUserPoints, { clerkUserId: "user_123", pointsToAdd: 10 });
 */
export const addUserPoints = mutation({
  args: {
    clerkUserId: v.string(),
    pointsToAdd: v.number(),
  },
  handler: async (ctx, { clerkUserId, pointsToAdd }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    const currentPoints = user.points ?? 0;
    const newPoints = currentPoints + pointsToAdd;
    await ctx.db.patch(user._id, {
      points: newPoints,
      updatedAt: Date.now(),
    });
    return { _id: user._id, points: newPoints };
  },
});

/**
 * Add tag to user
 * Usage: Add a badge or tag to user profile
 * Example: await convex.mutation(users.addUserTag, { clerkUserId: "user_123", tag: "Top Contributor" });
 */
export const addUserTag = mutation({
  args: {
    clerkUserId: v.string(),
    tag: v.string(),
  },
  handler: async (ctx, { clerkUserId, tag }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    const currentTags = user.tags ?? [];
    const tags = [...currentTags, tag];
    await ctx.db.patch(user._id, {
      tags: [...new Set(tags)], // Avoid duplicates
      updatedAt: Date.now(),
    });
    return user._id;
  },
});

/**
 * Remove tag from user
 * Usage: Remove a badge or tag from user profile
 * Example: await convex.mutation(users.removeUserTag, { clerkUserId: "user_123", tag: "Top Contributor" });
 */
export const removeUserTag = mutation({
  args: {
    clerkUserId: v.string(),
    tag: v.string(),
  },
  handler: async (ctx, { clerkUserId, tag }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    const currentTags = user.tags ?? [];
    const tags = currentTags.filter((t: string) => t !== tag);
    await ctx.db.patch(user._id, {
      tags,
      updatedAt: Date.now(),
    });
    return user._id;
  },
});

/**
 * Create a post
 * Usage: Create a new post in a community or general feed
 * Example: 
 * const postId = await convex.mutation(users.createPost, {
 *   clerkUserId: "user_123",
 *   title: "My Post",
 *   content: "Post content",
 *   type: "discussion"
 * });
 */
export const createPost = mutation({
  args: {
    clerkUserId: v.string(),
    title: v.string(),
    content: v.string(),
    communityId: v.optional(v.id("communities")),
    universityId: v.optional(v.id("universities")),
    sectionId: v.optional(v.id("sections")),
    type: v.union(
      v.literal("text"),
      v.literal("question"),
      v.literal("announcement"),
      v.literal("discussion"),
      v.literal("poll")
    ),
    tags: v.optional(v.array(v.string())),
    attachments: v.optional(v.array(v.id("_storage"))),
    isAnonymous: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId);

    const postId = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      authorId: user._id,
      communityId: args.communityId,
      universityId: args.universityId,
      sectionId: args.sectionId,
      type: args.type,
      tags: args.tags ?? [],
      attachments: args.attachments ?? [],
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      viewCount: 0,
      averageRating: 0,
      isAnonymous: args.isAnonymous ?? false,
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return postId;
  },
});

/**
 * Delete a post (soft delete)
 * Usage: Mark a post as deleted without permanent removal
 * Example: await convex.mutation(users.deletePost, { postId: "post_123", clerkUserId: "user_123" });
 */
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { postId, clerkUserId }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    const post = await ctx.db.get(postId);
    if (!post || post.authorId !== user._id) {
      throw new Error("Post not found or not authorized");
    }

    await ctx.db.patch(postId, {
      isDeleted: true,
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return postId;
  },
});

/**
 * Create a comment
 * Usage: Add a comment to a post
 * Example:
 * const commentId = await convex.mutation(users.createComment, {
 *   clerkUserId: "user_123",
 *   postId: "post_123",
 *   content: "Great post!"
 * });
 */
export const createComment = mutation({
  args: {
    clerkUserId: v.string(),
    postId: v.id("posts"),
    content: v.string(),
    parentCommentId: v.optional(v.id("comments")),
    isAnonymous: v.optional(v.boolean()),
  },
  handler: async (ctx, { clerkUserId, postId, content, parentCommentId, isAnonymous }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");

    const parentComment = parentCommentId ? await ctx.db.get(parentCommentId) : null;
    // FIX: Use nullish coalescing to handle undefined level
    const level = parentComment ? ((parentComment.level ?? 0) + 1) : 0;

    const commentId = await ctx.db.insert("comments", {
      content,
      authorId: user._id,
      postId,
      parentCommentId,
      level,
      upvotes: 0,
      downvotes: 0,
      isAnonymous: isAnonymous ?? false,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update post's comment count
    await ctx.db.patch(postId, {
      commentCount: (post.commentCount ?? 0) + 1,
      updatedAt: Date.now(),
    });

    return commentId;
  },
});

/**
 * Delete a comment (soft delete)
 * Usage: Mark a comment as deleted
 * Example: await convex.mutation(users.deleteComment, { commentId: "comment_123", clerkUserId: "user_123" });
 */
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { commentId, clerkUserId }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    const comment = await ctx.db.get(commentId);
    if (!comment || comment.authorId !== user._id) throw new Error("Comment not found or not authorized");

    await ctx.db.patch(commentId, {
      isDeleted: true,
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update post's comment count
    const post = await ctx.db.get(comment.postId);
    if (post) {
      await ctx.db.patch(post._id, {
        commentCount: Math.max(0, (post.commentCount ?? 0) - 1),
        updatedAt: Date.now(),
      });
    }

    return commentId;
  },
});

/**
 * Add or update a vote (like/dislike)
 * Usage: Vote on posts or comments
 * Example:
 * await convex.mutation(users.toggleVote, {
 *   clerkUserId: "user_123",
 *   targetId: "post_123",
 *   targetType: "post",
 *   voteType: "upvote"
 * });
 */
export const toggleVote = mutation({
  args: {
    clerkUserId: v.string(),
    targetId: v.string(),
    targetType: v.union(v.literal("post"), v.literal("comment")),
    voteType: v.union(v.literal("upvote"), v.literal("downvote")),
  },
  handler: async (ctx, { clerkUserId, targetId, targetType, voteType }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_target", (q: any) =>
        q.eq("userId", user._id).eq("targetId", targetId)
      )
      .unique();

    const now = Date.now();
    if (existingVote) {
      // Update existing vote
      if (existingVote.voteType !== voteType) {
        await ctx.db.patch(existingVote._id, {
          voteType,
          updatedAt: now,
        });

        // Update counts
        const target = await ctx.db.get(targetId as Id<"posts" | "comments">);
        if (target) {
          const update: any = { updatedAt: now };
          if (voteType === "upvote") {
            update.upvotes = (target.upvotes ?? 0) + 1;
            update.downvotes = Math.max(0, (target.downvotes ?? 0) - (existingVote.voteType === "downvote" ? 1 : 0));
          } else {
            update.downvotes = (target.downvotes ?? 0) + 1;
            update.upvotes = Math.max(0, (target.upvotes ?? 0) - (existingVote.voteType === "upvote" ? 1 : 0));
          }
          await ctx.db.patch(targetId as Id<"posts" | "comments">, update);
        }
      }
      return existingVote._id;
    }

    // Create new vote
    const voteId = await ctx.db.insert("votes", {
      userId: user._id,
      targetId,
      targetType,
      voteType,
      createdAt: now,
      updatedAt: now,
    });

    // Update target counts
    const target = await ctx.db.get(targetId as Id<"posts" | "comments">);
    if (target) {
      const update: any = { updatedAt: now };
      if (voteType === "upvote") {
        update.upvotes = (target.upvotes ?? 0) + 1;
      } else {
        update.downvotes = (target.downvotes ?? 0) + 1;
      }
      await ctx.db.patch(targetId as Id<"posts" | "comments">, update);
    }

    return voteId;
  },
});

/**
 * Add or update a rating
 * Usage: Rate a post (0-5 stars)
 * Example: await convex.mutation(users.addRating, { clerkUserId: "user_123", postId: "post_123", score: 4 });
 */
export const addRating = mutation({
  args: {
    clerkUserId: v.string(),
    postId: v.id("posts"),
    score: v.number(), // 0-5
  },
  handler: async (ctx, { clerkUserId, postId, score }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");

    const existingRating = await ctx.db
      .query("ratings")
      .withIndex("by_user_post", (q: any) => q.eq("userId", user._id).eq("postId", postId))
      .unique();

    const now = Date.now();
    let ratingId: string;
    if (existingRating) {
      // Update existing rating
      await ctx.db.patch(existingRating._id, {
        score,
        updatedAt: now,
      });
      ratingId = existingRating._id;
    } else {
      // Create new rating
      ratingId = await ctx.db.insert("ratings", {
        userId: user._id,
        postId,
        score,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Recalculate average rating for the post
    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_post", (q: any) => q.eq("postId", postId))
      .collect();
    const averageRating = ratings.length
      ? ratings.reduce((sum: number, r: any) => sum + r.score, 0) / ratings.length
      : 0;

    await ctx.db.patch(postId, {
      averageRating,
      updatedAt: now,
    });

    return ratingId;
  },
});

/**
 * Create a community (group)
 * Usage: Create a new community/group
 * Example:
 * const communityId = await convex.mutation(users.createCommunity, {
 *   clerkUserId: "user_123",
 *   name: "My Community",
 *   description: "Community description"
 * });
 */
export const createCommunity = mutation({
  args: {
    clerkUserId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    universityId: v.optional(v.id("universities")),
    sectionId: v.optional(v.id("sections")),
    isPrivate: v.optional(v.boolean()),
    requiresApproval: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    avatarStorageId: v.optional(v.id("_storage")),
    bannerStorageId: v.optional(v.id("_storage")),
    heroTagline: v.optional(v.string()),
    rules: v.optional(v.string()),
  },
  handler: async (ctx, { clerkUserId, ...args }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    const canCreateCommunity = user.canCreateCommunity ?? false;
    if (!canCreateCommunity) throw new Error("User not authorized to create communities");

    const now = Date.now();
    const communityId = await ctx.db.insert("communities", {
      name: args.name,
      description: args.description,
      universityId: args.universityId,
      sectionId: args.sectionId,
      creatorId: user._id,
      memberCount: 1,
      isPrivate: args.isPrivate ?? false,
      requiresApproval: args.requiresApproval ?? false,
      tags: args.tags ?? [],
      avatarStorageId: args.avatarStorageId,
      bannerStorageId: args.bannerStorageId,
      heroTagline: args.heroTagline,
      rules: args.rules,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Add creator as admin
    await ctx.db.insert("communityMembers", {
      communityId,
      userId: user._id,
      role: "admin",
      status: "active",
      joinedAt: now,
      updatedAt: now,
    });

    return communityId;
  },
});

/**
 * Join a community
 * Usage: User joins a community
 * Example: await convex.mutation(users.joinCommunity, { clerkUserId: "user_123", communityId: "community_123" });
 */
export const joinCommunity = mutation({
  args: {
    clerkUserId: v.string(),
    communityId: v.id("communities"),
  },
  handler: async (ctx, { clerkUserId, communityId }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    const community = await ctx.db.get(communityId);
    if (!community) throw new Error("Community not found");

    const existingMembership = await ctx.db
      .query("communityMembers")
      .withIndex("by_community_user", (q: any) =>
        q.eq("communityId", communityId).eq("userId", user._id)
      )
      .unique();

    if (existingMembership) {
      if (existingMembership.status === "active") {
        throw new Error("User already a member");
      }
      // Update status if pending or banned
      await ctx.db.patch(existingMembership._id, {
        status: community.requiresApproval ? "pending" : "active",
        updatedAt: Date.now(),
      });
      return existingMembership._id;
    }

    const now = Date.now();
    const membershipId = await ctx.db.insert("communityMembers", {
      communityId,
      userId: user._id,
      role: "member",
      status: community.requiresApproval ? "pending" : "active",
      joinedAt: now,
      updatedAt: now,
    });

    if (!community.requiresApproval) {
      await ctx.db.patch(communityId, {
        memberCount: (community.memberCount ?? 0) + 1,
        updatedAt: now,
      });
    }

    return membershipId;
  },
});

/**
 * Create a course
 * Usage: Create a new course (teachers only)
 * Example:
 * const courseId = await convex.mutation(users.createCourse, {
 *   clerkUserId: "user_123",
 *   title: "Math 101",
 *   description: "Basic mathematics course"
 * });
 */
export const createCourse = mutation({
  args: {
    clerkUserId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    universityId: v.optional(v.id("universities")),
    sectionId: v.optional(v.id("sections")),
    duration: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    thumbnailStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { clerkUserId, ...args }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    
    // Check if user has permission to create courses
    const canCreateCourse = user.canCreateCourse ?? false;
    if (!canCreateCourse && user.userType !== "teacher") {
      throw new Error("User not authorized to create courses");
    }

    const now = Date.now();
    const courseId = await ctx.db.insert("courses", {
      title: args.title,
      description: args.description,
      universityId: args.universityId,
      sectionId: args.sectionId,
      creatorId: user._id,
      duration: args.duration,
      tags: args.tags ?? [],
      thumbnailStorageId: args.thumbnailStorageId,
      isActive: true,
      enrollmentCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    return courseId;
  },
});

/**
 * Enroll in a course
 * Usage: User enrolls in a course
 * Example: await convex.mutation(users.enrollInCourse, { clerkUserId: "user_123", courseId: "course_123" });
 */
export const enrollInCourse = mutation({
  args: {
    clerkUserId: v.string(),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { clerkUserId, courseId }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    const course = await ctx.db.get(courseId);
    if (!course) throw new Error("Course not found");

    const existingEnrollment = await ctx.db
      .query("courseEnrollments")
      .withIndex("by_user_course", (q: any) => q.eq("userId", user._id).eq("courseId", courseId))
      .unique();
    if (existingEnrollment) throw new Error("User already enrolled");

    const now = Date.now();
    const enrollmentId = await ctx.db.insert("courseEnrollments", {
      courseId,
      userId: user._id,
      progress: 0,
      enrolledAt: now,
    });

    // Update course enrollment count
    await ctx.db.patch(courseId, {
      enrollmentCount: (course.enrollmentCount ?? 0) + 1,
      updatedAt: now,
    });

    return enrollmentId;
  },
});

/**
 * Create an event
 * Usage: Create a new event
 * Example:
 * const eventId = await convex.mutation(users.createEvent, {
 *   clerkUserId: "user_123",
 *   title: "Study Group",
 *   date: Date.now() + 86400000 // Tomorrow
 * });
 */
export const createEvent = mutation({
  args: {
    clerkUserId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    universityId: v.optional(v.id("universities")),
    sectionId: v.optional(v.id("sections")),
    date: v.number(),
    location: v.optional(v.string()),
    maxParticipants: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    bannerStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { clerkUserId, ...args }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    const now = Date.now();
    const eventId = await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      universityId: args.universityId,
      sectionId: args.sectionId,
      creatorId: user._id,
      date: args.date,
      location: args.location,
      maxParticipants: args.maxParticipants,
      tags: args.tags ?? [],
      bannerStorageId: args.bannerStorageId,
      isActive: true,
      participantCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    return eventId;
  },
});

/**
 * Register for an event
 * Usage: User registers to attend an event
 * Example: await convex.mutation(users.registerForEvent, { clerkUserId: "user_123", eventId: "event_123" });
 */
export const registerForEvent = mutation({
  args: {
    clerkUserId: v.string(),
    eventId: v.id("events"),
  },
  handler: async (ctx, { clerkUserId, eventId }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");
    if (event.maxParticipants && (event.participantCount ?? 0) >= event.maxParticipants) {
      throw new Error("Event is full");
    }

    const existingRegistration = await ctx.db
      .query("eventParticipants")
      .withIndex("by_user_event", (q: any) => q.eq("userId", user._id).eq("eventId", eventId))
      .unique();
    if (existingRegistration) throw new Error("User already registered");

    const now = Date.now();
    const participantId = await ctx.db.insert("eventParticipants", {
      eventId,
      userId: user._id,
      status: "registered",
      registeredAt: now,
    });

    // Update event participant count
    await ctx.db.patch(eventId, {
      participantCount: (event.participantCount ?? 0) + 1,
      updatedAt: now,
    });

    return participantId;
  },
});

/**
 * Create a group section
 * Usage: Create sections within a community for organizing content
 * Example:
 * const sectionId = await convex.mutation(users.createGroupSection, {
 *   clerkUserId: "user_123",
 *   communityId: "community_123",
 *   name: "Announcements",
 *   order: 1
 * });
 */
export const createGroupSection = mutation({
  args: {
    clerkUserId: v.string(),
    communityId: v.id("communities"),
    name: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, { clerkUserId, communityId, name, description, order }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_community_user", (q: any) =>
        q.eq("communityId", communityId).eq("userId", user._id)
      )
      .unique();
    if (!membership || !["admin", "moderator"].includes(membership.role)) {
      throw new Error("User not authorized to create sections");
    }

    const now = Date.now();
    const sectionId = await ctx.db.insert("groupSections", {
      communityId,
      name,
      description,
      order,
      createdAt: now,
      updatedAt: now,
    });

    return sectionId;
  },
});

/**
 * Delete a group section
 * Usage: Delete a section from a community
 * Example: await convex.mutation(users.deleteGroupSection, { clerkUserId: "user_123", sectionId: "section_123" });
 */
export const deleteGroupSection = mutation({
  args: {
    clerkUserId: v.string(),
    sectionId: v.id("groupSections"),
  },
  handler: async (ctx, { clerkUserId, sectionId }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    const section = await ctx.db.get(sectionId);
    if (!section) throw new Error("Section not found");

    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_community_user", (q: any) =>
        q.eq("communityId", section.communityId).eq("userId", user._id)
      )
      .unique();
    if (!membership || !["admin", "moderator"].includes(membership.role)) {
      throw new Error("User not authorized to delete sections");
    }

    await ctx.db.delete(sectionId);
    return sectionId;
  },
});

/**
 * Get user's posts with pagination
 * Usage: Fetch user's posts with pagination support
 * Example:
 * const posts = await convex.query(users.getUserPosts, {
 *   clerkUserId: "user_123",
 *   paginationOpts: { numItems: 20 }
 * });
 */
export const getUserPosts = query({
  args: { 
    clerkUserId: v.string(),
    paginationOpts: v.any()
  },
  handler: async (ctx, { clerkUserId, paginationOpts }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q: any) => q.eq("clerkUserId", clerkUserId))
      .unique();
    if (!user) return null;

    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q: any) => q.eq("authorId", user._id))
      .filter((q: any) => q.neq(q.field("isDeleted"), true))
      .order("desc")
      .paginate(paginationOpts);
  },
});

/**
 * Fetch leaderboard (top users by points)
 * Usage: Get top users ranked by points
 * Example: const leaderboard = await convex.query(users.getLeaderboard, { limit: 10 });
 */
export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 50 }) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_points", (q: any) => q.gte("points", 0))
      .order("desc")
      .take(limit);
    
    return Promise.all(users.map(async (user) => {
      const userWithDefaults = getUserWithDefaults(user);
      const avatarUrl = user.avatarStorageId
        ? await ctx.storage.getUrl(user.avatarStorageId) ?? user.avatarUrl
        : user.avatarUrl;
      
      return {
        ...userWithDefaults,
        avatarUrl,
      };
    }));
  },
});

/**
 * Get users with specific permissions
 * Usage: Find users who have specific permissions (for admin purposes)
 * Example:
 * const courseCreators = await convex.query(users.getUsersByPermission, {
 *   permissionType: "canCreateCourse",
 *   value: true
 * });
 */
export const getUsersByPermission = query({
  args: {
    permissionType: v.union(
      v.literal("canCreateCommunity"),
      v.literal("canCreateCourse"), 
      v.literal("canCreateUniversity")
    ),
    value: v.boolean(),
  },
  handler: async (ctx, { permissionType, value }) => {
    const users = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field(permissionType), value))
      .collect();
    
    return Promise.all(users.map(async (user) => {
      const userWithDefaults = getUserWithDefaults(user);
      const avatarUrl = user.avatarStorageId
        ? await ctx.storage.getUrl(user.avatarStorageId) ?? user.avatarUrl
        : user.avatarUrl;
      
      return {
        ...userWithDefaults,
        avatarUrl,
      };
    }));
  },
});