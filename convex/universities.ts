// convex/universities.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all universities
 * Usage: Fetch all universities for display in forms
 * Example: const universities = await convex.query(api.universities.list);
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("universities").collect();
  },
});

/**
 * Get university by ID
 * Usage: Fetch specific university details
 * Example: const university = await convex.query(api.universities.getById, { id: "university_123" });
 */
export const getById = query({
  args: { id: v.id("universities") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/**
 * Get universities by city
 * Usage: Filter universities by location
 * Example: const universities = await convex.query(api.universities.getByCity, { city: "Riyadh" });
 */
export const getByCity = query({
  args: { city: v.string() },
  handler: async (ctx, { city }) => {
    return await ctx.db
      .query("universities")
      .withIndex("by_city", (q) => q.eq("city", city))
      .collect();
  },
});