# API Reference

Complete API documentation for Blog App endpoints.

## Base URL

- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

## Authentication

Most endpoints require Clerk authentication. Include the session cookie in requests, or use the `Authorization` header for server-to-server calls.

## Endpoints

### Health Check

**GET** `/api/health`

Check application health and environment configuration.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-11-05T06:54:53.000Z",
  "environment": {
    "node": "production",
    "configured": true,
    "checks": {
      "database": true,
      "clerk": true,
      "openai": true,
      "uploadthing": true
    }
  },
  "database": {
    "connected": true,
    "provider": "postgresql"
  }
}
```

---

### Posts

#### Get All Posts

**GET** `/api/posts`

**Query Parameters:**
- `published` (boolean): Filter by published status
- `authorId` (string): Filter by author
- `tag` (string): Filter by tag slug
- `limit` (number): Limit results (default: 20)
- `offset` (number): Pagination offset

**Response:**
```json
{
  "posts": [
    {
      "id": "clx...",
      "title": "Post Title",
      "slug": "post-title",
      "excerpt": "Post excerpt",
      "published": true,
      "publishedAt": "2024-11-05T06:00:00.000Z",
      "author": {
        "profile": {
          "username": "author",
          "displayName": "Author Name"
        }
      },
      "tags": [...],
      "_count": {
        "likes": 10,
        "comments": 5
      }
    }
  ],
  "total": 100
}
```

#### Get Single Post

**GET** `/api/posts/[id]`

**Response:**
```json
{
  "id": "clx...",
  "title": "Post Title",
  "slug": "post-title",
  "contentJson": {...},
  "published": true,
  "author": {...},
  "tags": [...]
}
```

#### Create Post

**POST** `/api/posts`

**Authentication:** Required

**Body:**
```json
{
  "title": "Post Title",
  "slug": "post-title",
  "excerpt": "Post excerpt",
  "contentJson": {...},
  "tags": ["tag-slug-1", "tag-slug-2"]
}
```

**Response:**
```json
{
  "id": "clx...",
  "title": "Post Title",
  "slug": "post-title"
}
```

#### Update Post

**PATCH** `/api/posts/[id]`

**Authentication:** Required (owner only)

**Body:** Same as create, all fields optional

**Response:** Updated post object

#### Delete Post

**DELETE** `/api/posts/[id]`

**Authentication:** Required (owner only)

**Response:**
```json
{
  "success": true
}
```

---

### Likes

#### Toggle Like

**POST** `/api/posts/[id]/like`

**Authentication:** Required

**Response:**
```json
{
  "liked": true,
  "likes": 11
}
```

#### Check Like Status

**GET** `/api/posts/[id]/like/check`

**Authentication:** Required

**Response:**
```json
{
  "liked": true
}
```

---

### Comments

#### Get Comments

**GET** `/api/posts/[id]/comments`

**Response:**
```json
{
  "comments": [
    {
      "id": "clx...",
      "body": "Comment text",
      "author": {
        "profile": {
          "username": "user",
          "displayName": "User Name"
        }
      },
      "createdAt": "2024-11-05T06:00:00.000Z"
    }
  ]
}
```

#### Add Comment

**POST** `/api/posts/[id]/comments`

**Authentication:** Required

**Body:**
```json
{
  "body": "Comment text"
}
```

**Response:** Created comment object

#### Delete Comment

**DELETE** `/api/posts/[id]/comments/[commentId]`

**Authentication:** Required (author only)

**Response:**
```json
{
  "success": true
}
```

---

### Tags

#### Get All Tags

**GET** `/api/tags`

**Response:**
```json
{
  "tags": [
    {
      "id": "clx...",
      "name": "JavaScript",
      "slug": "javascript",
      "_count": {
        "posts": 10
      }
    }
  ]
}
```

#### Create Tag

**POST** `/api/tags`

**Authentication:** Required

**Body:**
```json
{
  "name": "New Tag"
}
```

**Response:** Created tag object

---

### Profile

#### Get Profile

**GET** `/api/profile`

**Authentication:** Required

**Response:**
```json
{
  "username": "user",
  "displayName": "User Name",
  "bio": "Bio text",
  "avatarUrl": "https://...",
  "websiteUrl": "https://...",
  "location": "Location"
}
```

#### Update Profile

**PATCH** `/api/profile`

**Authentication:** Required

**Body:**
```json
{
  "displayName": "New Name",
  "bio": "New bio",
  "websiteUrl": "https://...",
  "location": "New Location"
}
```

**Response:** Updated profile object

---

### Upload

#### Upload Image

**POST** `/api/uploadthing`

**Authentication:** Required (via UploadThing)

Upload cover images or avatars via UploadThing.

**Response:**
```json
{
  "url": "https://utfs.io/...",
  "key": "...",
  "name": "image.jpg",
  "size": 123456
}
```

---

## Rate Limiting

### Current Limits

- **AI Generation:** 10 requests per day per user
- **HN Context:** 10 requests per day per user (when implemented)
- **Comments:** 50 per hour per user
- **Likes:** 100 per hour per user

### Rate Limit Headers

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1700000000
```

### Rate Limit Response

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 3600
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

---

## Server Actions

### Generate Post

**Server Action:** `generateAuthenticatedPost`

**Parameters:**
- `prompt` (string): Post description
- `options` (object):
  - `tone`: 'professional' | 'casual' | 'technical'
  - `length`: 'short' | 'medium' | 'long'

**Returns:**
```json
{
  "success": true,
  "data": {
    "postId": "clx...",
    "title": "Generated Title",
    "contentJson": {...}
  }
}
```

### Save Draft

**Server Action:** `saveDraft`

**Parameters:**
- `postId` (string): Post ID
- `data` (object): Post data

**Returns:** Updated post

### Publish Post

**Server Action:** `publishPost`

**Parameters:**
- `postId` (string): Post ID

**Returns:** Published post

---

## Webhooks

### Clerk Webhooks

**POST** `/api/webhooks/clerk`

Handle Clerk user events (user.created, user.updated, user.deleted).

---

## Examples

### Create Post with cURL

```bash
curl -X POST https://your-domain.com/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=..." \
  -d '{
    "title": "My Post",
    "slug": "my-post",
    "excerpt": "Post excerpt",
    "contentJson": {},
    "tags": ["javascript"]
  }'
```

### Like Post with fetch

```javascript
const response = await fetch('/api/posts/post-id/like', {
  method: 'POST',
  credentials: 'include',
});
const data = await response.json();
```

---

## Changelog

### v1.0.0 (2024-11-05)
- Initial API release
- Posts, Comments, Likes endpoints
- Tag management
- Profile management
- Image uploads

