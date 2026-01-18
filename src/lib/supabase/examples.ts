// @ts-nocheck
// =====================================================
// Type-Safe Supabase Usage Examples
// Demonstrates how to use the Database types
// NOTE: This file is for reference only.
// Remove @ts-nocheck when you're ready to use these examples.
// =====================================================

import { createClient } from '@/lib/supabase/client'
import type {
    Website,
    WebsiteInsert,
    Account,
    Post,
    PostSchedule,
    Platform,
    ScheduleStatus,
    PostScheduleWithDetails,
    UpcomingPostView
} from '@/types/database'

// =====================================================
// Example 1: Create a Website (Type-Safe)
// =====================================================

export async function createWebsite(userId: string, name: string, url: string) {
    const supabase = createClient()

    // ✅ Type-safe insert - TypeScript knows the exact structure
    const newWebsite: WebsiteInsert = {
        user_id: userId,
        name,
        url,
        description: 'My awesome website'
    }

    const { data, error } = await supabase
        .from('websites')
        .insert(newWebsite)
        .select()
        .single()

    if (error) {
        console.error('Error creating website:', error)
        return null
    }

    // ✅ `data` is typed as Website
    console.log(`Created website: ${data.name}`)
    return data
}

// =====================================================
// Example 2: Get All Websites (Auto-Typed)
// =====================================================

export async function getAllWebsites(): Promise<Website[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching websites:', error)
        return []
    }

    // ✅ `data` is automatically typed as Website[]
    return data || []
}

// =====================================================
// Example 3: Add Social Media Account
// =====================================================

export async function addSocialAccount(
    userId: string,
    platform: Platform,
    accountName: string,
    accessToken: string
) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('accounts')
        .insert({
            user_id: userId,
            platform, // ✅ TypeScript validates this is a valid Platform
            account_name: accountName,
            account_id: `${platform}_${Date.now()}`,
            access_token: accessToken,
            token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
            is_active: true
        })
        .select()
        .single()

    if (error) {
        console.error('Error adding account:', error)
        return null
    }

    // ✅ `data` is typed as Account
    return data
}

// =====================================================
// Example 4: Create a Post
// =====================================================

export async function createPost(
    userId: string,
    websiteId: string,
    caption: string,
    imageUrl?: string
): Promise<Post | null> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('posts')
        .insert({
            user_id: userId,
            website_id: websiteId,
            caption,
            image_url: imageUrl || null,
            notes: 'Created via API'
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating post:', error)
        return null
    }

    return data
}

// =====================================================
// Example 5: Schedule a Post
// =====================================================

export async function schedulePost(
    userId: string,
    postId: string,
    accountId: string,
    scheduledAt: Date
): Promise<PostSchedule | null> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('post_schedules')
        .insert({
            user_id: userId,
            post_id: postId,
            account_id: accountId,
            scheduled_at: scheduledAt.toISOString(),
            status: 'QUEUED' as ScheduleStatus // ✅ Type-safe status
        })
        .select()
        .single()

    if (error) {
        console.error('Error scheduling post:', error)
        return null
    }

    return data
}

// =====================================================
// Example 6: Get Upcoming Posts (Using View)
// =====================================================

export async function getUpcomingPosts(limit: number = 10): Promise<UpcomingPostView[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('upcoming_posts_view')
        .select('*')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(limit)

    if (error) {
        console.error('Error fetching upcoming posts:', error)
        return []
    }

    // ✅ `data` is typed as UpcomingPostView[]
    return data || []
}

// =====================================================
// Example 7: Get Post Schedule with Full Details
// =====================================================

export async function getScheduleWithDetails(scheduleId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('post_schedules')
        .select(`
      *,
      post:posts(*),
      account:accounts(*),
      website:posts(website:websites(*))
    `)
        .eq('id', scheduleId)
        .single()

    if (error) {
        console.error('Error fetching schedule:', error)
        return null
    }

    // ✅ TypeScript knows the nested structure
    return data
}

