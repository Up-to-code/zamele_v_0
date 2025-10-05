// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - Made fields optional to handle existing data
  users: defineTable({
    // Core user information
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    userType: v.union(v.literal("student"), v.literal("teacher")),
    
    // Academic information
    universityId: v.optional(v.id("universities")),
    sectionId: v.optional(v.id("sections")),
    year: v.optional(v.string()),
    
    // Avatar fields
    avatarUrl: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    
    // Permissions and status
    isBlocked: v.optional(v.boolean()), // New: if user is blocked
    canComment: v.optional(v.boolean()),
    canCreateCommunity: v.optional(v.boolean()), // Groups/communities
    canCreateCourse: v.optional(v.boolean()), // New: create courses
    canCreateUniversity: v.optional(v.boolean()), // New: create universities
    isVerified: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    
    // Subscription and points
    plan: v.optional(v.union(v.literal("free"), v.literal("pro"), v.literal("max"))),
    points: v.optional(v.number()),
    
    // Tags for badges
    tags: v.optional(v.array(v.string())),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    lastLoginAt: v.number(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_email", ["email"])
    .index("by_userType", ["userType"])
    .index("by_university", ["universityId"])
    .index("by_section", ["sectionId"])
    .index("by_plan", ["plan"])
    .index("by_isVerified", ["isVerified"])
    .index("by_isActive", ["isActive"])
    .index("by_lastLogin", ["lastLoginAt"])
    .index("by_points", ["points"])
    .index("by_tags", ["tags"])
    .index("by_created", ["createdAt"]),

  // Universities table
  universities: defineTable({
    nameAr: v.string(),
    nameEn: v.optional(v.string()),
    code: v.string(),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_city", ["city"])
    .index("by_isActive", ["isActive"]),

  // Sections table
  sections: defineTable({
    nameAr: v.string(),
    nameEn: v.optional(v.string()),
    code: v.string(),
    universityId: v.id("universities"),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_university", ["universityId"])
    .index("by_code", ["code"])
    .index("by_isActive", ["isActive"]),

  // Communities table
  communities: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    universityId: v.optional(v.id("universities")),
    sectionId: v.optional(v.id("sections")),
    creatorId: v.id("users"),
    memberCount: v.optional(v.number()),
    isPrivate: v.optional(v.boolean()),
    requiresApproval: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    avatarStorageId: v.optional(v.id("_storage")),
    bannerStorageId: v.optional(v.id("_storage")),
    heroTagline: v.optional(v.string()),
    rules: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creator", ["creatorId"])
    .index("by_university", ["universityId"])
    .index("by_section", ["sectionId"])
    .index("by_private", ["isPrivate"])
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"])
    .index("by_memberCount", ["memberCount"]),

  // Community memberships
  communityMembers: defineTable({
    communityId: v.id("communities"),
    userId: v.id("users"),
    role: v.union(v.literal("member"), v.literal("moderator"), v.literal("admin")),
    status: v.union(v.literal("active"), v.literal("pending"), v.literal("banned")),
    joinedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_community", ["communityId"])
    .index("by_user", ["userId"])
    .index("by_community_user", ["communityId", "userId"])
    .index("by_role", ["role"])
    .index("by_status", ["status"]),

  // Courses table
  courses: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    universityId: v.optional(v.id("universities")),
    sectionId: v.optional(v.id("sections")),
    creatorId: v.id("users"),
    duration: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    thumbnailStorageId: v.optional(v.id("_storage")),
    isActive: v.optional(v.boolean()),
    enrollmentCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creator", ["creatorId"])
    .index("by_university", ["universityId"])
    .index("by_section", ["sectionId"])
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"]),

  // Course enrollments
  courseEnrollments: defineTable({
    courseId: v.id("courses"),
    userId: v.id("users"),
    progress: v.optional(v.number()),
    enrolledAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_course", ["courseId"])
    .index("by_user", ["userId"])
    .index("by_user_course", ["userId", "courseId"]),

  // Events table
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    universityId: v.optional(v.id("universities")),
    sectionId: v.optional(v.id("sections")),
    creatorId: v.id("users"),
    date: v.number(),
    location: v.optional(v.string()),
    maxParticipants: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    bannerStorageId: v.optional(v.id("_storage")),
    isActive: v.optional(v.boolean()),
    participantCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creator", ["creatorId"])
    .index("by_university", ["universityId"])
    .index("by_section", ["sectionId"])
    .index("by_date", ["date"])
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"]),

  // Event participants
  eventParticipants: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
    status: v.union(v.literal("registered"), v.literal("attended"), v.literal("cancelled")),
    registeredAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_user_event", ["userId", "eventId"]),

  // Posts table
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
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
    upvotes: v.optional(v.number()),
    downvotes: v.optional(v.number()),
    commentCount: v.optional(v.number()),
    viewCount: v.optional(v.number()),
    averageRating: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
    isLocked: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_community", ["communityId"])
    .index("by_university", ["universityId"])
    .index("by_section", ["sectionId"])
    .index("by_type", ["type"])
    .index("by_created", ["createdAt"])
    .index("by_pinned", ["isPinned"])
    .index("by_locked", ["isLocked"])
    .index("by_deleted", ["isDeleted"])
    .index("by_upvotes", ["upvotes"])
    .index("by_averageRating", ["averageRating"])
    .index("by_viewCount", ["viewCount"]),

  // Comments table
  comments: defineTable({
    content: v.string(),
    authorId: v.id("users"),
    postId: v.id("posts"),
    parentCommentId: v.optional(v.id("comments")),
    level: v.optional(v.number()),
    upvotes: v.optional(v.number()),
    downvotes: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentCommentId"])
    .index("by_created", ["createdAt"])
    .index("by_deleted", ["isDeleted"])
    .index("by_level", ["level"]),

  // Votes table
  votes: defineTable({
    userId: v.id("users"),
    targetId: v.string(),
    targetType: v.union(v.literal("post"), v.literal("comment")),
    voteType: v.union(v.literal("upvote"), v.literal("downvote")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_target", ["targetId"])
    .index("by_user_target", ["userId", "targetId"])
    .index("by_target_type", ["targetType"]),

  // Ratings table
  ratings: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    score: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"])
    .index("by_user_post", ["userId", "postId"]),

  // Notifications table
  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("comment"),
      v.literal("reply"),
      v.literal("vote"),
      v.literal("mention"),
      v.literal("community_invite"),
      v.literal("community_join"),
      v.literal("post_pinned"),
      v.literal("system"),
      v.literal("announcement")
    ),
    title: v.string(),
    message: v.string(),
    relatedId: v.optional(v.string()),
    relatedType: v.optional(v.union(
      v.literal("post"),
      v.literal("comment"),
      v.literal("community"),
      v.literal("user")
    )),
    actionUrl: v.optional(v.string()),
    isRead: v.optional(v.boolean()),
    priority: v.optional(v.union(v.literal("low"), v.literal("normal"), v.literal("high"))),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_read", ["isRead"])
    .index("by_created", ["createdAt"])
    .index("by_priority", ["priority"])
    .index("by_type", ["type"]),

  // User sessions
  userSessions: defineTable({
    userId: v.id("users"),
    deviceId: v.optional(v.string()),
    deviceType: v.optional(v.union(v.literal("mobile"), v.literal("web"), v.literal("tablet"))),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    location: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    startedAt: v.number(),
    lastActiveAt: v.number(),
    endedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_device", ["deviceId"])
    .index("by_active", ["isActive"])
    .index("by_lastActive", ["lastActiveAt"]),

  // Plan changes
  planChanges: defineTable({
    userId: v.id("users"),
    fromPlan: v.union(v.literal("free"), v.literal("pro"), v.literal("max")),
    toPlan: v.union(v.literal("free"), v.literal("pro"), v.literal("max")),
    paymentId: v.optional(v.string()),
    paymentProvider: v.optional(v.union(v.literal("paypal"), v.literal("stripe"), v.literal("admin"))),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("refunded")),
    createdAt: v.number(),
    processedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"])
    .index("by_payment", ["paymentId"]),

  // Reports
  reports: defineTable({
    reporterId: v.id("users"),
    targetId: v.string(),
    targetType: v.union(v.literal("post"), v.literal("comment"), v.literal("user"), v.literal("community")),
    reason: v.union(
      v.literal("spam"),
      v.literal("harassment"),
      v.literal("inappropriate_content"),
      v.literal("misinformation"),
      v.literal("copyright"),
      v.literal("other")
    ),
    description: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("reviewed"), v.literal("resolved"), v.literal("dismissed")),
    moderatorId: v.optional(v.id("users")),
    moderatorNotes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_reporter", ["reporterId"])
    .index("by_target", ["targetId"])
    .index("by_status", ["status"])
    .index("by_moderator", ["moderatorId"])
    .index("by_created", ["createdAt"]),

  // System settings
  systemSettings: defineTable({
    key: v.string(),
    value: v.string(),
    type: v.union(v.literal("string"), v.literal("number"), v.literal("boolean"), v.literal("json")),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    updatedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_category", ["category"])
    .index("by_public", ["isPublic"]),

  // Group sections
  groupSections: defineTable({
    communityId: v.id("communities"),
    name: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_community", ["communityId"])
    .index("by_order", ["order"]),
});