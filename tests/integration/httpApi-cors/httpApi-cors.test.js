// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../_testHelpers/index.js'
import { BASE_URL } from '../../config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('HttpApi Cors Tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  it('Fetch OPTIONS with valid origin', async () => {
    const url = new URL('/user', BASE_URL)
    const options = {
      headers: {
        'access-control-request-headers': 'authorization,content-type',
        'access-control-request-method': 'GET',
        origin: 'http://www.mytestapp.com',
      },
      method: 'OPTIONS',
    }

    const response = await fetch(url, options)

    assert.equal(response.status, 204)
    assert.equal(
      response.headers.get('access-control-allow-origin'),
      'http://www.mytestapp.com',
    )
    assert.equal(
      response.headers.get('access-control-allow-credentials'),
      'true',
    )
    assert.equal(response.headers.get('access-control-max-age'), '60')
    assert.equal(
      response.headers.get('access-control-expose-headers'),
      'status,origin',
    )
    assert.equal(
      response.headers.get('access-control-allow-methods'),
      'GET,POST',
    )
    assert.equal(
      response.headers.get('access-control-allow-headers'),
      'authorization,content-type',
    )
  })

  it('Fetch OPTIONS with invalid origin', async () => {
    const url = new URL('/user', BASE_URL)
    const options = {
      headers: {
        'access-control-request-headers': 'authorization,content-type',
        'access-control-request-method': 'GET',
        origin: 'http://www.wrongapp.com',
      },
      method: 'OPTIONS',
    }

    const response = await fetch(url, options)

    assert.equal(response.status, 204)
    assert.equal(response.headers.get('access-control-allow-origin'), null)
  })
})
