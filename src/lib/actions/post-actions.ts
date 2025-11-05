'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function setPostHNPreference(postId: string, enabled: boolean) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Verify post ownership
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      author: {
        clerkId: userId,
      },
    },
  })

  if (!post) {
    throw new Error('Post not found or unauthorized')
  }

  // Update the post
  await prisma.post.update({
    where: { id: postId },
    data: { hnEnabled: enabled },
  })

  // Revalidate the post page
  revalidatePath(`/editor/${postId}`)
  revalidatePath(`/posts/${post.slug}`)
}
