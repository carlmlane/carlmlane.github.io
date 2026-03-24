import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockInit = vi.fn();

vi.mock('posthog-js', () => ({
  default: { init: mockInit },
}));

const originalEnv = { ...process.env };

beforeEach(() => {
  mockInit.mockClear();
  vi.resetModules();
});

afterEach(() => {
  process.env = { ...originalEnv };
});

describe('instrumentation-client', () => {
  it('calls posthog.init in production with valid env vars', async () => {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test123';
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://i.carlmlane.com';

    await import('./instrumentation-client');

    expect(mockInit).toHaveBeenCalledOnce();
    expect(mockInit).toHaveBeenCalledWith(
      'phc_test123',
      expect.objectContaining({ api_host: 'https://i.carlmlane.com' }),
    );
  });

  it('config does not contain invalid "defaults" key', async () => {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test123';
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://i.carlmlane.com';

    await import('./instrumentation-client');

    const config = mockInit.mock.calls[0][1];
    expect(config).not.toHaveProperty('defaults');
  });

  it('config has cross_subdomain_cookie set to false', async () => {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test123';
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://i.carlmlane.com';

    await import('./instrumentation-client');

    const config = mockInit.mock.calls[0][1];
    expect(config.cross_subdomain_cookie).toBe(false);
  });

  it('does not call posthog.init when env vars are missing', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    delete process.env.NEXT_PUBLIC_POSTHOG_HOST;

    await import('./instrumentation-client');

    expect(mockInit).not.toHaveBeenCalled();
  });

  it('does not call posthog.init when host URL is invalid', async () => {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test123';
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'not-a-url';

    await import('./instrumentation-client');

    expect(mockInit).not.toHaveBeenCalled();
  });

  it('does not call posthog.init in non-production environments', async () => {
    process.env.NODE_ENV = 'development';
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test123';
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://i.carlmlane.com';

    await import('./instrumentation-client');

    expect(mockInit).not.toHaveBeenCalled();
  });

  it('logs warning when env vars are invalid', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.env.NODE_ENV = 'production';
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    delete process.env.NEXT_PUBLIC_POSTHOG_HOST;

    await import('./instrumentation-client');

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[PostHog]'), expect.any(Object));
    warnSpy.mockRestore();
  });
});
