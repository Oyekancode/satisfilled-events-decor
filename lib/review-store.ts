import { Redis } from "@upstash/redis";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type StoredReview = {
  id: string;
  // Secret that only ever goes out in the owner's notification email. It is
  // what proves a request to approve/reject really comes from that email.
  token: string;
  name: string;
  rating: number;
  text: string;
  locale: string;
  status: ReviewStatus;
  createdAt: string;
  decidedAt?: string;
};

// What visitors are allowed to see: never the id or the token.
export type PublicReview = {
  name: string;
  rating: number;
  text: string;
  createdAt: string;
};

// Every key this site writes starts with this, so it can safely share one
// Redis database with another project without ever touching its data.
const NS = "satisfilled:";
const REVIEWS_HASH = `${NS}reviews`;

// Vercel's Upstash integration may provide either set of variable names.
function config() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

export function isStoreConfigured() {
  return config() !== null;
}

function client() {
  const c = config();
  if (!c) throw new Error("Review storage is not configured");
  return new Redis(c);
}

export async function createPendingReview(input: {
  name: string;
  rating: number;
  text: string;
  locale: string;
}): Promise<StoredReview> {
  const review: StoredReview = {
    id: randomUUID(),
    token: randomBytes(24).toString("hex"),
    ...input,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await client().hset(REVIEWS_HASH, { [review.id]: review });
  return review;
}

export async function getReview(id: string): Promise<StoredReview | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return (await client().hget<StoredReview>(REVIEWS_HASH, id)) ?? null;
}

export function tokenMatches(review: StoredReview, token: string) {
  const a = Buffer.from(review.token);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function setReviewStatus(
  review: StoredReview,
  status: ReviewStatus
): Promise<StoredReview> {
  const updated: StoredReview = {
    ...review,
    status,
    decidedAt: new Date().toISOString(),
  };
  await client().hset(REVIEWS_HASH, { [review.id]: updated });
  return updated;
}

export async function listApprovedReviews(limit = 50): Promise<PublicReview[]> {
  if (!isStoreConfigured()) return [];
  const all = await client().hgetall<Record<string, StoredReview>>(REVIEWS_HASH);
  if (!all) return [];

  return Object.values(all)
    .filter((r) => r.status === "approved")
    .sort((a, b) => (b.decidedAt ?? "").localeCompare(a.decidedAt ?? ""))
    .slice(0, limit)
    .map(({ name, rating, text, createdAt }) => ({ name, rating, text, createdAt }));
}

// At most `limit` submissions per visitor per window. The address is hashed so
// we never store it as-is.
export async function allowSubmission(
  ip: string,
  limit = 3,
  windowSeconds = 3600
): Promise<boolean> {
  const key = `${NS}ratelimit:review:${createHash("sha256").update(ip).digest("hex").slice(0, 32)}`;
  const redis = client();
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSeconds);
  return count <= limit;
}
