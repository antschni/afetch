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
