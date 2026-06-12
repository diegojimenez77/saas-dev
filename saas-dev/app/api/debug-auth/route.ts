import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

    const client = await clerkClient()
    const subscription = await client.billing.getUserBillingSubscription(userId)

    return NextResponse.json({
        userId,
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        allSubscriptionItems: subscription.subscriptionItems.map(item => ({
            id: item.id,
            status: item.status,
            planSlug: item.plan?.slug,
            planName: item.plan?.name,
            planIsDefault: item.plan?.isDefault,
            createdAt: item.createdAt,
            canceledAt: item.canceledAt,
            endedAt: item.endedAt,
            periodEnd: item.periodEnd,
        })),
    })
}
