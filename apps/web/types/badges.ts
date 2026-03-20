/* ═══════════════════════════════════════════════════════════════
   IAI Badge System — Type Definitions
   Intelligence · Artistry · International · iai.one
   ═══════════════════════════════════════════════════════════════ */

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'obsidian'

export type BadgePillar =
  | 'truth'       // Truth Shield — fact-checking reputation
  | 'knowledge'   // Knowledge Forge — learning & education
  | 'creator'     // Creator Guild — content quality
  | 'community'   // Community Honors — social impact
  | 'special'     // Special Marks — system/verified/rare

export interface BadgeDefinition {
  id: string
  name: string
  lore: string          // Short poetic description (the "why" behind the badge)
  description: string   // How to earn it
  pillar: BadgePillar
  tier: BadgeTier
  icon: string          // SVG path or emoji fallback
  xp: number           // Experience points awarded
  rarity: number       // 0-100 — percentage of users who have this
  animated?: boolean   // Whether it has special animation
  phase?: 1 | 2 | 3   // Which IAI phase this becomes available
}

export interface EarnedBadge {
  badgeId: string
  earnedAt: string    // ISO date
  context?: string    // e.g. "Post #42 reached 1,000 reactions"
}

export interface UserBadgeProfile {
  userId: string
  earned: EarnedBadge[]
  featured: string[]   // up to 5 badge IDs shown on profile
  xpTotal: number
}
