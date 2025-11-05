-- CreateIndex
CREATE INDEX "comments_postId_createdAt_idx" ON "comments"("postId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "comments_authorId_idx" ON "comments"("authorId");

-- CreateIndex
CREATE INDEX "likes_postId_idx" ON "likes"("postId");

-- CreateIndex
CREATE INDEX "likes_userId_idx" ON "likes"("userId");

-- CreateIndex
CREATE INDEX "post_tags_tagId_idx" ON "post_tags"("tagId");

-- CreateIndex
CREATE INDEX "post_tags_postId_idx" ON "post_tags"("postId");

-- CreateIndex
CREATE INDEX "posts_slug_idx" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "posts_published_publishedAt_idx" ON "posts"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "posts_authorId_published_idx" ON "posts"("authorId", "published");

-- CreateIndex
CREATE INDEX "posts_publishedAt_idx" ON "posts"("publishedAt" DESC);
