import assert from 'node:assert'
import { platform } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../../_testHelpers/index.js'
import { BASE_URL } from '../../../config.js'
import installNpmModules from '../../../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('@sparticuz/chrome-aws-lambda http api', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'app-http-api'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'app-http-api'),
    })
  })

  afterEach(() => teardown())

  it('@sparticuz/chrome-aws-lambda http api tests', async function it() {
    if (platform() !== 'darwin') {
      this.skip()
    }

    const url = new URL('/pdf', BASE_URL)

    const response = await fetch(url)

    assert.deepEqual(response.status, 200)

    const blob = await response.blob()

    assert.deepEqual(blob.type, 'application/pdf')
  })
})
