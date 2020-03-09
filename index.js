const path = require('path')
const fs = require('fs')
const SDK = require('./lib/sdk')
const express = require('express')
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')

const server = express()

const render = async ({ url, width, height, fullPage }) => {
  const setWidth = width || 800 
  const setHeight = height || 600
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: setWidth,
    height: setHeight,
    deviceScaleFactor: 1,
  })
  await page.goto(url, { waitUntil: ['load', 'networkidle0'], timeout: 60000 })
  const filePath = path.join(__dirname, 'screenshots', `${new Date().getTime()}.png`)
  if(fullPage) {
    await page.addScriptTag({url: 'https://html2canvas.hertzen.com/dist/html2canvas.js'})
    await page.addScriptTag({url: 'https://cdn.jsdelivr.net/npm/canvas2image@1.0.5/canvas2image.min.js'})

    const screenshot = await page.evaluate(async () => {
      const canvasElement = await html2canvas(document.body)
   
      let image = Canvas2Image.convertToImage(
        canvasElement,
        canvasElement.width,
        canvasElement.height,
        'png'
       )
       return image.src
   })
   const data = screenshot.replace(/^data:image\/\w+;base64,/, '')
   const buf = Buffer.from(data, 'base64')
   fs.writeFileSync(filePath, buf)
  } 
  else {
    await page.screenshot({
      path: filePath
    })
  }
  const response = await SDK.UploadFile(filePath, SDK.DefaultUploadOptions)
  fs.unlinkSync(filePath)
  return response
}

const main = async () => {
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.get('/render', async (req, res) => {
    const data = await render({
      url: req.query.url,
      width: req.query.width,
      height: req.query.height,
      fullPage: req.query.fullPage
    })
    res.json(data)
  })

  server.get('/', (req, res) => {
    res.send('ok')
  })

  server.listen(8080, (err) => {
    if(err) {
      console.log(err)
      process.exit(1)
    }
    console.log('listening on port 8080')
  })
}

main()