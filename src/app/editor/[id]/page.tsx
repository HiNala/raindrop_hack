import { EnhancedEditor } from '@/components/editor/EnhancedEditor'

export default function EditorPage({ params }: { params: { id?: string } }) {
  return <EnhancedEditor postId={params.id} />
}
