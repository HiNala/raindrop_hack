'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const schedulePostSchema = z.object({
  postId: z.string(),
  publishAtISO: z.string(),
  timezone: z.string(),
})

export async function schedulePost(data: {
  postId: string
  publishAtISO: string
  timezone: string
}) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const validatedData = schedulePostSchema.parse(data)

  // Verify post ownership
  const post = await prisma.post.findFirst({
    where: {
      id: validatedData.postId,
      author: {
        clerkId: userId,
      },
    },
  })

  if (!post) {
    throw new Error('Post not found or unauthorized')
  }

  // Create or update schedule
  const schedule = await prisma.schedule.upsert({
    where: { postId: validatedData.postId },
    create: {
      postId: validatedData.postId,
      publishAt: new Date(validatedData.publishAtISO),
      timezone: validatedData.timezone,
    },
    update: {
      publishAt: new Date(validatedData.publishAtISO),
      timezone: validatedData.timezone,
      status: 'SCHEDULED',
    },
  })

  // Ensure post is not published
  await prisma.post.update({
    where: { id: validatedData.postId },
    data: { published: false },
  })

  revalidatePath(`/editor/${validatedData.postId}`)
  return schedule
}

export async function unschedulePost(postId: string) {
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

  // Delete schedule
  await prisma.schedule.delete({
    where: { postId },
  })

  revalidatePath(`/editor/${postId}`)
}

export async function publishScheduledPosts() {
  const now = new Date()
  
  // Find all posts that should be published
  const schedulesToPublish = await prisma.schedule.findMany({
    where: {
      publishAt: {
        lte: now,
      },
      status: 'SCHEDULED',
    },
    include: {
      post: true,
    },
  })

  // Publish each post
  for (const schedule of schedulesToPublish) {
    await prisma.post.update({
      where: { id: schedule.postId },
      data: {
        published: true,
        publishedAt: now,
      },
    })

    // Update schedule status
    await prisma.schedule.update({
      where: { id: schedule.id },
      data: { status: 'PUBLISHED' },
    })

    console.log(`Published scheduled post: ${schedule.post.title}`)
  }

  return { published: schedulesToPublish.length }
}