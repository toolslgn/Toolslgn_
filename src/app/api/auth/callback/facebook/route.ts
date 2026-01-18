import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
    exchangeForLongLivedToken,
    fetchConnectedAccounts,
} from "@/lib/meta-auth";

const GRAPH_API_VERSION = "v19.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Facebook OAuth Callback Handler
 * 
 * This route handles the callback from Facebook OAuth flow:
 * 1. Receives authorization code
 * 2. Exchanges code for short-lived token
 * 3. Exchanges short-lived for long-lived token  
 * 4. Fetches connected Facebook Pages and Instagram accounts
 * 5. Saves/updates accounts in Supabase
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorReason = searchParams.get("error_reason");

    // Handle OAuth denial
    if (error) {
        console.error("OAuth error:", error, errorReason);
        return NextResponse.redirect(
            new URL(
                `/dashboard/accounts?error=${encodeURIComponent(errorReason || error)}`,
                request.url
            )
        );
    }

    // Validate code
    if (!code) {
        return NextResponse.redirect(
            new URL("/dashboard/accounts?error=no_code", request.url)
        );
    }

    try {
        const appId = process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.FACEBOOK_APP_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/facebook`;

        if (!appId || !appSecret) {
            throw new Error("Facebook App credentials not configured");
        }

        // Step 1: Exchange code for short-lived access token
        const tokenParams = new URLSearchParams({
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code,
        });

        const tokenResponse = await fetch(
            `${GRAPH_API_BASE}/oauth/access_token?${tokenParams.toString()}`
        );

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            throw new Error(
                `Failed to exchange code: ${errorData.error?.message || tokenResponse.statusText}`
            );
        }

        const tokenData = await tokenResponse.json();
        const shortLivedToken = tokenData.access_token;

        // Step 2: Exchange short-lived for long-lived token (60 days)
        const longLivedResult = await exchangeForLongLivedToken(shortLivedToken);

        // Step 3: Fetch connected Facebook Pages and Instagram accounts
        const connectedAccounts = await fetchConnectedAccounts(
            longLivedResult.accessToken
        );

        // Step 4: Get authenticated user and save accounts to Supabase
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.redirect(
                new URL("/login?error=not_authenticated", request.url)
            );
        }

        // Step 5: Upsert accounts into database
        let successCount = 0;
        const errors: string[] = [];

        for (const account of connectedAccounts) {
            try {
                const { error: upsertError } = await supabase
                    .from("accounts")
                    .upsert(
                        {
                            user_id: user.id,
                            platform: account.platform,
                            account_id: account.accountId,
                            account_name: account.accountName,
                            access_token: account.accessToken,
                            token_expires_at: longLivedResult.expiresAt.toISOString(),
                            is_active: true,
                            updated_at: new Date().toISOString(),
                        },
                        {
                            onConflict: "user_id,platform,account_id",
                        }
                    );

                if (upsertError) {
                    console.error(`Error upserting ${account.platform} account:`, upsertError);
                    errors.push(`${account.accountName}: ${upsertError.message}`);
                } else {
                    successCount++;
                }
            } catch (error) {
                console.error(`Error processing account ${account.accountName}:`, error);
                errors.push(`${account.accountName}: Unknown error`);
            }
        }

        // Step 6: Redirect back to accounts page with results
        const redirectUrl = new URL("/dashboard/accounts", request.url);

        if (successCount > 0) {
            redirectUrl.searchParams.set(
                "success",
                `${successCount} account(s) connected successfully`
            );
        }

        if (errors.length > 0) {
            redirectUrl.searchParams.set(
                "warning",
                `Some accounts failed: ${errors.join(", ")}`
            );
        }

        return NextResponse.redirect(redirectUrl);
    } catch (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.redirect(
            new URL(
                `/dashboard/accounts?error=${encodeURIComponent(
                    error instanceof Error ? error.message : "Unknown error"
                )}`,
                request.url
            )
        );
    }
}
