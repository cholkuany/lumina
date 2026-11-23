/**
 * Recommendation system: candidate generation -> scoring -> re-ranking.
 *
 * Signals
 *  1. copurchase  - customers who bought X also bought Y   (offline, from orders)
 *  2. coview      - customers who viewed X also viewed Y   (offline, from view events)
 *  3. complement  - Y is used together with X              (rules + merchant curation)
 *  4. popularity  - time-decayed sales + Bayesian rating   (offline, per product)
 *  5. promotion   - seller priority, capped and labelled   (field on product)
 *
 * Offline jobs write to `ProductAffinity`; the request path only does indexed reads.
 */
import mongoose from "mongoose"

// ---------- Types ----------

export type AffinityType = "copurchase" | "coview" | "complement"

/** Collection: ProductAffinity. Index: { sourceId: 1, type: 1, score: -1 } */
export interface ProductAffinity {
  sourceId: mongoose.Types.ObjectId
  targetId: mongoose.Types.ObjectId
  type: AffinityType
  score: number // normalised 0..1 within (sourceId, type)
  updatedAt: Date
}

/** Collection: UserProfile. Updated on view/add-to-cart/purchase events. */
export interface UserProfile {
  userId: string
  recentViewed: string[] // last ~30 product ids, newest first
  purchased: string[] // product ids (used to exclude and to seed copurchase)
  categoryAffinity: Record<string, number> // category name -> decayed weight
  brandAffinity: Record<string, number>
}

/** Fields the recommender needs on a product (extend your existing schema). */
export interface RecProduct {
  _id: string
  category: { name: string; ancestors?: string[] }
  brand?: string
  rating: number
  reviewCount: number
  popularityScore: number // 0..1, precomputed nightly (see computePopularity)
  promotionPriority?: number // 0..1 set by sellers/admin, 0 or undefined = none
  inStock: boolean
  price: number
}

export interface Scored {
  product: RecProduct
  score: number
  reasons: string[]
  sponsored?: boolean
}

// ---------- Weights (tune with A/B tests) ----------

const W = {
  copurchase: 0.35,
  coview: 0.15,
  complement: 0.2,
  popularity: 0.15,
  personal: 0.1,
  promotion: 0.05, // small on purpose: a boost, not an override
}

// Different surfaces weight signals differently.
const PDP_WEIGHTS = { ...W, personal: 0.05 }
const HOME_WEIGHTS = {
  ...W,
  copurchase: 0.15,
  coview: 0.1,
  complement: 0.05,
  popularity: 0.25,
  personal: 0.35,
}

type Weights = typeof W

// ---------- Offline jobs (run nightly / hourly) ----------

/**
 * Popularity: sales with exponential decay (half-life 30 days) blended with a
 * Bayesian-average rating so 1 review at 5 stars doesn't beat 400 reviews at 4.6.
 * Replaces sorting by reviewCount / "unitsSold truthy".
 */
export function computePopularity(opts: {
  salesLast90d: { daysAgo: number; units: number }[]
  rating: number
  reviewCount: number
  globalMeanRating: number
  maxDecayedSales: number
}) {
  const halfLife = 30
  const decayed = opts.salesLast90d.reduce(
    (sum, s) => sum + s.units * Math.pow(0.5, s.daysAgo / halfLife),
    0
  )
  const salesNorm = Math.min(1, Math.log1p(decayed) / Math.log1p(opts.maxDecayedSales || 1))

  const m = 20 // prior strength
  const bayes =
    (opts.reviewCount * opts.rating + m * opts.globalMeanRating) / (opts.reviewCount + m)
  const ratingNorm = bayes / 5

  return 0.7 * salesNorm + 0.3 * ratingNorm
}

/**
 * Item-item co-occurrence from baskets (or sessions for coview).
 * Score = co-count / sqrt(countA * countB)  (cosine); robust to bestsellers
 * dominating, unlike raw "also bought" counts.
 * Keep top 30 per source and require minCoCount to cut noise.
 */
export function buildAffinities(
  baskets: string[][],
  type: Exclude<AffinityType, "complement">,
  minCoCount = 3,
  topN = 30
): Omit<ProductAffinity, "updatedAt">[] {
  const itemCount = new Map<string, number>()
  const pairCount = new Map<string, number>()

  for (const basket of baskets) {
    const items = [...new Set(basket)]
    if (items.length > 50) continue // ignore bulk/B2B outliers
    for (const a of items) itemCount.set(a, (itemCount.get(a) ?? 0) + 1)
    for (const a of items)
      for (const b of items) {
        if (a === b) continue
        const key = `${a}|${b}`
        pairCount.set(key, (pairCount.get(key) ?? 0) + 1)
      }
  }

  const bySource = new Map<string, { target: string; score: number }[]>()
  for (const [key, co] of pairCount) {
    if (co < minCoCount) continue
    const [a, b] = key.split("|")
    const score = co / Math.sqrt(itemCount.get(a)! * itemCount.get(b)!)
    if (!bySource.has(a)) bySource.set(a, [])
    bySource.get(a)!.push({ target: b, score })
  }

  const out: Omit<ProductAffinity, "updatedAt">[] = []
  for (const [source, list] of bySource) {
    list.sort((x, y) => y.score - x.score)
    const top = list.slice(0, topN)
    const max = top[0]?.score || 1
    for (const t of top)
      out.push({
        sourceId: new mongoose.Types.ObjectId(source),
        targetId: new mongoose.Types.ObjectId(t.target),
        type,
        score: t.score / max,
      })
  }
  return out
}

