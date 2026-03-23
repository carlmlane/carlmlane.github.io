import posthog from 'posthog-js';
import { z } from 'zod';

const posthogEnvSchema = z.object({
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
});

if (process.env.NODE_ENV === 'production') {
  const result = posthogEnvSchema.safeParse({
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });

  if (result.success) {
    posthog.init(result.data.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: result.data.NEXT_PUBLIC_POSTHOG_HOST,
      cross_subdomain_cookie: false,
      defaults: '2026-01-30',
    });
  } else {
    console.warn('[PostHog] Invalid environment variables:', result.error.flatten().fieldErrors);
  }
}