// =====================================================
// Example 8: Update Post Schedule Status
// =====================================================

export async function updateScheduleStatus(
    scheduleId: string,
    status: ScheduleStatus,
    platformPostId?: string,
    errorLog?: string
) {
    const supabase = createClient()

    const updates: Partial<PostSchedule> = {
        status,
        ...(platformPostId && { platform_post_id: platformPostId }),
        ...(errorLog && { error_log: errorLog }),
        ...(status === 'PUBLISHED' && { published_at: new Date().toISOString() })
    }

    const { data, error } = await supabase
        .from('post_schedules')
        .update(updates)
        .eq('id', scheduleId)
        .select()
        .single()

    if (error) {
        console.error('Error updating schedule:', error)
        return null
    }

    return data
}

// =====================================================
// Example 9: Filter Posts by Platform
// =====================================================

export async function getPostsByPlatform(platform: Platform) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('upcoming_posts_view')
        .select('*')
        .eq('platform', platform) // ✅ Type-safe platform filter
        .order('scheduled_at', { ascending: true })

    if (error) {
        console.error('Error fetching posts:', error)
        return []
    }

    return data || []
}

// =====================================================
// Example 10: Get Posts by Status
// =====================================================

export async function getPostsByStatus(status: ScheduleStatus) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('post_schedules')
        .select('*')
        .eq('status', status)
        .order('scheduled_at', { ascending: true })

    if (error) {
        console.error('Error fetching posts by status:', error)
        return []
    }

    return data || []
}

// =====================================================
// Example 11: Get Account Statistics
// =====================================================

export async function getAccountStats() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('account_stats_view')
        .select('*')
        .eq('is_active', true)
        .order('total_published', { ascending: false })

    if (error) {
        console.error('Error fetching account stats:', error)
        return []
    }

    // ✅ `data` is typed as AccountStatsView[]
    return data || []
}

// =====================================================
// Example 12: Get Posts by Website
// =====================================================

export async function getPostsByWebsite() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('posts_by_website_view')
        .select('*')
        .order('total_posts', { ascending: false })

    if (error) {
        console.error('Error fetching posts by website:', error)
        return []
    }

    // ✅ `data` is typed as PostsByWebsiteView[]
    return data || []
}

// =====================================================
// Example 13: Bulk Schedule Posts
// =====================================================

export async function bulkSchedulePosts(
    userId: string,
    postId: string,
    accounts: Account[],
    startDate: Date,
    intervalHours: number = 24
) {
    const supabase = createClient()

    const schedules = accounts.map((account, index) => ({
        user_id: userId,
        post_id: postId,
        account_id: account.id,
        scheduled_at: new Date(
            startDate.getTime() + index * intervalHours * 60 * 60 * 1000
        ).toISOString(),
        status: 'QUEUED' as ScheduleStatus
    }))

    const { data, error } = await supabase
        .from('post_schedules')
        .insert(schedules)
        .select()

    if (error) {
        console.error('Error bulk scheduling:', error)
        return []
    }

    return data || []
}

// =====================================================
// Example 14: Cancel Scheduled Post
// =====================================================

export async function cancelScheduledPost(scheduleId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('post_schedules')
        .update({ status: 'CANCELLED' as ScheduleStatus })
        .eq('id', scheduleId)
        .eq('status', 'QUEUED') // Only cancel if still queued
        .select()
        .single()

    if (error) {
        console.error('Error cancelling post:', error)
        return null
    }

    return data
}

// =====================================================
// Example 15: Get Expiring Tokens
// =====================================================

export async function getExpiringTokens(daysUntilExpiry: number = 7) {
    const supabase = createClient()

    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry)

    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .lte('token_expires_at', expiryDate.toISOString())
        .eq('is_active', true)

    if (error) {
        console.error('Error fetching expiring tokens:', error)
        return []
    }

    // ✅ `data` is typed as Account[]
    return data || []
}
