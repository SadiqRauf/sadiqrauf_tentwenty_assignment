import { env } from '../../config/env';


type QueryParams = Record<string, string | number | undefined>;

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }

  get isRetryable(): boolean {
    return this.status === undefined || this.status >= 500;
  }
}

function buildQuery(params: QueryParams): string {
  const pairs = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
  return pairs.length ? `?${pairs.join('&')}` : '';
}

function authFor(params: QueryParams): {
  params: QueryParams;
  headers: Record<string, string>;
} {
  if (env.tmdbAccessToken) {
    return {
      params,
      headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
    };
  }
  return { params: { ...params, api_key: env.tmdbApiKey }, headers: {} };
}

export async function tmdbGet<T>(
  path: string,
  params: QueryParams = {},
  signal?: AbortSignal,
): Promise<T> {
  const auth = authFor(params);
  let response: Response;
  try {
    response = await fetch(`${env.tmdbBaseUrl}${path}${buildQuery(auth.params)}`, {
      headers: { Accept: 'application/json', ...auth.headers },
      signal,
    });
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }
    throw new ApiError('Check your connection and try again.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      body?.status_message ?? `Request failed (${response.status}).`,
      response.status,
    );
  }

  return (await response.json()) as T;
}
