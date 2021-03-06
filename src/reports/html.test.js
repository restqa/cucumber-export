const os = require('os')
const fs = require('fs-extra')
const path = require('path')

const FOLDER = path.resolve(os.tmpdir(), 'report')
const HTML_TEMPLATE_FOLDER = path.resolve(__dirname, '..', '..', 'html-report-template', 'dist')

beforeEach(() => {
  jest.resetModules()
  if (fs.existsSync(FOLDER)) {
    fs.remove(FOLDER)
  }
})

describe('#Channel - html', () => {

  test('Copy files from html-report/dist and add the result files', async () => {
    const Html = require('./html')
    const config = {
      folder: FOLDER
    }
    const result = {
      "foo": "bar"
    }

    await expect(Html(config, result)).resolves.toEqual(`[HTML REPORT][SUCCESS] - Your report has been generated at file://${FOLDER}/index.html`)

    fs.readdirSync(HTML_TEMPLATE_FOLDER).forEach( item => {
      let expectedFilename = fs.existsSync(path.resolve(FOLDER, item)) 
      let err = undefined
      if (!expectedFilename) {
        throw new Error(`The file ${item} hasn't been copied into ${FOLDER}`)
      }
    })

    expect(fs.existsSync(FOLDER)).toBe(true)
    const fileResult = path.resolve(FOLDER, 'restqa-result.js')
    expect(fs.existsSync(fileResult)).toBe(true)
    const expectedFileResult = `
window.RESTQA_RESULT = {
  "foo": "bar"
}`
    expect(fs.readFileSync(fileResult).toString('utf-8')).toEqual(expectedFileResult.trim())
  })

  test('Throw error if got any issue', () => {
    const Html = require('./html')
    const config = {
      folder: () => {}
    }
    const result = {
      "foo": "bar"
    }

    expect(Html(config, result)).rejects.toEqual(new Error(`[HTML REPORT][ERROR] - () => {} : The "path" argument must be of type string or an instance of Buffer or URL. Received function folder`))
  })
})
