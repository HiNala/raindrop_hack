export const flags = {
  settings: process.env.NEXT_PUBLIC_FF_SETTINGS === 'true',
  hn: process.env.NEXT_PUBLIC_FF_HN === 'true',
  schedule: process.env.NEXT_PUBLIC_FF_SCHEDULE === 'true',
  analytics: process.env.NEXT_PUBLIC_FF_ANALYTICS === 'true',
}