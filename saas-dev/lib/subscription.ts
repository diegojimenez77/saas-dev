import { auth, clerkClient } from "@clerk/nextjs/server";

export type PlanType = 'free' | 'pro'

export async function getUserPlan(): Promise<PlanType> {
    const { userId } = await auth()
    if (!userId) return 'free'

    try {
        const client = await clerkClient()
        const subscription = await client.billing.getUserBillingSubscription(userId)
        const items = subscription.subscriptionItems

        // An item with canceledAt means the user has already switched away from it
        const effectiveItem = items
            .filter(item => item.status === 'active' && !item.canceledAt)
            .sort((a, b) => b.createdAt - a.createdAt)[0]

        if (!effectiveItem?.plan?.slug) return 'free'

        return effectiveItem.plan.slug.toLowerCase().includes('pro') ? 'pro' : 'free'
    } catch {
        return 'free'
    }
}

export async function checkProPlan(): Promise<boolean> {
    const plan = await getUserPlan()
    return plan === 'pro'
}
