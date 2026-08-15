import { and, desc, eq, sql } from "drizzle-orm";
import { memberships } from "@/db/schema";

export const FREE_CANCELLATION_HOURS = 12;

export const UNLIMITED_CREDITS = 999;

export function hoursUntil(iso: string, now = new Date()): number {
  return (new Date(iso).getTime() - now.getTime()) / 36e5;
}

export async function activeMembershipFor(
  db: typeof import("@/db").db,
  userId: number,
) {
  const today = new Date().toISOString().slice(0, 10);

  return db
    .select()
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, userId),
        eq(memberships.status, "active"),
        sql`${memberships.endDate} >= ${today}`,
      ),
    )
    .orderBy(desc(memberships.endDate))
    .get();
}