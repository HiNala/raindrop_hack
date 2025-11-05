import {
  postCreateSchema,
  userProfileCreateSchema,
  commentCreateSchema,
  tagCreateSchema,
  validateSearchParams,
  validatePagination,
} from '../enhanced-validations'

describe('Validation Schemas', () => {
  describe('postCreateSchema', () => {
    it('should validate valid post data', () => {
      const validData = {
        title: 'Test Post Title',
        slug: 'test-post-title',
        excerpt: 'Test excerpt',
        content: 'Test content that is long enough to pass validation',
        published: false,
        featured: true,
        tagIds: ['tag1', 'tag2'],
      }

      const result = postCreateSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should reject invalid title', () => {
      const invalidData = {
        title: '', // Empty title
        content: 'Test content long enough',
      }

      expect(() => postCreateSchema.parse(invalidData)).toThrow()
    })

    it('should reject title that is too long', () => {
      const invalidData = {
        title: 'a'.repeat(201), // Too long
        content: 'Test content long enough',
      }

      expect(() => postCreateSchema.parse(invalidData)).toThrow()
    })

    it('should reject content that is too short', () => {
      const invalidData = {
        title: 'Valid Title',
        content: 'short', // Too short
      }

      expect(() => postCreateSchema.parse(invalidData)).toThrow()
    })

    it('should reject invalid slug format', () => {
      const invalidData = {
        title: 'Valid Title',
        slug: 'Invalid Slug With Spaces',
        content: 'Test content long enough',
      }

      expect(() => postCreateSchema.parse(invalidData)).toThrow()
    })

    it('should accept optional fields', () => {
      const validData = {
        title: 'Test Post Title',
        slug: 'test-post-title',
        content: 'Test content that is long enough to pass validation',
      }

      const result = postCreateSchema.parse(validData)
      expect(result.excerpt).toBeUndefined()
      expect(result.published).toBe(false) // default value
      expect(result.featured).toBe(false) // default value
    })
  })

  describe('userProfileCreateSchema', () => {
    it('should validate valid profile data', () => {
      const validData = {
        username: 'testuser',
        displayName: 'Test User',
        bio: 'Test bio',
        websiteUrl: 'https://example.com',
        githubUrl: 'https://github.com/testuser',
        twitterUrl: 'https://twitter.com/testuser',
        linkedinUrl: 'https://linkedin.com/in/testuser',
      }

      const result = userProfileCreateSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should reject invalid username', () => {
      const invalidData = {
        username: 'us', // Too short
        displayName: 'Test User',
      }

      expect(() => userProfileCreateSchema.parse(invalidData)).toThrow()
    })

    it('should reject username with spaces', () => {
      const invalidData = {
        username: 'test user', // Contains space
        displayName: 'Test User',
      }

      expect(() => userProfileCreateSchema.parse(invalidData)).toThrow()
    })

    it('should reject invalid URLs', () => {
      const invalidData = {
        username: 'testuser',
        displayName: 'Test User',
        websiteUrl: 'not-a-url',
      }

      expect(() => userProfileCreateSchema.parse(invalidData)).toThrow()
    })

    it('should reject GitHub URLs that are not GitHub', () => {
      const invalidData = {
        username: 'testuser',
        displayName: 'Test User',
        githubUrl: 'https://example.com/not-github',
      }

      expect(() => userProfileCreateSchema.parse(invalidData)).toThrow()
    })
  })

  describe('commentCreateSchema', () => {
    it('should validate valid comment data', () => {
      const validData = {
        body: 'This is a valid comment',
        postId: 'test-post-id',
        parentId: 'test-parent-id',
      }

      const result = commentCreateSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should reject empty comment', () => {
      const invalidData = {
        body: '', // Empty comment
        postId: 'test-post-id',
      }

      expect(() => commentCreateSchema.parse(invalidData)).toThrow()
    })

    it('should reject comment that is too long', () => {
      const invalidData = {
        body: 'a'.repeat(1001), // Too long
        postId: 'test-post-id',
      }

      expect(() => commentCreateSchema.parse(invalidData)).toThrow()
    })

    it('should trim comment text', () => {
      const validData = {
        body: '  trimmed comment  ',
        postId: 'test-post-id',
      }

      const result = commentCreateSchema.parse(validData)
      expect(result.body).toBe('trimmed comment')
    })
  })

  describe('tagCreateSchema', () => {
    it('should validate valid tag data', () => {
      const validData = {
        name: 'Test Tag',
        slug: 'test-tag',
        description: 'Test tag description',
        color: '#FF5733',
      }

      const result = tagCreateSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should reject invalid color format', () => {
      const invalidData = {
        name: 'Test Tag',
        slug: 'test-tag',
        color: 'invalid-color',
      }

      expect(() => tagCreateSchema.parse(invalidData)).toThrow()
    })

    it('should accept valid hex color formats', () => {
      const validData = {
        name: 'Test Tag',
        slug: 'test-tag',
      }

      expect(() => tagCreateSchema.parse({ ...validData, color: '#FFF' })).not.toThrow()
      expect(() => tagCreateSchema.parse({ ...validData, color: '#FFFFFF' })).not.toThrow()
    })
  })

  describe('Helper Functions', () => {
    describe('validatePagination', () => {
      it('should validate pagination params with defaults', () => {
        const params = {}
        const result = validatePagination(params)

        expect(result.page).toBe(1)
        expect(result.limit).toBe(10)
      })

      it('should validate pagination params with custom values', () => {
        const params = { page: '2', limit: '20' }
        const result = validatePagination(params)

        expect(result.page).toBe(2)
        expect(result.limit).toBe(20)
      })

      it('should clamp values to limits', () => {
        const params = { page: '2000', limit: '200' }
        const result = validatePagination(params)

        expect(result.page).toBe(1000) // max
        expect(result.limit).toBe(100) // max
      })
    })

    describe('validateSearchParams', () => {
      it('should validate search params', () => {
        const params = {
          q: 'search query',
          page: '2',
          limit: '20',
          sort: 'popular',
          tag: 'javascript',
        }

        const result = validateSearchParams(params)

        expect(result.q).toBe('search query')
        expect(result.page).toBe(2)
        expect(result.limit).toBe(20)
        expect(result.sort).toBe('popular')
        expect(result.tag).toBe('javascript')
      })

      it('should apply defaults', () => {
        const params = {}
        const result = validateSearchParams(params)

        expect(result.q).toBeUndefined()
        expect(result.page).toBe(1)
        expect(result.limit).toBe(10)
        expect(result.sort).toBe('newest')
      })

      it('should reject invalid sort value', () => {
        const params = { sort: 'invalid' }

        expect(() => validateSearchParams(params)).toThrow()
      })
    })
  })
})
