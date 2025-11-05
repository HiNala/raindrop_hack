import { GET, POST } from '@/app/api/posts/route'
import { NextRequest } from 'next/server'

// Mock dependencies
const mockRequireUser = jest.fn()
const mockPrisma = {
  post: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}
const mockApplyRateLimit = jest.fn().mockResolvedValue(undefined)
const mockWithErrorHandling = jest.fn((handler) => handler)
const mockHandleAPIError = jest.fn()

jest.mock('@/lib/auth', () => ({
  requireUser: mockRequireUser,
}))

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

jest.mock('@/lib/rate-limit-middleware', () => ({
  applyRateLimit: mockApplyRateLimit,
}))

jest.mock('@/lib/errors', () => ({
  withErrorHandling: mockWithErrorHandling,
  handleAPIError: mockHandleAPIError,
}))

describe('Posts API Route', () => {
  let mockRequest: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockRequest = {
      url: 'http://localhost:3000/api/posts',
      json: jest.fn(),
      ip: '127.0.0.1',
      headers: new Map(),
    }
  })

  describe('GET /api/posts', () => {
    it('should return posts list', async () => {
      // Mock database responses
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Test Post 1',
          slug: 'test-post-1',
          excerpt: 'Test excerpt 1',
          publishedAt: new Date().toISOString(),
          author: {
            profile: {
              username: 'testuser',
              displayName: 'Test User',
              avatarUrl: 'https://example.com/avatar.jpg',
            },
          },
          tags: [{ tag: { name: 'JavaScript', slug: 'javascript', color: '#f7df1e' } }],
          _count: { likes: 5, comments: 2 },
        },
      ]

      mockPrisma.post.findMany.mockResolvedValue(mockPosts)
      mockPrisma.post.count.mockResolvedValue(1)

      const response = await GET(mockRequest as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toEqual(mockPosts)
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      })
    })

    it('should return single post when slug is provided', async () => {
      const mockPost = {
        id: 'post-1',
        title: 'Test Post 1',
        slug: 'test-post-1',
        content: 'Test content',
        published: true,
        author: {
          profile: {
            username: 'testuser',
            displayName: 'Test User',
            avatarUrl: 'https://example.com/avatar.jpg',
          },
        },
        tags: [],
        _count: { likes: 5, comments: 2 },
      }

      mockPrisma.post.findUnique.mockResolvedValue(mockPost)

      mockRequest.url = 'http://localhost:3000/api/posts?slug=test-post-1'
      const response = await GET(mockRequest as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockPost)
      expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-post-1', published: true },
        include: expect.objectContaining({
          author: expect.objectContaining({
            include: expect.objectContaining({
              profile: expect.objectContaining({
                select: expect.objectContaining({
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                }),
              }),
            }),
          }),
        }),
      })
    })

    it('should handle post not found', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(null)

      mockRequest.url = 'http://localhost:3000/api/posts?slug=non-existent'

      // The withErrorHandling wrapper should catch this and return appropriate response
      const mockHandler = mockWithErrorHandling.mock.calls[0][0]

      await expect(mockHandler()).rejects.toThrow()
    })

    it('should search posts by query', async () => {
      mockPrisma.post.findMany.mockResolvedValue([])
      mockPrisma.post.count.mockResolvedValue(0)

      mockRequest.url = 'http://localhost:3000/api/posts?search=test%20query'
      await GET(mockRequest as NextRequest)

      expect(mockPrisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: { contains: 'test query', mode: 'insensitive' } },
              { excerpt: { contains: 'test query', mode: 'insensitive' } },
            ],
          }),
        })
      )
    })

    it('should filter by tag', async () => {
      mockPrisma.post.findMany.mockResolvedValue([])
      mockPrisma.post.count.mockResolvedValue(0)

      mockRequest.url = 'http://localhost:3000/api/posts?tag=javascript'
      await GET(mockRequest as NextRequest)

      expect(mockPrisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tags: {
              some: {
                tag: { slug: 'javascript' },
              },
            },
          }),
        })
      )
    })

    it('should limit results and cap at maximum', async () => {
      mockPrisma.post.findMany.mockResolvedValue([])
      mockPrisma.post.count.mockResolvedValue(0)

      mockRequest.url = 'http://localhost:3000/api/posts?limit=100'
      await GET(mockRequest as NextRequest)

      expect(mockPrisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50, // Should be capped at 50
        })
      )
    })
  })

  describe('POST /api/posts', () => {
    const mockPostData = {
      title: 'New Test Post',
      excerpt: 'Test excerpt',
      content: '<p>Test content that is long enough</p>',
      tagIds: ['tag-1', 'tag-2'],
    }

    const mockUser = {
      id: 'user-1',
      clerkId: 'clerk-user-1',
      email: 'test@example.com',
      profile: {
        username: 'testuser',
        displayName: 'Test User',
      },
    }

    it('should create a new post', async () => {
      mockRequireUser.mockResolvedValue(mockUser)
      mockRequest.json.mockResolvedValue(mockPostData)

      const createdPost = {
        id: 'new-post-id',
        title: mockPostData.title,
        slug: 'new-test-post',
        excerpt: mockPostData.excerpt,
        contentHtml: mockPostData.content,
        authorId: mockUser.id,
        published: false,
        readTimeMin: 1,
        author: {
          profile: {
            username: mockUser.profile.username,
            displayName: mockUser.profile.displayName,
          },
        },
        tags: [],
      }

      mockPrisma.post.findUnique.mockResolvedValue(null) // No existing post with same slug
      mockPrisma.post.create.mockResolvedValue(createdPost)

      const response = await POST(mockRequest as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(createdPost)
      expect(mockPrisma.post.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: mockPostData.title,
            excerpt: mockPostData.excerpt,
            contentHtml: mockPostData.content,
            authorId: mockUser.id,
            published: false,
          }),
        })
      )
    })

    it('should require authentication', async () => {
      mockRequireUser.mockRejectedValue(new Error('Unauthorized'))
      mockRequest.json.mockResolvedValue(mockPostData)

      const mockHandler = mockWithErrorHandling.mock.calls[0][0]

      await expect(mockHandler()).rejects.toThrow()
    })

    it('should generate unique slug', async () => {
      mockRequireUser.mockResolvedValue(mockUser)
      mockRequest.json.mockResolvedValue(mockPostData)

      // First call - no existing post
      mockPrisma.post.findUnique.mockResolvedValueOnce(null)
      // Second call - also no existing post for slug with number
      mockPrisma.post.findUnique.mockResolvedValueOnce(null)

      const createdPost = {
        id: 'new-post-id',
        title: mockPostData.title,
        slug: 'new-test-post',
        authorId: mockUser.id,
      }

      mockPrisma.post.create.mockResolvedValue(createdPost)

      await POST(mockRequest as NextRequest)

      expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
        where: { slug: 'new-test-post' },
      })
    })

    it('should calculate reading time', async () => {
      mockRequireUser.mockResolvedValue(mockUser)

      const longContent = '<p>' + 'word '.repeat(400) + '</p>' // ~400 words
      mockRequest.json.mockResolvedValue({
        ...mockPostData,
        content: longContent,
      })

      mockPrisma.post.findUnique.mockResolvedValue(null)
      mockPrisma.post.create.mockResolvedValue({
        id: 'new-post-id',
        readTimeMin: 2, // 400 words / 200 = 2 minutes
      })

      await POST(mockRequest as NextRequest)

      expect(mockPrisma.post.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            readTimeMin: expect.any(Number),
          }),
        })
      )
    })

    it('should handle slug conflicts', async () => {
      mockRequireUser.mockResolvedValue(mockUser)
      mockRequest.json.mockResolvedValue(mockPostData)

      // First slug exists, second slug (with number) doesn't
      mockPrisma.post.findUnique
        .mockResolvedValueOnce({ id: 'existing-post' }) // existing slug
        .mockResolvedValueOnce(null) // slug with number is available

      mockPrisma.post.create.mockResolvedValue({
        id: 'new-post-id',
        slug: 'new-test-post-1',
      })

      await POST(mockRequest as NextRequest)

      expect(mockPrisma.post.findUnique).toHaveBeenCalledTimes(2)
      expect(mockPrisma.post.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'new-test-post-1',
          }),
        })
      )
    })
  })
})
