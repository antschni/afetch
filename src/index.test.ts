import afetch, { Client } from './index'
import { describe, it, expect, beforeEach } from 'vitest'

type Todo = {
  id: number
  title: string
  author: string
}

describe('afetch JSON integration test', () => {
  let client: Client

  beforeEach(() => {
    client = afetch({
      baseUrl: new URL('https://my-json-server.typicode.com/antschni/afetch/todos'),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  })

  it('should create a client', () => {
    expect(client).toBeInstanceOf(Client)
  })

  it('should GET post id=1 by id', async () => {
    const { status, payload } = await client.get<Todo>('1')
    expect(status).toBe(200)
    expect(payload.id).toBe(1)
    expect(payload.title).toBe('Hello')
  })

  it('should GET all posts', async () => {
    const { status, payload } = await client.get<Todo[]>('')
    expect(status).toBe(200)
    expect(payload.length).toBe(2)
  })
})
