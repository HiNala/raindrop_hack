-- Database optimization script
-- Add critical indexes for performance

-- Posts table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_author_published_featured 
ON posts(authorId, published, featured, publishedAt DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_published_publishedAt 
ON posts(published, publishedAt DESC) 
WHERE published = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_visibility_published 
ON posts(visibility, published) 
WHERE published = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_slug_published 
ON posts(slug, published);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_title_search 
ON posts USING gin(to_tsvector('english', title))
WHERE published = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_excerpt_search 
ON posts USING gin(to_tsvector('english', excerpt))
WHERE published = true;

-- Comments table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_post_status_created 
ON comments(postId, status, createdAt DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_author_created 
ON comments(authorId, createdAt DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_parent_post 
ON comments(parentId, postId) 
WHERE parentId IS NOT NULL;

-- Analytics table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_post_date 
ON analytics_daily(postId, date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_post_analytics_post_date 
ON post_analytics(postId, date DESC);

-- Likes and bookmarks indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_likes_user_post 
ON likes(userId, postId);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_likes_post_created 
ON likes(postId, createdAt DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookmarks_user_created 
ON bookmarks(userId, createdAt DESC);

-- Referrers indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_referrers_post_count 
ON referrers(postId, count DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_referrers_post_source 
ON referrers(postId, source);

-- Tags and PostTags indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_post_tags_post_tag 
ON post_tags(postId, tagId);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tags_name_slug 
ON tags(name, slug);

-- User and profile indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_clerk_id 
ON users(clerkId);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_username 
ON user_profiles(username);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_display_name 
ON user_profiles(display_name);

-- Slug redirects indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_slug_redirects_from 
ON slug_redirects(fromSlug);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_slug_redirects_post 
ON slug_redirects(postId);

-- Series indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_series_author 
ON series(authorId);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_series_slug 
ON series(slug);

-- Schedule indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_schedules_status_publishAt 
ON schedules(status, publishAt) 
WHERE status = 'SCHEDULED';

-- Create composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_list_optimized 
ON posts(published, featured DESC, publishedAt DESC, id) 
WHERE published = true;

-- Partial indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_published_only 
ON posts(publishedAt DESC, id) 
WHERE published = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_published 
ON comments(createdAt DESC, id) 
WHERE status = 'PUBLISHED';

-- Update table statistics for better query planning
ANALYZE posts;
ANALYZE comments;
ANALYZE analytics_daily;
ANALYZE post_analytics;
ANALYZE likes;
ANALYZE bookmarks;
ANALYZE referrers;
ANALYZE post_tags;
ANALYZE tags;
ANALYZE users;
ANALYZE user_profiles;
ANALYZE slug_redirects;
ANALYZE series;
ANALYZE schedules;