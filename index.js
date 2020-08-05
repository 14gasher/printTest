const url = require('url')
const http = require('https') // Use https for both http and https
const printer = require('printer')

// Function for getting a file buffer from an http request
const fetchFile = fileUrl => new Promise(resolve => {
  http.get(url.parse(fileUrl), res => {
    const data = []
    res
      .on('data', chunk => data.push(chunk))
      .on('end', () => resolve(Buffer.concat(data))) // Combine buffer chunks to one buffer
  })
})

// Function for printing a file from a buffer (Promise based)
const printFileBuffer = (fileBuffer, printerName, filename) => new Promise((resolve, reject) => printer.printDirect({
  type: 'PDF',
  data: fileBuffer,
  filename,
  printer: printerName,
  success: resolve,
  error: reject,
}))

const printFileFromURL = async fileUrl => {
  const fileBuffer = await fetchFile(fileUrl)
  const printId = await printFileBuffer(fileBuffer)
  return printId
}

const main = async () => {
  const fileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  await printFileFromURL(fileUrl, 'HP_DeskJet_2600_series', 'test.pdf')
}

main()
  .then(() => process.exit())
