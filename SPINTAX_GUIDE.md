# 🔄 Spintax Content Variation - Guide

## Overview

Spintax (Spin Syntax) parser creates unique content variations to avoid duplicate content penalties when posting to multiple social media platforms.

---

## 🎯 What is Spintax?

**Syntax:** `{option1|option2|option3}`

**Purpose:** Generate unique variations of the same message

**Example:**
```
Input:  "{Great|Awesome|Amazing} news for {you|everyone}!"
Output: "Awesome news for everyone!"
Output: "Great news for you!"
Output: "Amazing news for everyone!"
```

---

## 📝 Usage

### parseSpintax()

**Convert spintax to unique variation:**

```typescript
import { parseSpintax } from '@/lib/spintax';

const original = "{Check out|See} our {new|latest} {product|service}!";
const variation = parseSpintax(original);

console.log(variation);
// Outputs randomly: "Check out our latest product!"
// Or: "See our new service!"
// Or any other combination
```

### generateVariations()

**Generate multiple variations:**

```typescript
import { generateVariations } from '@/lib/spintax';

const text = "{Hi|Hello} {world|everyone}!";
const variations = generateVariations(text, 3);

console.log(variations);
// ["Hi world!", "Hello everyone!", "Hi everyone!"]
```

### hasSpintax()

**Check if text contains spintax:**

```typescript
import { hasSpintax } from '@/lib/spintax';

hasSpintax("{Great|Good} post!");  // true
hasSpintax("Normal text");  // false
```

### countVariations()

**Count possible combinations:**

```typescript
import { countVariations } from '@/lib/spintax';

const text = "{A|B} {1|2|3}";
const count = countVariations(text);

console.log(count);  // 6 (A1, A2, A3, B1, B2, B3)
```

---

## 🔄 Automated Integration

### Cron Job Handler

**File:** [src/app/api/cron/publish/route.ts](file:///d:/ToolsLiguns/src/app/api/cron/publish/route.ts)

```typescript
// Before publishing
const uniqueCaption = parseSpintax(post.caption);

// Each platform gets unique variation
publishToFacebookPage(..., uniqueCaption, ...);
publishToInstagram(..., uniqueCaption, ...);
```

**Benefits:**
- Each social media account gets slightly different text
- Avoids duplicate content penalties
- Looks more natural/organic

---

## 📊 Examples

### Product Launch
```
Input:
{Exciting|Big|Amazing} news! {Check out|See|Discover} our {new|latest|brand new} {product|offering} {now|today}! {Get yours|Order now|Shop today}!

Variations:
1. "Exciting news! Check out our new product now! Get yours!"
2. "Big news! See our latest offering today! Order now!"
3. "Amazing news! Discover our brand new product today! Shop today!"
```

### Blog Post
```
Input:
{Read|Check out|See} our {new|latest} article about {social media|marketing} {tips|strategies}! {Link in bio|Swipe up|Click here}!

Variations:
1. "Read our new article about social media tips! Link in bio!"
2. "Check out our latest article about marketing strategies! Swipe up!"
3. "See our new article about social media strategies! Click here!"
```

### Event Promotion
```
Input:
{Join us|Don't miss|Come to} our {exclusive|special|amazing} event {this weekend|on Saturday}! {Limited spots|Spaces limited|Register now}!

Variations:
1. "Join us our exclusive event this weekend! Limited spots!"
2. "Don't miss our special event on Saturday! Spaces limited!"
3. "Come to our amazing event this weekend! Register now!"
```

---

## 🎨 Best Practices

### 1. Keep Variations Natural
```
✅ GOOD: "{Hi|Hello} everyone!"
❌ BAD: "{Hi|Greetings salutations}" (unnatural)
```

### 2. Maintain Meaning
```
✅ GOOD: "{Check out|See} our {new|latest} product"
❌ BAD: "{Buy|Ignore} our {new|old} product" (contradictory)
```

### 3. Don't Overuse
```
✅ GOOD: "{Great|Awesome} news! Our new product launches today!"
❌ BAD: "{Great|Awesome|Amazing|Incredible} {news|announcement|update}! {Our|The} {new|latest|brand-new} {product|item|offering} {launches|releases|drops} {today|now}!"
```

### 4. Test Variations
```typescript
// Generate a few to check they all make sense
const variations = generateVariations(text, 5);
variations.forEach(v => console.log(v));
```

---

## 🔧 Advanced Features

### Nested Spintax
```typescript
const text = "{Hello|{Hi|Hey}} there!";
parseSpintax(text);
// "Hello there!" or "Hi there!" or "Hey there!"
```

### Multiple Patterns
```typescript
const text = "{A|B} and {C|D} and {E|F}";
countVariations(text);  // 8 combinations
```

### Empty Options Handled
```typescript
const text = "{Word1||Word3}";  // Empty middle option
parseSpintax(text);
// Returns either "Word1" or "Word3", skips empty
```

---

## 📈 Use Cases

### 1. Multi-Account Posting
Post same content to multiple pages/accounts without duplicate content flags.

### 2. A/B Testing  
Generate variations to test which wording performs better.

### 3. Scheduled Posts
Create evergreen content with slight variations.

### 4. Bulk Content
Generate many similar but unique posts.

---

## 🧪 Testing

### Test Parser
```typescript
import { parseSpintax } from '@/lib/spintax';

// Test single pattern
console.log(parseSpintax("{A|B|C}"));

// Test multiple patterns
console.log(parseSpintax("{Great|Good} {morning|day}!"));

// Test nested
console.log(parseSpintax("{Hello|{Hi|Hey}} world!"));

// Test no spintax
console.log(parseSpintax("Normal text"));  // "Normal text"
```

### Test Integration
```sql
-- Create test post with spintax
INSERT INTO posts (caption, ...)
VALUES ('{Great|Awesome} test post!', ...);

-- Trigger cron
-- Check logs for different variations
```

---

## 📚 Related Files

- **Spintax Utility**: [src/lib/spintax.ts](file:///d:/ToolsLiguns/src/lib/spintax.ts)
- **Cron Handler**: [src/app/api/cron/publish/route.ts](file:///d:/ToolsLiguns/src/app/api/cron/publish/route.ts)

---

**Spintax creates unique content variations automatically!** 🔄
