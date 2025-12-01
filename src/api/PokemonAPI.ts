import type {
  Pokemon,
  BoxEntry,
  InsertBoxEntry,
  UpdateBoxEntry,
} from '../types/types';

const BASE_URL = 'https://hw4.cis1962.esinx.net/api';

export class PokemonAPI {
  private static token: string | null =
    import.meta.env.VITE_API_TOKEN ?? null;

  static setToken(token: string) {
    this.token = token;
  }

private static async request<T>(
  path: string,
  options: RequestInit = {},
  authRequired = false,
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  // Force headers to be a simple string key/value map
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (authRequired) {
    if (!this.token) {
      throw new Error('Missing auth token. Please provide your JWT.');
    }
    headers['Authorization'] = `Bearer ${this.token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const body = await res.json();
      if (body.message) message = body.message;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}

  // ----------------------------------------------------------
  // Pokémon Endpoints
  // ----------------------------------------------------------

  // This API returns: Pokemon[]
  static getPokemonList(limit: number, offset: number) {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });

    return this.request<Pokemon[]>(`/pokemon/?${params.toString()}`);
  }

  static getPokemonByName(name: string) {
    return this.request<Pokemon>(`/pokemon/${encodeURIComponent(name)}`);
  }

  // ----------------------------------------------------------
  // Box Endpoints (requires JWT)
  // ----------------------------------------------------------

  static getBoxIds() {
    return this.request<string[]>(`/box/`, {}, true);
  }

  static getBoxEntry(id: string) {
    return this.request<BoxEntry>(`/box/${id}`, {}, true);
  }

  static createBoxEntry(data: InsertBoxEntry) {
    return this.request<BoxEntry>(
      `/box/`,
      { method: 'POST', body: JSON.stringify(data) },
      true,
    );
  }

  static updateBoxEntry(id: string, data: UpdateBoxEntry) {
    return this.request<BoxEntry>(
      `/box/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
      true,
    );
  }

  static deleteBoxEntry(id: string) {
    return this.request<void>(
      `/box/${id}`,
      { method: 'DELETE' },
      true,
    );
  }

  static clearAllBoxEntries() {
    return this.request<void>(
      `/box/`,
      { method: 'DELETE' },
      true,
    );
  }
}