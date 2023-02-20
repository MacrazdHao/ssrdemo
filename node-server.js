const Koa = require('koa')
const app = new Koa()
const path = require('path')
const fs = require('fs')
const Router = require('koa-router')
const send = require('koa-send')
const router = new Router()
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('./dist/server/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/client/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: fs.readFileSync('./index.ssr.html', 'utf-8'),
  clientManifest
})

function renderToString (context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

router.get('(.*)', async (ctx, next) => {
  const url = ctx.path
  if (url.includes('.')) {
    return await send(ctx, url, { root: path.resolve(__dirname, './dist/client') })
  }
  const context = { url }
  ctx.res.setHeader('Content-Type', 'text/html')
  const html = await renderToString(context)
  ctx.body = html
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(8003, () => {
  console.log('ssr服务器启动成功')
})
