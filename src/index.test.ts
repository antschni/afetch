import afetch, { Client } from './index'
import { describe, it, expect, beforeEach } from 'vitest'

type Todo = {
  id: number
  title: string
  author: string
}

type PutTodoPayload = Omit<Todo, 'id' | 'title'>

describe('afetch JSON integration test', () => {
  let client: Client

  beforeEach(() => {
    client = afetch({
      baseUrl: new URL('https://my-json-server.typicode.com/antschni/afetch/todos/'),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  })

  it('should create a client', () => {
    expect(client).toBeInstanceOf(Client)
  })

  describe('GET Request', () => {
    it('should GET todo id=1 by id', async () => {
      const { status, payload } = await client.get<Todo>('1')
      expect(status).toBe(200)
      expect(payload.id).toBe(1)
      expect(payload.title).toBe('Hello')
    })

    it('should GET all todos', async () => {
      const { status, payload } = await client.get<Todo[]>('')
      expect(status).toBe(200)
      expect(payload.length).toBe(3)
      expect(payload[1].id).toBe(2)
      expect(payload[2].title).toBe('Ciao')
    })
  })

  describe('POST Request', () => {
    it('should POST todo with id=4', async () => {
      const todo: Todo = { id: 4, title: 'Test', author: 'Anton' }
      const { status, payload } = await client.post<Todo>('', todo)
      expect(status).toBe(201)
      expect(payload.id).toBe(4)
      expect(payload.title).toBe('Test')
    })
  })

  describe('PUT Request', () => {
    it('should PUT todo with id=3', async () => {
      const todo: Todo = { id: 3, title: 'Test', author: 'Anton' }
      const { status, payload } = await client.put<Todo>('3', todo)
      expect(status).toBe(200)
      expect(payload.id).toBe(3)
      expect(payload.title).toBe('Test')
    })
  })

  describe('PATCH Request', () => {
    it('should PATCH todo with id=2', async () => {
      const todo = { author: 'Anton' }
      const { status, payload } = await client.patch<Todo>('2', todo)
      expect(status).toBe(200)
      expect(payload.id).toBe(2)
      expect(payload.title).toBe('Test')

  describe('DELETE Request', () => {
    it('should DELETE todo with id=1', async () => {
      const { status, payload } = await client.delete('1')
      expect(status).oneOf([HttpStatusCode.OK, HttpStatusCode.NO_CONTENT])
      expect(payload).toStrictEqual({})
    })
  })
})