/**
 * Complementary products: start with rules, let merchants override.
 * Category rule map (source category -> categories that go with it).
 * Co-purchase data later confirms/replaces these automatically.
 */
export const COMPLEMENT_RULES: Record<string, string[]> = {
  Laptops: ["Laptop Bags", "Mice", "Chargers"],
  Phones: ["Phone Cases", "Screen Protectors", "Chargers"],
  Pasta: ["Pasta Sauce", "Parmesan"],
  // ...extend; or store in a CategoryComplement collection editable in your admin
}

// ---------- Candidate generation ----------

type AffinityModel = mongoose.Model<ProductAffinity>
type ProductModel = mongoose.Model<unknown>

async function affinityCandidates(
  Affinity: AffinityModel,
  sourceIds: mongoose.Types.ObjectId[],
  type: AffinityType,
  perSource = 20
) {
  const rows = await Affinity.aggregate([
    { $match: { sourceId: { $in: sourceIds }, type } },
    { $sort: { score: -1 } },
    { $group: { _id: "$sourceId", targets: { $push: { id: "$targetId", score: "$score" } } } },
    { $project: { targets: { $slice: ["$targets", perSource] } } },
  ])
  const merged = new Map<string, number>()
  for (const r of rows)
    for (const t of r.targets) {
      const id = String(t.id)
      merged.set(id, Math.max(merged.get(id) ?? 0, t.score))
    }
  return merged // productId -> 0..1
}

// ---------- Scoring + re-ranking ----------

interface Signals {
  copurchase: Map<string, number>
  coview: Map<string, number>
  complement: Map<string, number>
  profile?: UserProfile
  sourceCategory?: string
}

function scoreProduct(p: RecProduct, s: Signals, w: Weights): Scored {
  const id = String(p._id)
  const reasons: string[] = []
  const co = s.copurchase.get(id) ?? 0
  const cv = s.coview.get(id) ?? 0
  const cm = s.complement.get(id) ?? 0
  if (co) reasons.push("bought_together")
  if (cv) reasons.push("also_viewed")
  if (cm) reasons.push("complementary")

  let personal = 0
  if (s.profile) {
    const cat = s.profile.categoryAffinity[p.category.name] ?? 0
    const brand = p.brand ? s.profile.brandAffinity[p.brand] ?? 0 : 0
    personal = Math.min(1, 0.7 * cat + 0.3 * brand)
    if (personal > 0.3) reasons.push("for_you")
  }

  // Same-category items get a small lift on PDP so "similar" still shows up.
  const similar = s.sourceCategory && p.category.name === s.sourceCategory ? 0.1 : 0

  const promo = p.promotionPriority ?? 0
  const score =
    w.copurchase * co +
    w.coview * cv +
    w.complement * cm +
    w.popularity * p.popularityScore +
    w.personal * personal +
    w.promotion * promo +
    similar

  if (!reasons.length) reasons.push("popular")
  return { product: p, score, reasons, sponsored: promo >= 0.5 }
}

/**
 * Re-rank: greedy MMR-style pass that penalises repeating the same
 * category/brand so a row isn't 10 phone cases, and caps sponsored slots.
 */
function rerank(items: Scored[], limit: number, maxPerCategory = 3, maxSponsored = 2) {
  const picked: Scored[] = []
  const catCount = new Map<string, number>()
  let sponsored = 0
  const pool = [...items].sort((a, b) => b.score - a.score)

  while (picked.length < limit && pool.length) {
    let bestIdx = -1
    let bestAdj = -Infinity
    for (let i = 0; i < pool.length; i++) {
      const it = pool[i]
      const c = catCount.get(it.product.category.name) ?? 0
      if (c >= maxPerCategory) continue
      if (it.sponsored && sponsored >= maxSponsored) continue
      const adj = it.score * Math.pow(0.85, c) // diminishing returns per category
      if (adj > bestAdj) {
        bestAdj = adj
        bestIdx = i
      }
    }
    if (bestIdx === -1) break
    const [it] = pool.splice(bestIdx, 1)
    picked.push(it)
    catCount.set(it.product.category.name, (catCount.get(it.product.category.name) ?? 0) + 1)
    if (it.sponsored) sponsored++
  }
  return picked
}

// ---------- Public API: product details page ----------

