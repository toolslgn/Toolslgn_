// =====================================================
// ToolsLiguns - Database Types
// Auto-generated types for Supabase database schema
// =====================================================

/**
 * Supported social media platforms
 */
export type SocialPlatform =
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'twitter'
    | 'gmb'
    | 'tiktok'
    | 'youtube'
    | 'pinterest';

/**
 * Post schedule status types
 */
export type ScheduleStatus =
    | 'QUEUED'
    | 'PUBLISHED'
    | 'FAILED'
    | 'CANCELLED';

// =====================================================
// Database Table Types
// =====================================================

/**
 * Website entity
 * Represents a website being promoted through social media
 */
export interface Website {
    id: string;
    user_id: string;
    name: string;
    url: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Input type for creating a website
 */
export interface WebsiteInsert {
    user_id: string;
    name: string;
    url: string;
    description?: string | null;
}

/**
 * Input type for updating a website
 */
export interface WebsiteUpdate {
    name?: string;
    url?: string;
    description?: string | null;
}

// =====================================================

/**
 * Social Media Account entity
 * Stores credentials and OAuth tokens for social platforms
 */
export interface Account {
    id: string;
    user_id: string;
    platform: SocialPlatform;
    account_name: string;
    account_id: string;
    access_token: string;
    refresh_token: string | null;
    token_expires_at: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Input type for creating an account
 */
export interface AccountInsert {
    user_id: string;
    platform: SocialPlatform;
    account_name: string;
    account_id: string;
    access_token: string;
    refresh_token?: string | null;
    token_expires_at?: string | null;
    is_active?: boolean;
}

/**
 * Input type for updating an account
 */
export interface AccountUpdate {
    platform?: SocialPlatform;
    account_name?: string;
    account_id?: string;
    access_token?: string;
    refresh_token?: string | null;
    token_expires_at?: string | null;
    is_active?: boolean;
}

// =====================================================

/**
 * Post entity
 * Content master for all social media posts
 */
export interface Post {
    id: string;
    user_id: string;
    website_id: string;
    caption: string;
    image_url: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Input type for creating a post
 */
export interface PostInsert {
    user_id: string;
    website_id: string;
    caption: string;
    image_url?: string | null;
    notes?: string | null;
}

/**
 * Input type for updating a post
 */
export interface PostUpdate {
    website_id?: string;
    caption?: string;
    image_url?: string | null;
    notes?: string | null;
}

// =====================================================

/**
 * Post Schedule entity
 * Execution queue for scheduled posts
 */
export interface PostSchedule {
    id: string;
    user_id: string;
    post_id: string;
    account_id: string;
    scheduled_at: string;
    status: ScheduleStatus;
    platform_post_id: string | null;
    error_log: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Input type for creating a post schedule
 */
export interface PostScheduleInsert {
    user_id: string;
    post_id: string;
    account_id: string;
    scheduled_at: string;
    status?: ScheduleStatus;
}

/**
 * Input type for updating a post schedule
 */
export interface PostScheduleUpdate {
    scheduled_at?: string;
    status?: ScheduleStatus;
    platform_post_id?: string | null;
    error_log?: string | null;
    published_at?: string | null;
}

// =====================================================
// View Types (for database views)
// =====================================================

/**
 * Upcoming posts view
 * Shows queued posts with full details
 */
export interface UpcomingPostView {
    id: string;
    scheduled_at: string;
    status: ScheduleStatus;
    platform_post_id: string | null;
    published_at: string | null;
    caption: string;
    image_url: string | null;
    website_name: string;
    website_url: string;
    platform: SocialPlatform;
    account_name: string;
    user_id: string;
}

/**
 * Posts by website view
 * Analytics view for posts grouped by website
 */
export interface PostsByWebsiteView {
    website_id: string;
    website_name: string;
    website_url: string;
    total_posts: number;
    queued_posts: number;
    published_posts: number;
    failed_posts: number;
    user_id: string;
}

/**
 * Account statistics view
 * Usage statistics for social media accounts
 */
export interface AccountStatsView {
    account_id: string;
    platform: SocialPlatform;
    account_name: string;
    is_active: boolean;
    total_scheduled: number;
    total_published: number;
    total_failed: number;
    last_published_at: string | null;
    user_id: string;
}

// =====================================================
// Joined/Related Types
// =====================================================

/**
 * Post with website details
 */
export interface PostWithWebsite extends Post {
    website: Website;
}

/**
 * Post schedule with full details
 */
export interface PostScheduleWithDetails extends PostSchedule {
    post: Post;
    account: Account;
    website: Website;
}

/**
 * Account with statistics
 */
export interface AccountWithStats extends Account {
    stats: {
        total_scheduled: number;
        total_published: number;
        total_failed: number;
        last_published_at: string | null;
    };
}

// =====================================================
// Utility Types
// =====================================================

/**
 * Database response wrapper
 */
export interface DatabaseResponse<T> {
    data: T | null;
    error: Error | null;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
    page: number;
    pageSize: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
}

/**
 * Date range filter
 */
export interface DateRangeFilter {
    startDate: string;
    endDate: string;
}

/**
 * Post schedule filters
 */
export interface PostScheduleFilters {
    status?: ScheduleStatus | ScheduleStatus[];
    platform?: SocialPlatform | SocialPlatform[];
    websiteId?: string;
    accountId?: string;
    dateRange?: DateRangeFilter;
}

// =====================================================
// Supabase Database Schema Type (for type-safe queries)
// =====================================================

export interface Database {
    public: {
        Tables: {
            websites: {
                Row: Website;
                Insert: WebsiteInsert;
                Update: WebsiteUpdate;
            };
            accounts: {
                Row: Account;
                Insert: AccountInsert;
                Update: AccountUpdate;
            };
            posts: {
                Row: Post;
                Insert: PostInsert;
                Update: PostUpdate;
            };
            post_schedules: {
                Row: PostSchedule;
                Insert: PostScheduleInsert;
                Update: PostScheduleUpdate;
            };
        };
        Views: {
            upcoming_posts_view: {
                Row: UpcomingPostView;
            };
            posts_by_website_view: {
                Row: PostsByWebsiteView;
            };
            account_stats_view: {
                Row: AccountStatsView;
            };
        };
    };
}
