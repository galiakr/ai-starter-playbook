import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      // PLANTED ISSUE 1: only src/utils is included. src/components and
      // src/hooks have real logic and are silently excluded from the
      // measured tree — coverage will read high, or even 100%, while most
      // of the project is never touched by the reported percentage.
      include: ['src/utils/**'],
      reporter: ['text', 'html'],
    },
  },
})
