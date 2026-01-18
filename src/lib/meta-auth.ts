/**
 * Meta (Facebook/Instagram) Authentication Utilities
 * 
 * This module handles OAuth token exchange, refresh, and account fetching
 * for Facebook and Instagram Business accounts via Meta Graph API.
 */

const GRAPH_API_VERSION = "v19.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

interface LongLivedTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number; // seconds
}

interface TokenExchangeResult {
    accessToken: string;
    expiresAt: Date;
    expiresIn: number;
}

interface FacebookPage {
    id: string;
    name: string;
    access_token: string;
    category: string;
    instagram_business_account?: {
        id: string;
    };
}

interface ConnectedAccount {
    platform: "facebook" | "instagram";
    accountId: string;
    accountName: string;
    accessToken: string;
    pageId?: string; // For Instagram (linked to FB Page)
}

/**
 * Exchange a short-lived access token for a long-lived token (60 days)
 * 
 * @param shortLivedToken - The short-lived user access token from OAuth
 * @returns Token exchange result with new token and expiry
 */
export async function exchangeForLongLivedToken(
    shortLivedToken: string
): Promise<TokenExchangeResult> {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!appId || !appSecret) {
        throw new Error("Facebook App ID and App Secret must be configured in environment variables");
    }

    try {
        const params = new URLSearchParams({
            grant_type: "fb_exchange_token",
            client_id: appId,
            client_secret: appSecret,
            fb_exchange_token: shortLivedToken,
        });

        const response = await fetch(
            `${GRAPH_API_BASE}/oauth/access_token?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                `Token exchange failed: ${error.error?.message || response.statusText}`
            );
        }

        const data: LongLivedTokenResponse = await response.json();

        // Calculate expiry date (typically 60 days for long-lived tokens)
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + data.expires_in);

        return {
            accessToken: data.access_token,
            expiresAt,
            expiresIn: data.expires_in,
        };
    } catch (error) {
        console.error("Error exchanging token:", error);
        throw error;
    }
}

/**
 * Refresh a long-lived access token (extend expiry)
 * 
 * Note: Facebook long-lived tokens (60 days) can be refreshed if they're still valid
 * and at least 24 hours old. This returns a new 60-day token.
 * 
 * @param currentToken - The current long-lived access token
 * @returns New token exchange result
 */
export async function refreshLongLivedToken(
    currentToken: string
): Promise<TokenExchangeResult> {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!appId || !appSecret) {
        throw new Error("Facebook App ID and App Secret must be configured");
    }

    try {
        const params = new URLSearchParams({
            grant_type: "fb_exchange_token",
            client_id: appId,
            client_secret: appSecret,
            fb_exchange_token: currentToken,
        });

        const response = await fetch(
            `${GRAPH_API_BASE}/oauth/access_token?${params.toString()}`,
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                `Token refresh failed: ${error.error?.message || response.statusText}`
            );
        }

        const data: LongLivedTokenResponse = await response.json();

        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + data.expires_in);

        return {
            accessToken: data.access_token,
            expiresAt,
            expiresIn: data.expires_in,
        };
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}

/**
 * Fetch all Facebook Pages and Instagram Business Accounts accessible by the user
 * 
 * @param accessToken - User access token (short-lived or long-lived)
 * @returns Array of connected accounts
 */
export async function fetchConnectedAccounts(
    accessToken: string
): Promise<ConnectedAccount[]> {
    try {
        // Fetch Facebook Pages the user manages
        const pagesResponse = await fetch(
            `${GRAPH_API_BASE}/me/accounts?fields=id,name,access_token,category,instagram_business_account&access_token=${accessToken}`,
            {
                method: "GET",
            }
        );

        if (!pagesResponse.ok) {
            const error = await pagesResponse.json();
            throw new Error(
                `Failed to fetch accounts: ${error.error?.message || pagesResponse.statusText}`
            );
        }

        const pagesData = await pagesResponse.json();
        const pages: FacebookPage[] = pagesData.data || [];

        const connectedAccounts: ConnectedAccount[] = [];

        // Add Facebook Pages
        for (const page of pages) {
            connectedAccounts.push({
                platform: "facebook",
                accountId: page.id,
                accountName: page.name,
                accessToken: page.access_token, // Page-level token
            });

            // Add linked Instagram Business Account if exists
            if (page.instagram_business_account) {
                // Fetch Instagram account details
                try {
                    const igResponse = await fetch(
                        `${GRAPH_API_BASE}/${page.instagram_business_account.id}?fields=id,username&access_token=${page.access_token}`,
                        {
                            method: "GET",
                        }
                    );

                    if (igResponse.ok) {
                        const igData = await igResponse.json();
                        connectedAccounts.push({
                            platform: "instagram",
                            accountId: igData.id,
                            accountName: igData.username || page.name,
                            accessToken: page.access_token, // Use Page token for Instagram API
                            pageId: page.id,
                        });
                    }
                } catch (igError) {
                    console.error(`Error fetching Instagram account for page ${page.id}:`, igError);
                    // Continue with other accounts even if one fails
                }
            }
        }

        return connectedAccounts;
    } catch (error) {
        console.error("Error fetching connected accounts:", error);
        throw error;
    }
}

/**
 * Verify if an access token is still valid
 * 
 * @param accessToken - The access token to verify
 * @returns True if valid, false otherwise
 */
export async function verifyAccessToken(accessToken: string): Promise<boolean> {
    try {
        const response = await fetch(
            `${GRAPH_API_BASE}/me?access_token=${accessToken}`,
            {
                method: "GET",
            }
        );

        return response.ok;
    } catch (error) {
        console.error("Error verifying token:", error);
        return false;
    }
}

/**
 * Get token debug information (expiry, scopes, etc.)
 * 
 * @param accessToken - The access token to debug
 * @param appAccessToken - App access token (app_id|app_secret)
 * @returns Token debug information
 */
export async function debugAccessToken(
    accessToken: string,
    appAccessToken?: string
): Promise<any> {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!appId || !appSecret) {
        throw new Error("Facebook App ID and App Secret must be configured");
    }

    const debugToken = appAccessToken || `${appId}|${appSecret}`;

    try {
        const response = await fetch(
            `${GRAPH_API_BASE}/debug_token?input_token=${accessToken}&access_token=${debugToken}`,
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to debug token");
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error debugging token:", error);
        throw error;
    }
}
