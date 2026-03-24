import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockInit = vi.fn();

vi.mock('posthog-js', () => ({
  default: { init: mockInit },
}));

beforeEach(() => {
  mockInit.mockClear();
  vi.resetModules();
  vi.unstubAllEnvs();
});

describe('instrumentation-client', () => {
  it('calls posthog.init in production with valid env vars', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test123');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'https://i.carlmlane.com');

    await import('./instrumentation-client');

    expect(mockInit).toHaveBeenCalledOnce();
    expect(mockInit).toHaveBeenCalledWith(
      'phc_test123',
      expect.objectContaining({ api_host: 'https://i.carlmlane.com' }),
    );
  });

  it('config does not contain invalid "defaults" key', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test123');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'https://i.carlmlane.com');

    await import('./instrumentation-client');

    const config = mockInit.mock.calls[0][1];
    expect(config).not.toHaveProperty('defaults');
  });

  it('config has cross_subdomain_cookie set to false', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test123');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'https://i.carlmlane.com');

    await import('./instrumentation-client');

    const config = mockInit.mock.calls[0][1];
    expect(config.cross_subdomain_cookie).toBe(false);
  });

  it('does not call posthog.init when env vars are missing', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', '');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', '');

    await import('./instrumentation-client');

    expect(mockInit).not.toHaveBeenCalled();
  });

  it('does not call posthog.init when host URL is invalid', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test123');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'not-a-url');

    await import('./instrumentation-client');

    expect(mockInit).not.toHaveBeenCalled();
  });

  it('does not call posthog.init in non-production environments', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test123');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'https://i.carlmlane.com');

    await import('./instrumentation-client');

    expect(mockInit).not.toHaveBeenCalled();
  });

  it('logs warning when env vars are invalid', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', '');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', '');

    await import('./instrumentation-client');

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[PostHog]'), expect.any(Object));
    warnSpy.mockRestore();
  });
});
