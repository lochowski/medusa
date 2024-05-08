import qs from "qs"
import { ClientFetch, Config, FetchParams, Logger } from "./types"

const isBrowser = () => typeof window !== "undefined"

const toBase64 = (str: string) => {
  if (typeof window !== "undefined") {
    return window.btoa(str)
  }

  return Buffer.from(str).toString("base64")
}

const sanitizeHeaders = (headers: any) => {
  return { ...headers, Authorization: "<REDACTED>" }
}

// TODO: Add support for retries and timeouts
export class Client {
  public fetch: ClientFetch
  private logger: Logger

  private DEFAULT_JWT_STORAGE_KEY = "medusa_auth_token"
  private token = ""

  constructor(config: Config) {
    const logger = config.logger || {
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
    }

    this.logger = {
      ...logger,
      debug: config.debug ? logger.debug : () => {},
    }

    this.fetch = this.initClient(config)
  }

  protected initClient(config: Config): ClientFetch {
    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...this.getApiKeyHeader(config),
      ...this.getPublishableKeyHeader(config),
      ...config.globalHeaders,
    }

    this.logger.debug(
      "Initiating Medusa client with default headers:\n",
      `${JSON.stringify(sanitizeHeaders(defaultHeaders), null, 2)}\n`
    )

    return (
      input: FetchParams[0],
      init?: FetchParams[1] & { query?: Record<string, any> }
    ) => {
      // We always want to fetch the up-to-date JWT token before firing off a request.
      const jwtToken = this.getJwtTokenHeader(config)

      const headers = init?.headers
        ? { ...defaultHeaders, ...jwtToken, ...init.headers }
        : { ...defaultHeaders, ...jwtToken }

      let normalizedInput: RequestInfo | URL = input
      if (input instanceof URL || typeof input === "string") {
        normalizedInput = new URL(input, config.baseUrl)
        if (init?.query) {
          const existing = qs.parse(normalizedInput.search)
          const stringifiedQuery = qs.stringify({ existing, ...init.query })
          normalizedInput.search = stringifiedQuery
        }
      }

      this.logger.debug(
        "Performing request to:\n",
        `URL: ${normalizedInput.toString()}\n`,
        `Headers: ${JSON.stringify(sanitizeHeaders(headers), null, 2)}\n`
      )

      // TODO: Make response a bit more user friendly (throw errors, return JSON if resp content type is json, etc.)
      return fetch(normalizedInput, { ...init, headers }).then((resp) => {
        this.logger.debug(`Received response with status ${resp.status}\n`)
        return resp
      })
    }
  }

  protected getApiKeyHeader = (
    config: Config
  ): { Authorization: string } | {} => {
    return config.apiKey
      ? { Authorization: "Basic " + toBase64(config.apiKey + ":") }
      : {}
  }

  protected getPublishableKeyHeader = (
    config: Config
  ): { "x-medusa-pub-key": string } | {} => {
    return config.publishableKey
      ? { "x-medusa-pub-key": config.publishableKey }
      : {}
  }

  protected getJwtTokenHeader = (
    config: Config
  ): { Authorization: string } | {} => {
    const storageMethod =
      config.jwtToken?.storageMethod || (isBrowser() ? "local" : "memory")
    const storageKey =
      config.jwtToken?.storageKey || this.DEFAULT_JWT_STORAGE_KEY

    switch (storageMethod) {
      case "local": {
        if (!isBrowser()) {
          throw new Error("Local JWT storage is only available in the browser")
        }
        const token = window.localStorage.getItem(storageKey)
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
      case "session": {
        if (!isBrowser()) {
          throw new Error(
            "Session JWT storage is only available in the browser"
          )
        }
        const token = window.sessionStorage.getItem(storageKey)
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
      case "memory": {
        return this.token ? { Authorization: `Bearer ${this.token}` } : {}
      }
    }
  }
}
