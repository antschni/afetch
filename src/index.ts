export type ClientConfig = {
  headers?: HeadersInit
  baseUrl?: URL
  timeout?: number
  credentials?: RequestCredentials
  xml?: {
    parse?: (xml: string) => any
    build?: (obj: any) => string
  }
}

export interface Result<T> extends Response {
  payload: T
}

export const XMLBuilderError = new Error('cannot build xml: build function in client config is required and not set')
export const XMLParserError = new Error('cannot parse xml: parse function in client config is required and not set')

const contentTypeJSON = 'application/json' as const
const contentTypeXML = 'application/xml' as const

export class Client {
  private config?: ClientConfig

  constructor(config?: ClientConfig) {
    this.config = config
  }

  // buildURI builds the URI for the request and appends the baseUrl if set
  private buildURI(url: string) {
    return this.config?.baseUrl ? encodeURI(this.config.baseUrl.href + url) : url
  }

  // buildRequestInit builds the RequestInit object, merging the default config with the provided one
  private buildRequestInit(r?: RequestInit): RequestInit {
    const defaultHeaders = this.config?.headers ?? {}
    const requestHeaders = r?.headers ?? {}

    return {
      headers: { ...defaultHeaders, ...requestHeaders },
      credentials: this.config?.credentials ?? 'omit',
      ...r,
    }
  }

  private static parseContentType(contentType: string | null | undefined) {
    return contentType?.toLowerCase() ?? ''
  }

  private getContentType(headers?: HeadersInit) {
    let h: Headers | undefined
    if (headers) {
      h = new Headers(headers)
    } else if (this.config?.headers) {
      h = new Headers(this.config.headers)
    }

    return Client.parseContentType(h?.get('Content-Type') ?? contentTypeJSON)
  }

  private stringifyPayload<T>(payload: T, contentType: string) {
    if (contentType?.includes(contentTypeJSON)) {
      return JSON.stringify(payload)
    }
    if (contentType?.includes(contentTypeXML)) {
      if (!this.config?.xml?.build) {
        throw XMLBuilderError
      }
      return this.config.xml.build(payload)
    }
    return (payload as string) ?? ''
  }

  private async parsePayload<T>(res: Response, contentType: string) {
    if (contentType?.includes(contentTypeJSON)) {
      return res.json() as T
    }
    if (contentType?.includes(contentTypeXML)) {
      if (!this.config?.xml?.parse) {
        throw XMLParserError
      }
      return this.config.xml.parse(await res.text()) as T
    }
    return res.body as T
  }

  private static buildResult<T>(res: Response, payload: T): Result<T> {
    return Object.assign(res, { payload })
  }

  setConfig(configBuilder: (current?: ClientConfig) => ClientConfig) {
    this.config = configBuilder(this.config ?? {})
  }

  // get makes a GET request to the provided url and returns a result containing the payload as T and the response.
  async get<T>(url: string, r?: RequestInit) {
    const res = await fetch(this.buildURI(url), {
      ...this.buildRequestInit(r),
      method: 'GET',
    })

    if (!res.ok) throw new Error(await res.text())

    const payload = await this.parsePayload<T>(res, this.getContentType(res.headers))
    return Client.buildResult(res, payload)
  }

  async post<T>(url: string, payload: T, r?: RequestInit) {
    const res = await fetch(this.buildURI(url), {
      ...this.buildRequestInit(r),
      method: 'POST',
      body: this.stringifyPayload(payload, this.getContentType(r?.headers)),
    })

    if (!res.ok) throw new Error(await res.text())

    const resPayload = await this.parsePayload<T>(res, this.getContentType(res.headers))
    return Client.buildResult(res, resPayload)
  }

  async put<T>(url: string, payload: T, r?: RequestInit) {
    const res = await fetch(this.buildURI(url), {
      ...this.buildRequestInit(r),
      method: 'PUT',
      body: this.stringifyPayload(payload, this.getContentType(r?.headers)),
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    const resPayload = await this.parsePayload<T>(res, this.getContentType(res.headers))
    return Client.buildResult(res, resPayload)
  }

  async patch<T>(url: string, payload: T, r?: RequestInit) {
    const res = await fetch(this.buildURI(url), {
      ...this.buildRequestInit(r),
      method: 'PATCH',
      body: this.stringifyPayload(payload, this.getContentType(r?.headers)),
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    const resPayload = await this.parsePayload<T>(res, this.getContentType(res.headers))
    return Client.buildResult(res, resPayload)
  }

  async delete(url: string, r?: RequestInit) {
    const res = await fetch(this.buildURI(url), {
      ...this.buildRequestInit(r),
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    return res
  }
}

export default function afetch(config?: ClientConfig) {
  return new Client(config)
}
