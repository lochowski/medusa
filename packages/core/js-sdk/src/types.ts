export type Logger = {
  error: (...messages: string[]) => void
  warn: (...messages: string[]) => void
  info: (...messages: string[]) => void
  debug: (...messages: string[]) => void
}

export type Config = {
  baseUrl: string
  globalHeaders?: Record<string, string>
  publishableKey?: string
  apiKey?: string
  jwtToken?: {
    storageKey?: string
    // TODO: Add support for cookie storage
    storageMethod?: "local" | "session" | "memory"
  }
  logger?: Logger
  debug?: boolean
}

export type FetchParams = Parameters<typeof fetch>

export type ClientFetch = (
  input: FetchParams[0],
  init?: FetchParams[1] & { query?: Record<string, any> }
) => Promise<Response>
