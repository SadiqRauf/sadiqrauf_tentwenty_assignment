const mockEnv = {
  tmdbAccessToken: 'test-token',
  tmdbApiKey: '',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
};

jest.mock('../src/config/env', () => ({
  get env() {
    return mockEnv;
  },
}));

import { ApiError, tmdbGet } from '../src/services/tmdb/client';
import { tmdbImageUrl } from '../src/services/tmdb/images';

const mockFetch = jest.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

const jsonResponse = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});

afterEach(() => {
  mockFetch.mockReset();
  mockEnv.tmdbAccessToken = 'test-token';
  mockEnv.tmdbApiKey = '';
});

describe('tmdbGet', () => {
  it('builds the URL from defined params and sends the bearer token', async () => {
    mockFetch.mockResolvedValue(jsonResponse(200, { ok: true }));

    await tmdbGet('/movie/upcoming', {
      page: 2,
      language: 'en US',
      region: undefined,
    });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(
      'https://api.themoviedb.org/3/movie/upcoming?page=2&language=en%20US',
    );
    expect(init.headers.Authorization).toBe('Bearer test-token');
  });

  it('falls back to the api_key query param when no token is set', async () => {
    mockEnv.tmdbAccessToken = '';
    mockEnv.tmdbApiKey = 'v3-key';
    mockFetch.mockResolvedValue(jsonResponse(200, {}));

    await tmdbGet('/movie/upcoming', { page: 1 });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(
      'https://api.themoviedb.org/3/movie/upcoming?page=1&api_key=v3-key',
    );
    expect(init.headers.Authorization).toBeUndefined();
  });

  it('prefers the token when both credentials are set', async () => {
    mockEnv.tmdbApiKey = 'v3-key';
    mockFetch.mockResolvedValue(jsonResponse(200, {}));

    await tmdbGet('/movie/upcoming');

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).not.toContain('api_key');
    expect(init.headers.Authorization).toBe('Bearer test-token');
  });

  it('surfaces the TMDB status message on HTTP errors', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(401, { status_message: 'Invalid API key' }),
    );

    await expect(tmdbGet('/movie/upcoming')).rejects.toMatchObject({
      message: 'Invalid API key',
      status: 401,
      isRetryable: false,
    });
  });

  it('maps network failures to a retryable ApiError', async () => {
    mockFetch.mockRejectedValue(new TypeError('Network request failed'));

    const error: unknown = await tmdbGet('/movie/upcoming').catch(e => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).isRetryable).toBe(true);
  });

  it('rethrows cancellations untouched', async () => {
    const controller = new AbortController();
    const abortError = new Error('Aborted');
    controller.abort();
    mockFetch.mockRejectedValue(abortError);

    await expect(
      tmdbGet('/movie/upcoming', {}, controller.signal),
    ).rejects.toBe(abortError);
  });
});

describe('tmdbImageUrl', () => {
  it('joins size and path', () => {
    expect(tmdbImageUrl('/abc.jpg', 'w780')).toBe(
      'https://image.tmdb.org/t/p/w780/abc.jpg',
    );
  });

  it('returns undefined when TMDB has no image', () => {
    expect(tmdbImageUrl(null, 'w780')).toBeUndefined();
  });
});
