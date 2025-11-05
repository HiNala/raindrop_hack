import { notFound } from 'next/navigation'
import PostPage from '@/components/post/PostPage'
import { getPostByPreviewToken } from '@/lib/actions/preview-actions'

interface PreviewPageProps {
  params: {
    token: string
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  try {
    const post = await getPostByPreviewToken(params.token)
    
    if (!post) {
      notFound()
    }

    // Mark this as a preview mode
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              🔒 This is a preview link. Do not share publicly.
            </p>
          </div>
        </div>
        <PostPage post={post} isPreview={true} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}