export async function getPdpRecommendations(deps: {
  Product: ProductModel
  Affinity: AffinityModel
  productId: string
  userProfile?: UserProfile
  limit?: number
}) {
  const { Product, Affinity, productId, userProfile, limit = 8 } = deps
  const sourceId = new mongoose.Types.ObjectId(productId)
  const source = await Product.findById(sourceId).lean<RecProduct>()
  if (!source) return null

  // 1) candidates from every signal, in parallel
  const [copurchase, coview, complementAff] = await Promise.all([
    affinityCandidates(Affinity, [sourceId], "copurchase"),
    affinityCandidates(Affinity, [sourceId], "coview"),
    affinityCandidates(Affinity, [sourceId], "complement"),
  ])

  // rule-based complements as a cold-start fallback
  const complementCats = COMPLEMENT_RULES[source.category.name] ?? []

  const candidateIds = new Set([...copurchase.keys(), ...coview.keys(), ...complementAff.keys()])

  const candidates = await Product.find({
    $or: [
      { _id: { $in: [...candidateIds].map(id => new mongoose.Types.ObjectId(id)) } },
      { "category.name": source.category.name }, // same-category fallback (your current behaviour)
      ...(complementCats.length ? [{ "category.name": { $in: complementCats } }] : []),
    ],
    _id: { $ne: sourceId },
    inStock: true,
  })
    .sort({ popularityScore: -1 })
    .limit(120) // cap work per request
    .lean<RecProduct[]>()

  const complement = new Map(complementAff)
  for (const c of candidates)
    if (complementCats.includes(c.category.name) && !complement.has(String(c._id)))
      complement.set(String(c._id), 0.5)

  // 2) score
  const signals: Signals = {
    copurchase,
    coview,
    complement,
    profile: userProfile,
    sourceCategory: source.category.name,
  }
  const scored = candidates
    .filter(c => !userProfile?.purchased.includes(String(c._id)) || complement.has(String(c._id)))
    .map(c => scoreProduct(c, signals, PDP_WEIGHTS))

  // 3) rerank for diversity
  return rerank(scored, limit)
}

// ---------- Public API: home page ----------

export async function getHomeRecommendations(deps: {
  Product: ProductModel
  Affinity: AffinityModel
  userProfile?: UserProfile // undefined = anonymous / cold start
  limit?: number
}) {
  const { Product, Affinity, userProfile, limit = 12 } = deps

  // Seeds: what the user viewed or bought recently (anonymous users get none -> trending)
  const seedIds = [...(userProfile?.recentViewed.slice(0, 10) ?? []), ...(userProfile?.purchased.slice(-10) ?? [])].map(
    id => new mongoose.Types.ObjectId(id)
  )

  const [copurchase, coview, complement] = seedIds.length
    ? await Promise.all([
      affinityCandidates(Affinity, seedIds, "copurchase", 10),
      affinityCandidates(Affinity, seedIds, "coview", 10),
      affinityCandidates(Affinity, seedIds, "complement", 10),
    ])
    : [new Map<string, number>(), new Map<string, number>(), new Map<string, number>()]

  const topCats = Object.entries(userProfile?.categoryAffinity ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c)

  const candidates = await Product.find({
    inStock: true,
    _id: { $nin: seedIds },
    $or: [
      { _id: { $in: [...new Set([...copurchase.keys(), ...coview.keys(), ...complement.keys()])].map(id => new mongoose.Types.ObjectId(id)) } },
      ...(topCats.length ? [{ "category.name": { $in: topCats } }] : []),
      { popularityScore: { $gte: 0.5 } }, // trending backbone & cold start
      { promotionPriority: { $gt: 0 } },
    ],
  })
    .sort({ popularityScore: -1 })
    .limit(200)
    .lean<RecProduct[]>()

  const signals: Signals = { copurchase, coview, complement, profile: userProfile }
  const scored = candidates.map(c => scoreProduct(c, signals, HOME_WEIGHTS))
  return rerank(scored, limit, 4)
}

// ---------- Event tracking (feeds profiles + coview jobs) ----------

export type RecEvent =
  | { type: "view"; userId?: string; sessionId: string; productId: string; ts: Date }
  | { type: "add_to_cart"; userId?: string; sessionId: string; productId: string; ts: Date }
  | { type: "purchase"; userId?: string; orderId: string; productIds: string[]; ts: Date }
  | { type: "rec_click"; surface: "home" | "pdp"; productId: string; position: number; ts: Date }

/** Decayed category/brand affinity update: old weight *0.95, then + event weight. */
export function updateProfile(profile: UserProfile, p: RecProduct, event: "view" | "add_to_cart" | "purchase") {
  const w = { view: 0.1, add_to_cart: 0.3, purchase: 0.6 }[event]
  const decay = (m: Record<string, number>) => {
    for (const k of Object.keys(m)) m[k] *= 0.95
  }
  decay(profile.categoryAffinity)
  decay(profile.brandAffinity)
  profile.categoryAffinity[p.category.name] = Math.min(1, (profile.categoryAffinity[p.category.name] ?? 0) + w)
  if (p.brand) profile.brandAffinity[p.brand] = Math.min(1, (profile.brandAffinity[p.brand] ?? 0) + w)
}