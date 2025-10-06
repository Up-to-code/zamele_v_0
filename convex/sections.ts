// convex/sections.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all sections
 * Usage: Fetch all sections for display in forms
 * Example: const sections = await convex.query(api.sections.list);
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("sections").collect();
  },
});

/**
 * Get section by ID
 * Usage: Fetch specific section details
 * Example: const section = await convex.query(api.sections.getById, { id: "section_123" });
 */
export const getById = query({
  args: { id: v.id("sections") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/**
 * Get sections by university
 * Usage: Filter sections by university
 * Example: const sections = await convex.query(api.sections.getByUniversity, { universityId: "university_123" });
 */
export const getByUniversity = query({
  args: { universityId: v.id("universities") },
  handler: async (ctx, { universityId }) => {
    return await ctx.db
      .query("sections")
      .withIndex("by_university", (q) => q.eq("universityId", universityId))
      .collect();
  },
});