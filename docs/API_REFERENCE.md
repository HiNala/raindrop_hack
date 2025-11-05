# 📚 API Reference

This document provides a comprehensive overview of all API endpoints available in the blog platform.

## 🔐 Authentication

Most API endpoints require authentication via Clerk. Include the Clerk session token in your requests:

```javascript
// Client-side with Clerk
const { getToken } = auth();
const token = await getToken();

// Include in headers
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 📝 Posts API

### Get All Posts
```http
GET /api/posts
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)
- `tag` (optional): Filter by tag slug
- `search` (optional): Search in title and content
- `author` (optional): Filter by author username

**Response:**
```json
{
  "posts": [
    {
      "id": "post_id",
      "title": "Post Title",
      "slug": "post-slug",
      "excerpt": "Post excerpt...",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "profile": {
          "username": "author",
          "displayName": "Author Name",
          "avatarUrl": "https://..."
        }
      },
      "tags": [
        {
          "tag": {
            "name": "javascript",
            "slug": "javascript"
          }
        }
      ],
      "_count": {
        "likes": 10,
        "comments": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get Single Post
```http
GET /api/posts/[id]
```

**Response:**
```json
{
  "id": "post_id",
  "title": "Post Title",
  "slug": "post-slug",
  "excerpt": "Post excerpt...",
  "contentJson": {...},
  "contentHtml": "<p>Post content...</p>",
  "published": true,
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "coverImage": "https://...",
  "readTimeMin": 5,
  "author": {
    "profile": {
      "username": "author",
      "displayName": "Author Name",
      "bio": "Author bio...",
      "avatarUrl": "https://..."
    }
  },
  "tags": [...]
}
```

### Create Post (Authenticated)
```http
POST /api/posts
```

**Request Body:**
```json
{
  "title": "Post Title",
  "excerpt": "Post excerpt...",
  "contentJson": {...},
  "coverImage": "https://...",
  "tagIds": ["tag_id_1", "tag_id_2"],
  "published": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_post_id",
    "slug": "post-slug"
  }
}
```

### Update Post (Authenticated, Owner Only)
```http
PUT /api/posts/[id]
```

**Request Body:** Same as create post

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "post_id",
    "slug": "updated-slug"
  }
}
```

### Delete Post (Authenticated, Owner Only)
```http
DELETE /api/posts/[id]
```

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

## ❤️ Likes API

### Like/Unlike Post (Authenticated)
```http
POST /api/posts/[id]/like
```

**Response:**
```json
{
  "success": true,
  "liked": true,
  "likesCount": 11
}
```

### Check Like Status (Authenticated)
```http
GET /api/posts/[id]/like/check
```

**Response:**
```json
{
  "liked": true
}
```

## 💬 Comments API

### Get Post Comments
```http
GET /api/posts/[id]/comments
```

**Response:**
```json
{
  "comments": [
    {
      "id": "comment_id",
      "body": "Comment content...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "profile": {
          "username": "commenter",
          "displayName": "Commenter Name",
          "avatarUrl": "https://..."
        }
      }
    }
  ]
}
```

### Add Comment (Authenticated)
```http
POST /api/posts/[id]/comments
```

**Request Body:**
```json
{
  "body": "Comment content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_comment_id",
    "body": "Comment content...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete Comment (Authenticated, Author Only)
```http
DELETE /api/comments/[id]
```

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

## 🏷️ Tags API

### Get All Tags
```http
GET /api/tags
```

**Response:**
```json
{
  "tags": [
    {
      "id": "tag_id",
      "name": "JavaScript",
      "slug": "javascript",
      "_count": {
        "posts": 15
      }
    }
  ]
}
```

### Create Tag (Authenticated)
```http
POST /api/tags
```

**Request Body:**
```json
{
  "name": "New Tag"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_tag_id",
    "name": "New Tag",
    "slug": "new-tag"
  }
}
```

## 👤 Profile API

### Get User Profile
```http
GET /api/profile
```

**Response:**
```json
{
  "id": "user_id",
  "username": "username",
  "displayName": "Display Name",
  "bio": "User bio...",
  "avatarUrl": "https://...",
  "websiteUrl": "https://...",
  "location": "Location",
  "_count": {
    "posts": 10,
    "followers": 100,
    "following": 50
  }
}
```

### Update Profile (Authenticated)
```http
PATCH /api/profile
```

**Request Body:**
```json
{
  "displayName": "New Display Name",
  "bio": "Updated bio...",
  "avatarUrl": "https://...",
  "websiteUrl": "https://...",
  "location": "New Location"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "displayName": "New Display Name",
    "bio": "Updated bio..."
  }
}
```

## 🔍 Search API

### Search Posts
```http
GET /api/search
```

**Query Parameters:**
- `q` (required): Search query
- `type` (optional): "posts" (default), "tags", "users"
- `limit` (optional): Results per page (default: 10)

**Response:**
```json
{
  "results": [
    {
      "type": "post",
      "id": "post_id",
      "title": "Post Title",
      "slug": "post-slug",
      "excerpt": "Matching excerpt...",
      "author": {...}
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

## 🚀 Server Actions

The following server actions are available for form handling:

### generatePost
```typescript
import { generateAuthenticatedPost, generateAnonymousPost } from '@/app/actions/generate-post'

// For authenticated users
const result = await generateAuthenticatedPost(prompt, {
  tone: 'professional',
  length: 'medium'
})

// For anonymous users
const result = await generateAnonymousPost(prompt, {
  tone: 'casual',
  length: 'short'
})
```

### Post Management
```typescript
import { saveDraft, publishPost, deletePost, getOrCreateTags } from '@/app/actions/post-actions'

// Save draft
const result = await saveDraft(postId, postData)

// Publish post
const result = await publishPost(postId)

// Delete post
const result = await deletePost(postId)

// Get or create tags
const result = await getOrCreateTags(['javascript', 'react'])
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🔒 Rate Limits

- **AI Generation**: 10 posts per day per authenticated user
- **Anonymous Posts**: 3 posts total (client-side enforced)
- **API Calls**: No global rate limit (implement as needed)

## 🌍 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (development)
- Your production domain
- UploadThing domains for file uploads

## 🛠️ Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | User not authenticated |
| `FORBIDDEN` | User doesn't have permission |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `RATE_LIMITED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

## 📝 Data Models

### Post
```typescript
interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  contentJson: object
  contentHtml?: string
  coverImage?: string
  published: boolean
  publishedAt?: Date
  featured: boolean
  readTimeMin?: number
  authorId: string
  author: User
  tags: PostTag[]
  likes: Like[]
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}
```

### User
```typescript
interface User {
  id: string
  clerkId: string
  email: string
  profile?: Profile
  posts: Post[]
  comments: Comment[]
  likes: Like[]
  createdAt: Date
  updatedAt: Date
}
```

### Profile
```typescript
interface Profile {
  id: string
  userId: string
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
  websiteUrl?: string
  location?: string
  createdAt: Date
  updatedAt: Date
}
```

## 🔄 Real-time Features

While the API is RESTful, the UI provides optimistic updates for:
- Likes
- Comments
- Post creation
- Draft saving

For real-time collaboration, consider implementing WebSockets or Server-Sent Events.

---

For more information, check the [TypeScript types](src/lib/validations.ts) and [Prisma schema](prisma/schema.prisma).