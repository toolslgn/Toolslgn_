# 📱 Telegram Notifications - Setup Guide

## Overview

Get instant mobile notifications about your automated posts via Telegram!

---

## 🚀 Quick Setup

### 1. Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow prompts:
   - Bot name: `ToolsLiguns Notifier`
   - Username: `toolsliguns_bot` (must end in `_bot`)
4. Copy the **Bot Token**: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`

### 2. Get Your Chat ID

1. Search for **@userinfobot** in Telegram
2. Send `/start`
3. Bot replies with your Chat ID: `123456789`

**OR** send a message to your bot and visit:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```
Find `"chat":{"id":123456789}`

### 3. Add to Environment Variables

```bash
# .env.local
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=123456789
```

---

## 📊 Notification Types

### Success Notification

```
🚀 ToolsLiguns Report

✅ Successfully published 3 posts
📊 Total processed: 3
🌐 Websites: Liguns, Beras Polos
⏱ Execution time: 2.45s

Keep up the great work! 💪
```

### Failure Notification (URGENT)

```
🚨 URGENT: Publishing Failures

❌ 2 posts failed to publish:

1. facebook: Token expired (ID: `1a2b3c4d`)
2. instagram: Image ratio not supported (ID: `5e6f7g8h`)

⚠️ Action Required
Please check the dashboard and resolve these issues.

🔗 Dashboard: https://toolsliguns.vercel.app/dashboard
```

### Retry Notification

```
🔄 Retry Alert

2 posts will be retried:

1. facebook (Attempt 2/3): Network timeout
2. instagram (Attempt 1/3): Connection error

These will be attempted again in the next cron run.
```

---

## 🧪 Testing

### Test Message Manually

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<YOUR_CHAT_ID>",
    "text": "🚀 Test from ToolsLiguns!",
    "parse_mode": "Markdown"
  }'
```

### Test from Code

```typescript
import { sendTelegramMessage } from '@/lib/telegram';

await sendTelegramMessage("🧪 *Test notification*\n\nThis is a test!");
```

---

## 📝 Message Formatting

### Markdown Support

```
*bold text*
_italic text_
`inline code`
[link](http://example.com)
```

### Emojis

Common emojis used:
- ✅ Success
- ❌ Failed
- 🔄 Retry
- 🚀 Launch
- 📊 Stats
- ⏱ Time
- 🌐 Website
- 🚨 Urgent

---

## 🔧 Service Functions

### sendTelegramMessage()

**Basic usage:**
```typescript
await sendTelegramMessage("Hello from ToolsLiguns!");
```

### sendSuccessNotification()

**Auto-called on successful posts:**
```typescript
await sendSuccessNotification({
  processed: 5,
  success: 4,
  failed: 1,
  retrying: 0,
  executionTime: 3542
});
```

### sendFailureNotification()

**Auto-called on failures:**
```typescript
await sendFailureNotification([
  {
    platform: "facebook",
    error: "Token expired",
    scheduleId: "123-456-789"
  }
]);
```

### sendRetryNotification()

**Auto-called on retries:**
```typescript
await sendRetryNotification([
  {
    platform: "instagram",
    error: "Timeout",
    retryCount: 2
  }
]);
```

---

## 🔐 Security

### Best Practices

1. ✅ Never commit tokens to Git
2. ✅ Use environment variables
3. ✅ Keep chat ID private
4. ❌ Don't share bot token
5. ❌ Don't expose in client code

### Token Management

```bash
# Store in .env.local (never committed)
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# Use from code (server-side only)
process.env.TELEGRAM_BOT_TOKEN
```

---

## 🚨 Troubleshooting

### Issue: Bot not sending messages

**Check:**
1. Bot token is correct
2. Chat ID is correct
3. You've started the bot (send `/start` in Telegram)
4. Environment variables are loaded

### Issue: "Forbidden" error

**Cause**: You haven't started a conversation with the bot

**Fix**: Open bot in Telegram and send `/start`

### Issue: Messages not formatted

**Cause**: Invalid Markdown syntax

**Fix**: Escape special characters: `_`, `*`, `[`

---

## 📚 Related Files

- **Telegram Service**: [src/lib/telegram.ts](file:///d:/ToolsLiguns/src/lib/telegram.ts)
- **Cron Handler**: [src/app/api/cron/publish/route.ts](file:///d:/ToolsLiguns/src/app/api/cron/publish/route.ts)
- **Env Example**: [.env.example](file:///d:/ToolsLiguns/.env.example)

---

## 🔗 Resources

- **Telegram Bot API**: https://core.telegram.org/bots/api
- **BotFather**: https://t.me/BotFather
- **Get Chat ID**: https://t.me/userinfobot

---

**Get instant notifications about your automated posts! 📱**
