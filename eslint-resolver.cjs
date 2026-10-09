// Resolver kecil untuk alias "@/" -> "src/" (dipakai eslint-plugin-boundaries).
// Impor paket npm sengaja tidak di-resolve: tidak relevan untuk aturan batas folder.
const path = require('node:path')
const fs = require('node:fs')

const exts = ['', '.js', '.jsx', '.json', '/index.js', '/index.jsx']

exports.interfaceVersion = 2
exports.resolve = (source, file) => {
  const base = source.startsWith('@/')
    ? path.resolve(__dirname, 'src', source.slice(2))
    : source.startsWith('.')
      ? path.resolve(path.dirname(file), source)
      : null
  if (!base) return { found: false }
  for (const e of exts) {
    const p = base + e
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return { found: true, path: p }
  }
  return { found: false }
}
