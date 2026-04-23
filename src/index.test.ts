import afetch from './index'

const client = afetch({
  baseUrl: new URL('https://httpbin.org/'),
  headers: new Headers({
    'content-type': 'application/json',
    accept: 'application/json',
  }),
})
