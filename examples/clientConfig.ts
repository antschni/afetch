import afetch from 'afetch'

const client = afetch({
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  baseUrl: 'https://example.com/',
  timeout: 2000,
  credentials: 'same-origin',
})
