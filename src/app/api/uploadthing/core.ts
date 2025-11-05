import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@clerk/nextjs/server';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = auth();
      if (!userId) throw new Error('Unauthorized');
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('file url', file.url);
      return { url: file.url };
    }),

  coverImageUploader: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = auth();
      if (!userId) throw new Error('Unauthorized');
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Cover image upload complete for userId:', metadata.userId);
      console.log('file url', file.url);
      return { url: file.url };
    }),

  avatarUploader: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = auth();
      if (!userId) throw new Error('Unauthorized');
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Avatar upload complete for userId:', metadata.userId);
      console.log('file url', file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;


