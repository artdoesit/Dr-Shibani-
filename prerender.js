import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runPrerender() {
  console.log('⚡ Pre-rendering static HTML for search engine crawlers...')

  // Build the SSR bundle temporarily
  await build({
    build: {
      ssr: 'src/entry-ssg.jsx',
      outDir: 'dist-ssr',
      emptyOutDir: true,
    }
  })

  const ssrBundlePath = path.resolve(__dirname, 'dist-ssr/entry-ssg.js')
  const { render } = await import(`file://${ssrBundlePath}`)

  const appHtml = render()

  const distIndexPath = path.resolve(__dirname, 'dist/index.html')
  let template = fs.readFileSync(distIndexPath, 'utf-8')

  // Inject pre-rendered static HTML into <div id="root">
  const html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  fs.writeFileSync(distIndexPath, html, 'utf-8')

  // Cleanup temporary SSR build folder
  fs.rmSync(path.resolve(__dirname, 'dist-ssr'), { recursive: true, force: true })

  console.log('✓ Pre-rendered static HTML successfully generated and injected into dist/index.html!')
}

runPrerender().catch((err) => {
  console.error('Error during prerendering:', err)
  process.exit(1)
})
