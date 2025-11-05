# API Reference

Complete reference for all API endpoints and server actions in the Medium AI Blog Platform.

## Table of Contents

1. [Authentication](#authentication)
2. [Server Actions](#server-actions)
3. [REST API Endpoints](#rest-api-endpoints)
4. [File Upload](#file-upload)
5. [Response Formats](#response-formats)

---

## Authentication

All protected endpoints require Clerk authentication. The session token is automatically passed via cookies for same-origin requests.

### Headers Required for Protected Endpoints

```
Authorization: Bearer <session_token>
```

---

## Server Actions

Server actions are called directly from client components using React Server Actions.

### Post Management

#### `saveDraft(postId, data)`

**Location:** `src/app/actions/post-actions.ts`

**Description:** Create or update a draft post

**Parameters:**
```typescript
postId: string | undefined  // undefined for new draft
data: {
  title: string
  excerpt?: string
  contentJson: object       // TipTap JSON
  coverImage?: string
  tagIds?: string[]
}
```

**Returns:**
```typescript
{
  success: boolean
  data?: { postId: string }
  error?: string
}
```

**Usage:**
```typescript
const result = await saveDraft(undefined, {
  title: "My Post",
  contentJson: { type: 'doc', content: [] },
  tagIds: ["tag-id-1", "tag-id-2"]
})
```

---

#### `publishPost(postId)`

**Description:** Publish a draft post

**Parameters:**
```typescript
postId: string
```

**Returns:**
```typescript
{
  success: boolean
  data?: { slug: string }
  error?: string
}
```

**Validation:**
- Title must be at least 10 characters
- At least one tag required
- Content must not be empty

---

#### `unpublishPost(postId)`

**Description:** Revert published post to draft

**Parameters:**
```typescript
postId: string
```

**Returns:**
```typescript
{
  success: boolean
  error?: string
}
```

---

#### `deletePost(postId)`

**Description:** Permanently delete a post

**Parameters:**
```typescript
postId: string
```

**Returns:**
```typescript
{
  success: boolean
  error?: string
}
```

**Authorization:** Only post owner can delete

---

#### `getOrCreateTags(tagNames)`

**Description:** Get existing tags or create new ones

**Parameters:**
```typescript
tagNames: string[]  // e.g., ["JavaScript", "React", "Web Dev"]
```

**Returns:**
```typescript
{
  success: boolean
  data?: string[]  // Array of tag IDs
  error?: string
}
```

---

### AI Generation

#### `generateAuthenticatedPost(prompt, options)`

**Location:** `src/app/actions/generate-post.ts`

**Description:** Generate a blog post using OpenAI for authenticated users

**Parameters:**
```typescript
prompt: string
options?: {
  tone?: 'professional' | 'casual' | 'technical'
  length?: 'short' | 'medium' | 'long'
  audience?: string
}
```

**Returns:**
```typescript
{
  success: boolean
  data?: {
    postId: string
    title: string
    excerpt: string
    contentJson: object
    suggestedTags: string[]
    readTimeMin: number
    remaining: number  // Remaining generations today
  }
  error?: string
}
```

**Rate Limit:** 10 generations per day per user

---

#### `generateAnonymousPost(prompt, options)`

**Description:** Generate post content for anonymous users (not saved to DB)

**Parameters:** Same as `generateAuthenticatedPost`

**Returns:**
```typescript
{
  success: boolean
  data?: {
    title: string
    excerpt: string
    contentJson: object
    suggestedTags: string[]
    readTimeMin: number
  }
  error?: string
}
```

**Note:** Content returned but not saved. Client stores in localStorage.

---

## REST API Endpoints

### Tags

#### `GET /api/tags`

**Description:** Get all tags

**Authentication:** Public

**Response:**
```json
{
  "tags": [
    {
      "id": "tag-id",
      "name": "JavaScript",
      "slug": "javascript",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Likes

#### `POST /api/posts/[id]/like`

**Description:** Toggle like on a post

**Authentication:** Required

**Parameters:**
- `id`: Post ID (in URL path)

**Response:**
```json
{
  "likes": 42,
  "isLiked": true
}
```

---

#### `GET /api/posts/[id]/like/check`

**Description:** Check if current user has liked a post

**Authentication:** Required

**Response:**
```json
{
  "isLiked": true
}
```

---

### Comments

#### `GET /api/posts/[id]/comments`

**Description:** Get all comments for a post

**Authentication:** Public

**Response:**
```json
{
  "comments": [
    {
      "id": "comment-id",
      "body": "Great post!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "profile": {
          "username": "john_doe",
          "displayName": "John Doe",
          "avatarUrl": "https://..."
        }
      }
    }
  ]
}
```

---

#### `POST /api/posts/[id]/comments`

**Description:** Create a new comment

**Authentication:** Required

**Request Body:**
```json
{
  "body": "This is my comment"
}
```

**Response:**
```json
{
  "comment": {
    "id": "comment-id",
    "body": "This is my comment",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "profile": {
        "username": "john_doe",
        "displayName": "John Doe",
        "avatarUrl": "https://..."
      }
    }
  }
}
```

**Validation:**
- `body` must not be empty
- Maximum length: 1000 characters

---

#### `DELETE /api/posts/[id]/comments/[commentId]`

**Description:** Delete a comment

**Authentication:** Required

**Authorization:** Comment author or post author only

**Response:**
```json
{
  "success": true
}
```

---

### Profile

#### `PATCH /api/profile`

**Description:** Update user profile

**Authentication:** Required

**Request Body:**
```json
{
  "displayName": "John Doe",
  "bio": "Software developer and writer",
  "websiteUrl": "https://johndoe.com",
  "avatarUrl": "https://..."
}
```

**Response:**
```json
{
  "profile": {
    "id": "profile-id",
    "userId": "user-id",
    "username": "john_doe",
    "displayName": "John Doe",
    "bio": "Software developer and writer",
    "avatarUrl": "https://...",
    "websiteUrl": "https://johndoe.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Validation:**
- `displayName` required, max 100 characters
- `bio` max 500 characters
- `websiteUrl` must be valid URL

---

## File Upload

### UploadThing Endpoints

#### `POST /api/uploadthing`

**Description:** Upload files via UploadThing

**Authentication:** Required

**Usage:** Use the provided hooks from `@/lib/uploadthing`

```typescript
import { useUploadThing } from '@/lib/uploadthing'

const { startUpload } = useUploadThing('coverImageUploader')
const result = await startUpload([file])
```

**Upload Types:**

1. **coverImageUploader**
   - Max size: 8MB
   - Max files: 1
   - Accepted: images only

2. **avatarUploader**
   - Max size: 2MB
   - Max files: 1
   - Accepted: images only

3. **imageUploader**
   - Max size: 4MB
   - Max files: 1
   - Accepted: images only

**Response:**
```typescript
[
  {
    url: "https://utfs.io/f/...",
    name: "image.jpg",
    size: 123456,
    key: "...",
    type: "image/jpeg"
  }
]
```

---

## Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

Or for API routes:

```json
{
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

### AI Generation
- **Authenticated Users:** 10 posts per 24 hours
- **Anonymous Users:** Enforced client-side (3 posts in localStorage)

### Other Endpoints
No rate limiting currently implemented. Consider adding for production:
- Upstash Redis for distributed rate limiting
- Or in-memory Map for single-server deployments

---

## Error Handling

All API endpoints and server actions follow this pattern:

**Server Actions:**
```typescript
try {
  // Operation
  return { success: true, data: result }
} catch (error) {
  return { success: false, error: error.message }
}
```

**API Routes:**
```typescript
try {
  // Operation
  return NextResponse.json({ data: result })
} catch (error) {
  return NextResponse.json(
    { error: error.message }, 
    { status: 500 }
  )
}
```

---

## Best Practices

1. **Always check `success` field** in server action responses
2. **Use optimistic UI** for likes and comments
3. **Handle loading states** with disabled buttons
4. **Show error toasts** for failed operations
5. **Revalidate paths** after mutations
6. **Use TypeScript** for type safety
7. **Validate on both** client and server
8. **Handle edge cases** (network errors, timeouts)

---

## Example Usage

### Complete Post Creation Flow

```typescript
'use client'

import { useState } from 'react'
import { saveDraft, publishPost, getOrCreateTags } from '@/app/actions/post-actions'
import toast from 'react-hot-toast'

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState({})
  const [tags, setTags] = useState(['JavaScript', 'Tutorial'])
  
  const handlePublish = async () => {
    // 1. Create or get tags
    const tagsResult = await getOrCreateTags(tags)
    if (!tagsResult.success) {
      toast.error('Failed to process tags')
      return
    }
    
    // 2. Save as draft
    const draftResult = await saveDraft(undefined, {
      title,
      contentJson: content,
      tagIds: tagsResult.data
    })
    
    if (!draftResult.success) {
      toast.error('Failed to save draft')
      return
    }
    
    // 3. Publish
    const publishResult = await publishPost(draftResult.data.postId)
    
    if (!publishResult.success) {
      toast.error('Failed to publish')
      return
    }
    
    toast.success('Post published!')
    // Redirect to published post
    window.location.href = `/p/${publishResult.data.slug}`
  }
  
  return (
    <button onClick={handlePublish}>
      Publish Post
    </button>
  )
}
```

---

For more details, see the source code in `src/app/actions/` and `src/app/api/`.


