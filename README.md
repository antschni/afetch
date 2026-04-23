# afetch

Minimal axios-like http client for node.js and browser, built on top of the FetchAPI.

## Installing

Using npm:

```bash
npm install afetch
```

## Features

- Type-safe payloads with TypeScript generics
- Automatic JSON serializing and parsing
- Supports automatic XML serializing and parsing when configured with builder/parser functions. [See more](#xml-configuration)
- Works in any environment with Fetch API support
- Delivers HttpStatusCodes enum for better code readability

## Examples

```typescript
import afetch from 'afetch'

const client = afetch({
  baseUrl: 'https://example.com/',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

async function getUser() {
  try {
    const res = await client.get<User>('users/1')
    if (!res.ok) throw new Error('failed to get user')
    return res.payload
  } catch (error) {
    // ...
  }
}
```

### Configuration

```typescript
import afetch from 'afetch'

const client = afetch({
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  baseUrl: 'https://example.com/',
  timeout: 2000,
  credentials: 'same-origin',
})
```

### XML-Configuration

```typescript
import afetch from 'afetch'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

const { parse } = new XMLParser()
const { build } = new XMLBuilder()

const client = afetch({
  xml: {
    parse,
    build,
  },
})
```
