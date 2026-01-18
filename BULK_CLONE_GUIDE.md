# 🔄 Bulk Clone Feature - Guide

## Overview

Schedule the same content across multiple websites instantly with unique spintax variations.

---

## 🎯 Key Features

### 1. Multi-Website Selection
Select multiple websites at once from dropdown

### 2. Unique Caption Variations
Spintax creates unique text for each website

### 3. Single Image, Multiple Posts
Same image shared across all posts

### 4. Transaction-Safe
Errors on one website don't block others

---

## 📝 How It Works

### Frontend
**Multi-Select Dropdown:**
- Command component with search
- Checkbox for each website
- Shows count: "5 website(s) selected"

### Backend
**Bulk Processing:**
1. Loop through selected websites
2. Generate unique caption per website (spintax)
3. Create post for each website
4. Create schedules for each account
5. Continue if one fails

---

## 💡 Spintax Integration

### Example Caption
```
{Great|Awesome|Amazing} news! {Check out|See} our {new|latest} product!
```

### Result Per Website
- Website 1: "Great news! Check out our new product!"
- Website 2: "Awesome news! See our latest product!"
- Website 3: "Amazing news! Check out our latest product!"

**Each website gets a unique variation!**

---

## 🔧 Usage Example

### Scenario: Promote Across 20 Websites

1. **Select Websites**: Check all 20 websites
2. **Write Caption**: Use spintax for variations
3. **Upload Image**: One image for all
4. **Select Accounts**: FB + IG
5. **Schedule**: Click "Schedule to 20 Website(s)"

**Result:**
- 20 unique posts created
- 40 schedules (20 × 2 accounts)
- All posts slightly different (anti-spam)

---

## 📊 Database Structure

### Posts Table
```
20 entries created:
- Post 1: Website A, Caption Variation 1
- Post 2: Website B, Caption Variation 2
- ...
- Post 20: Website T, Caption Variation 20
```

### Post Schedules Table
```
40 entries created:
- Schedule 1: Post 1, FB Account
- Schedule 2: Post 1, IG Account
- Schedule 3: Post 2, FB Account
- ...
```

---

## 🚨 Error Handling

### Partial Failure
```
Result: "Scheduled 18 post(s) across 18 website(s). 2 failed."
Warnings: ["Website A: Permission denied", "Website B: Invalid data"]
```

**Behavior:**
- Successful posts still scheduled
- Failed posts logged
- User notified of both

### Complete Failure
```
Error: "All posts failed to schedule."
```

---

## 🧪 Testing

### Test with 3 Websites
1. Select 3 websites
2. Caption: "{Hi|Hello|Hey} from {our|my} site!"
3. Select 2 accounts
4. Schedule

**Expected:**
- 3 posts created (unique captions)
- 6 schedules created (3 × 2)
- Success toast

---

## 📚 Related Files

- **Frontend**: [src/app/dashboard/create/page.tsx](file:///d:/ToolsLiguns/src/app/dashboard/create/page.tsx)
- **Backend**: [src/app/dashboard/create/actions.ts](file:///d:/ToolsLiguns/src/app/dashboard/create/actions.ts)
- **Spintax**: [src/lib/spintax.ts](file:///d:/ToolsLiguns/src/lib/spintax.ts)

---

**Bulk clone posts across 20 websites in seconds!** 🚀
