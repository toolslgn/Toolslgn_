// =====================================================
// ToolsLiguns - Database Types
// Strict TypeScript interfaces for Supabase tables
// Auto-generated from supabase-schema.sql
// =====================================================

/**
 * Supported social media platforms
 */
export type Platform =
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
// Table: websites
// =====================================================

/**
 * Website table row structure
 * Represents a website being promoted through social media
 */
export interface Website {
    id: string;
    user_id: string;
    name: string;
    url: string;
    description?: string | null;
    logo_url?: string | null;
    primary_color?: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Insert type for websites table
 * Used when creating a new website
 */
export interface WebsiteInsert {
    id?: string;
    user_id: string;
    name: string;
    url: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}

/**
 * Update type for websites table
 * All fields are optional for partial updates
 */
export interface WebsiteUpdate {
    name?: string;
    url?: string;
    description?: string | null;
    updated_at?: string;
}

// =====================================================
// Table: accounts
// =====================================================

/**
 * Account table row structure
 * Stores social media platform credentials and OAuth tokens
 */
export interface Account {
    id: string;
    user_id: string;
    platform: Platform;
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
 * Insert type for accounts table
 * Used when creating a new social media account
 */
export interface AccountInsert {
    id?: string;
    user_id: string;
    platform: Platform;
    account_name: string;
    account_id: string;
    access_token: string;
    refresh_token?: string | null;
    token_expires_at?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

/**
 * Update type for accounts table
 * All fields are optional for partial updates
 */
export interface AccountUpdate {
    platform?: Platform;
    account_name?: string;
    account_id?: string;
    access_token?: string;
    refresh_token?: string | null;
    token_expires_at?: string | null;
    is_active?: boolean;
    updated_at?: string;
}

// =====================================================
// Table: posts
// =====================================================

/**
 * Post table row structure
 * Content master containing all post data
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
 * Insert type for posts table
 * Used when creating a new post
 */
export interface PostInsert {
    id?: string;
    user_id: string;
    website_id: string;
    caption: string;
    image_url?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

/**
 * Update type for posts table
 * All fields are optional for partial updates
 */
export interface PostUpdate {
    website_id?: string;
    caption?: string;
    image_url?: string | null;
    notes?: string | null;
    updated_at?: string;
}

// =====================================================
// Table: post_schedules
// =====================================================

/**
 * PostSchedule table row structure
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
 * Insert type for post_schedules table
 * Used when creating a new schedule
 */
export interface PostScheduleInsert {
    id?: string;
    user_id: string;
    post_id: string;
    account_id: string;
    scheduled_at: string;
    status?: ScheduleStatus;
    platform_post_id?: string | null;
    error_log?: string | null;
    published_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

/**
 * Update type for post_schedules table
 * All fields are optional for partial updates
 */
export interface PostScheduleUpdate {
    scheduled_at?: string;
    status?: ScheduleStatus;
    platform_post_id?: string | null;
    error_log?: string | null;
    published_at?: string | null;
    updated_at?: string;
}

// =====================================================
// Database Views
// =====================================================

/**
 * upcoming_posts_view
 * Shows all queued posts with full details
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
    platform: Platform;
    account_name: string;
    user_id: string;
}

/**
 * posts_by_website_view
 * Analytics view showing post counts grouped by website
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
 * account_stats_view
 * Statistics for each social media account
 */
export interface AccountStatsView {
    account_id: string;
    platform: Platform;
    account_name: string;
    is_active: boolean;
    total_scheduled: number;
    total_published: number;
    total_failed: number;
    last_published_at: string | null;
    user_id: string;
}

// =====================================================
// Joined/Related Types (for complex queries)
// =====================================================

/**
 * Post with related website information
 */
export interface PostWithWebsite extends Post {
    website: Website;
}

/**
 * Post with related website and all schedules
 */
export interface PostWithRelations extends Post {
    website: Website;
    schedules: PostSchedule[];
}

/**
 * Post schedule with all related data
 * Useful for displaying schedule details in UI
 */
export interface PostScheduleWithDetails extends PostSchedule {
    post: Post;
    account: Account;
    website: Website;
}

/**
 * Account with usage statistics
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
// Supabase Type-Safe Database Schema
// =====================================================

/**
 * Complete database schema type for Supabase client
 * Use this with createClient<Database>() for full type safety
 */
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
        Functions: Record<string, never>;
        Enums: {
            platform: Platform;
            schedule_status: ScheduleStatus;
        };
    };
}

// =====================================================
// Utility Types
// =====================================================

/**
 * Generic database response wrapper
 */
export interface DatabaseResponse<T> {
    data: T | null;
    error: Error | null;
}

/**
 * Paginated response for list queries
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
 * Date range filter for queries
 */
export interface DateRangeFilter {
    startDate: string;
    endDate: string;
}

/**
 * Filters for post schedule queries
 */
export interface PostScheduleFilters {
    status?: ScheduleStatus | ScheduleStatus[];
    platform?: Platform | Platform[];
    websiteId?: string;
    accountId?: string;
    dateRange?: DateRangeFilter;
}

/**
 * Sort options for queries
 */
export interface SortOptions {
    field: string;
    ascending: boolean;
}
