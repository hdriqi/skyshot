const path = require('path')
const fs = require('fs')
const SDK = require('./lib/sdk')
const express = require('express')
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')
const next = require('next')

const app = next({
  dev: true
})
const handle = app.getRequestHandler()

const server = express()

const render = async ({ url, width, height, fullPage }) => {
  const setWidth = parseInt(width) || 800 
  const setHeight = parseInt(height) || 600
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setBypassCSP(true)
  await page.setViewport({
    width: setWidth,
    height: setHeight,
    deviceScaleFactor: 1,
  })
  await page.goto(url, { waitUntil: ['load', 'networkidle0'], timeout: 60000 })
  const filePath = path.join(__dirname, 'screenshots', `${new Date().getTime()}.png`)
  await page.screenshot({
    path: filePath,
    fullPage: fullPage
  })
  const response = await SDK.UploadFile(filePath, SDK.DefaultUploadOptions)
  fs.unlinkSync(filePath)
  browser.close()

  return response
}

const main = async () => {
  await app.prepare()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.post('/render', async (req, res) => {
    const data = await render({
      url: req.body.url,
      width: req.body.width,
      height: req.body.height,
      fullPage: req.body.fullPage
    })
    res.json({
      success: 1,
      data: data
    })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
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