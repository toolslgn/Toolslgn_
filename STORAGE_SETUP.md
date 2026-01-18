# 📦 Supabase Storage Setup Guide

## Create Storage Bucket for Post Images

Before using the post scheduling feature, you need to create a Storage bucket in Supabase.

---

## 🚀 Quick Setup

### 1. Go to Supabase Dashboard
Visit: https://app.supabase.com

### 2. Navigate to Storage
- Select your project
- Click **Storage** in the sidebar
- Click **Create a new bucket**

### 3. Create `post-images` Bucket

**Bucket Configuration:**
```
Name: post-images
Public bucket: ✅ CHECKED (images need to be publicly accessible)
File size limit: 10 MB (optional)
Allowed MIME types: image/* (optional)
```

Click **Create bucket**

---

## 🔐 Row Level Security (RLS) Policies

After creating the bucket, set up RLS policies:

### Policy 1: Allow Authenticated Users to Upload

```sql
-- Allow users to upload their own images
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 2: Allow Public Read Access

```sql
-- Allow anyone to view images
CREATE POLICY "Public images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');
```

### Policy 3: Allow Users to Delete Their Own Images

```sql
-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## ✅ Verification

### Test Upload
1. Go to `http://localhost:3000/dashboard/create`
2. Select a website
3. Upload an image
4. Write a caption
5. Select date, time, and accounts
6. Click **Schedule Post**

### Check Storage
1. Go to Supabase Dashboard → **Storage** → **post-images**
2. You should see a folder with your user ID
3. Inside, you'll find the uploaded image

### Verify Public URL
The image URL should look like:
```
https://[project-id].supabase.co/storage/v1/object/public/post-images/[user-id]/[timestamp].[ext]
```

---

## 🔧 Troubleshooting

### Error: "Bucket not found"
- Make sure you created the bucket named exactly `post-images`
- Check that the bucket is public

### Error: "Permission denied"
- Make sure you're authenticated (logged in)
- Verify RLS policies are set up correctly
- Check that the user ID matches the folder structure

### Error: "File too large"
- Default limit is 50MB
- You can set a custom limit in bucket settings
- The app limits to 10MB for performance

---

## 📚 Related Documentation

- **Supabase Storage Docs**: https://supabase.com/docs/guides/storage
- **RLS Policies**: https://supabase.com/docs/guides/storage/security/access-control
- **Server Action**: [src/app/dashboard/create/actions.ts](file:///d:/ToolsLiguns/src/app/dashboard/create/actions.ts)

---

**Storage bucket is required for the Create Post feature to work!** 🎉
