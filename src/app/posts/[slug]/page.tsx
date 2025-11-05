import { format } from 'date-fns'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  User, 
  MessageCircle, 
  Heart, 
  Bookmark, 
  Share2, 
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2
} from 'lucide-react'

async function getPost(slug: string) {
  return {
    id: '1',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    slug: 'future-web-development-2024',
    content: `# The Future of Web Development: Trends to Watch in 2024

The landscape of web development is evolving at an unprecedented pace. As we navigate through 2024, several transformative trends are reshaping how we build, deploy, and maintain web applications. This comprehensive guide explores the most significant developments that every developer should be aware of.

## 1. AI-Powered Development Tools

Artificial Intelligence has moved from being a buzzword to becoming an integral part of the development workflow.

### GitHub Copilot and Beyond

GitHub Copilot has revolutionized how developers write code, offering intelligent suggestions and completing entire functions based on context. But this is just the beginning. We're seeing:

- **Advanced code generation** that understands project architecture
- **Automated testing** based on code patterns
- **Intelligent debugging** that suggests fixes before you even spot the issue
- **Documentation generation** that updates automatically with code changes

### The Rise of AI-First Development

Teams are now designing applications with AI integration at their core rather than as an afterthought. This means:

\`\`\`javascript
// Example: AI-powered search functionality
const searchWithAI = async (query) => {
  const embedding = await generateEmbedding(query);
  const results = await vectorSearch(embedding);
  return results.map(item => ({
    ...item,
    relevance: calculateRelevance(item, query)
  }));
};
\`\`\`

## 2. Edge Computing and Serverless 2.0

The shift towards edge computing is accelerating, bringing computation closer to users and reducing latency significantly.

### What's Changing?

Traditional serverless functions are evolving to include:
- **Edge-native runtimes** optimized for global distribution
- **Real-time collaboration** through WebRTC and CRDTs
- **Smart caching strategies** that adapt to usage patterns
- **Autoscaling** based on geographic demand

### Practical Applications

- Real-time collaborative editing (think Google Docs)
- Multiplayer gaming experiences
- Live streaming with minimal latency
- IoT data processing at the edge

## 3. WebAssembly (WASM) Goes Mainstream

WebAssembly is finally breaking out of its niche and becoming a first-class citizen in web development.

### Why WASM Matters

- **Near-native performance** for compute-intensive tasks
- **Language interoperability** - run Rust, Go, C++ in the browser
- **Portability** across different platforms
- **Security** through sandboxed execution

### Use Cases Expanding

\`\`\`rust
// Example: Rust code compiled to WASM for image processing
#[wasm_bindgen]
pub fn process_image(image_data: &[u8]) -> Vec<u8> {
    // Complex image processing logic
    // Runs at near-native speed in the browser
    processed_data
}
\`\`\`

## 4. The Component Architecture Revolution

Component-based development is evolving beyond simple UI components to encompass entire application architecture.

### Micro-Frontends Mature

The micro-frontend approach is becoming more sophisticated:
- **Independent deployments** for different teams
- **Shared design systems** with automatic updates
- **Runtime composition** of features
- **Gradual migration** strategies

### Design Systems as Code

Design systems are no longer just style guides but living, breathing codebases:
- **Version-controlled components**
- **Automated accessibility testing**
- **Performance budgets enforced automatically**
- **Cross-platform consistency**

## 5. Progressive Web Apps (PWAs) Evolution

PWAs are becoming indistinguishable from native applications, thanks to several key advancements.

### Enhanced Capabilities

- **Background sync** for seamless offline experiences
- **Push notifications** with rich media support
- **File system access** for better productivity apps
- **Advanced caching strategies** with stale-while-revalidate

### Performance Optimizations

\`\`\`javascript
// Example: Advanced service worker caching
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(response => {
        // Return cached version immediately
        if (response) return response;
        
        // Fetch in background and cache for future
        return fetch(event.request).then(fetchResponse => {
          const responseClone = fetchResponse.clone();
          caches.open('images').then(cache => {
            cache.put(event.request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  }
});
\`\`\`

## 6. The Rise of Web3 Integration

While still evolving, Web3 technologies are finding practical applications in mainstream web development.

### Practical Use Cases

- **Decentralized identity** for better user privacy
- **Content authenticity** verification
- **Micropayments** without traditional intermediaries
- **Digital ownership** certificates

## 7. Advanced State Management Patterns

As applications grow more complex, so do our approaches to state management.

### Beyond Redux

We're seeing new patterns emerge:
- **State machines** for predictable UI behavior
- **Reactive programming** with libraries like RxJS
- **Optimistic updates** with rollback capabilities
- **Local-first** architectures with sync capabilities

## 8. Performance-First Development

Performance is no longer an afterthought but a primary consideration from day one.

### Key Metrics and Tools

- **Core Web Vitals** optimization
- **Real User Monitoring (RUM)** integration
- **Bundle size budgets** enforced in CI/CD
- **Performance regression testing**

## Conclusion: What This Means for Developers

The future of web development is exciting and challenging. Success in this landscape requires:

1. **Continuous learning** - Stay updated with emerging trends
2. **Pragmatic adoption** - Not every trend needs immediate adoption
3. **Performance mindset** - Build with performance as a primary concern
4. **User-centric approach** - Technology serves user needs, not vice versa

As we move forward, the lines between different platforms continue to blur. The modern web developer is no longer just a "web" developer but a versatile engineer capable of building experiences across multiple platforms and paradigms.

The key is to embrace change while maintaining a solid foundation in the fundamentals. The tools and frameworks may evolve, but good engineering practices remain timeless.

---

*What trends are you most excited about? Share your thoughts in the comments below!*`,
    published: true,
    featured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    readTime: 8,
    views: 1250,
    likes: 45,
    category: { 
      name: 'Technology', 
      slug: 'technology', 
      color: 'blue',
      description: 'Latest in web technology and development trends'
    },
    author: { 
      id: '1',
      name: 'Sarah Chen', 
      avatar: '/avatars/sarah.jpg',
      bio: 'Full-stack developer with 10+ years of experience. Passionate about modern web technologies and writing about development trends.',
      email: 'sarah@example.com',
      twitter: '@sarahchen',
      github: 'sarahchen',
      website: 'sarahchen.dev'
    },
    tags: [
      { tag: { name: 'Web Development', slug: 'web-development' } },
      { tag: { name: 'Trends', slug: 'trends' } },
      { tag: { name: '2024', slug: '2024' } },
      { tag: { name: 'AI', slug: 'ai' } },
      { tag: { name: 'Performance', slug: 'performance' } }
    ],
    comments: [
      {
        id: '1',
        content: 'This is an incredibly comprehensive overview of the trends! I particularly appreciate the practical examples with code snippets. The section on AI-powered development tools really resonates with my experience using GitHub Copilot.',
        author: 'Michael Rodriguez',
        email: 'michael@example.com',
        createdAt: new Date(Date.now() - 3600000),
        approved: true,
        likes: 12,
        replies: [
          {
            id: '1-1',
            content: 'Totally agree! The code examples make it so much easier to understand these concepts.',
            author: 'Sarah Chen',
            createdAt: new Date(Date.now() - 1800000),
            approved: true,
            likes: 5
          }
        ]
      },
      {
        id: '2',
        content: 'Great article! I\'m curious about your thoughts on the practical challenges of implementing edge computing for small to medium-sized projects. Is it worth the complexity?',
        author: 'Emily Johnson',
        email: 'emily@example.com',
        createdAt: new Date(Date.now() - 7200000),
        approved: true,
        likes: 8
      },
      {
        id: '3',
        content: 'The WebAssembly section is particularly interesting. We\'ve been experimenting with Rust for our data visualization tools, and the performance gains are remarkable.',
        author: 'David Kim',
        email: 'david@example.com',
        createdAt: new Date(Date.now() - 10800000),
        approved: true,
        likes: 6
      }
    ],
    relatedPosts: [
      {
        id: '2',
        title: 'Building Scalable Applications with Microservices Architecture',
        slug: 'scalable-microservices-architecture',
        excerpt: 'Learn how to design and implement microservices...',
        createdAt: new Date('2024-01-14')
      },
      {
        id: '3',
        title: 'Mastering React Hooks: Advanced Patterns and Best Practices',
        slug: 'mastering-react-hooks',
        excerpt: 'Deep dive into React Hooks with advanced patterns...',
        createdAt: new Date('2024-01-13')
      }
    ]
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return (
    <div className="min-h-screen">
      {/* Article Header */}
      <article className="relative overflow-hidden">
        <div className={`h-96 bg-gradient-to-br from-${post.category.color}-400 to-${post.category.color}-600 relative`}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <Link 
                href="/" 
                className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to articles
              </Link>
              
              <div className="flex flex-wrap items-center gap-3 text-white/90 mb-4">
                <span className={`bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm`}>
                  {post.category.name}
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(post.createdAt, 'MMMM d, yyyy')}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </span>
                <span className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{post.views} views</span>
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{post.author.name}</p>
                    <p className="text-sm text-white/80">{post.author.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Actions */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <Bookmark className="w-5 h-5" />
                  <span className="text-sm font-medium">Save</span>
                </button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                  
                  {/* Share Dropdown */}
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="p-2">
                      <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100">
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">Twitter</span>
                      </a>
                      <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Facebook</span>
                      </a>
                      <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100">
                        <Linkedin className="w-4 h-4 text-blue-700" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                      <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100">
                        <Mail className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">Email</span>
                      </a>
                      <button 
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100 w-full"
                      >
                        <Link2 className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">Copy Link</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {post.tags.map((postTag) => (
                  <span key={postTag.tag.slug} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    #{postTag.tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none mb-12">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>
                } else if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>
                } else if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-5 mb-2">{paragraph.slice(4)}</h3>
                } else if (paragraph.startsWith('```')) {
                  return (
                    <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                      <code>{paragraph.slice(3)}</code>
                    </pre>
                  )
                } else if (paragraph.startsWith('-')) {
                  return <li key={index} className="ml-4 mb-2">{paragraph.slice(2)}</li>
                } else if (paragraph.trim()) {
                  return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
                }
                return null
              })}
            </div>

            {/* Author Bio */}
            <div className="bg-gray-50 rounded-xl p-8 mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">About the Author</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.author.name}</h4>
                  <p className="text-gray-600 mb-4">{post.author.bio}</p>
                  <div className="flex flex-wrap gap-3">
                    <a href={`mailto:${post.author.email}`} className="text-primary-600 hover:text-primary-700 text-sm">
                      {post.author.email}
                    </a>
                    <a href={`https://twitter.com/${post.author.twitter}`} className="text-primary-600 hover:text-primary-700 text-sm">
                      {post.author.twitter}
                    </a>
                    <a href={`https://github.com/${post.author.github}`} className="text-primary-600 hover:text-primary-700 text-sm">
                      {post.author.github}
                    </a>
                    <a href={`https://${post.author.website}`} className="text-primary-600 hover:text-primary-700 text-sm">
                      {post.author.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Comments ({post.comments.length})
                </h3>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Sort by: Newest
                </button>
              </div>

              {/* Comment Form */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Join the Discussion</h4>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      className="input"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      className="input"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="input"
                    required
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-600">Notify me of replies</span>
                    </label>
                    <button type="submit" className="btn btn-primary">
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {comment.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{comment.author}</h4>
                          <time className="text-xs text-gray-500">
                            {format(comment.createdAt, 'MMMM d, yyyy at h:mm a')}
                          </time>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{comment.likes}</span>
                        </button>
                        <button className="hover:text-primary-600 transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{comment.content}</p>
                    
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-12 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-medium text-sm">
                                  {reply.author.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 text-sm">{reply.author}</h5>
                                <time className="text-xs text-gray-500">
                                  {format(reply.createdAt, 'MMM d, h:mm a')}
                                </time>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Table of Contents */}
            <div className="sticky top-8 space-y-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  <a href="#ai-powered-development" className="block text-sm text-gray-600 hover:text-primary-600 py-1">
                    AI-Powered Development Tools
                  </a>
                  <a href="#edge-computing" className="block text-sm text-gray-600 hover:text-primary-600 py-1">
                    Edge Computing and Serverless 2.0
                  </a>
                  <a href="#webassembly" className="block text-sm text-gray-600 hover:text-primary-600 py-1">
                    WebAssembly Goes Mainstream
                  </a>
                  <a href="#component-architecture" className="block text-sm text-gray-600 hover:text-primary-600 py-1">
                    Component Architecture Revolution
                  </a>
                  <a href="#pwas-evolution" className="block text-sm text-gray-600 hover:text-primary-600 py-1">
                    PWAs Evolution
                  </a>
                  <a href="#web3-integration" className="block text-sm text-gray-600 hover:text-primary-600 py-1">
                    Web3 Integration
                  </a>
                  <a href="#state-management" className="block text-sm text-gray-600 hover:text-primary-600 py-1">
                    Advanced State Management
                  </a>
                  <a href="#performance-first" className="block text-sm text-gray-600 hover:text-primary-600 py-1">
                    Performance-First Development
                  </a>
                  <a href="#conclusion" className="block text-sm text-gray-600 hover:text-primary-600 py-1">
                    Conclusion
                  </a>
                </nav>
              </div>

              {/* Related Posts */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {post.relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/posts/${relatedPost.slug}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(relatedPost.createdAt, 'MMM d, yyyy')}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                <h3 className="font-bold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get the latest posts delivered to your inbox
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button type="submit" className="w-full btn btn-primary text-sm">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}