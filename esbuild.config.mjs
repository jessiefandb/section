import * as esbuild from 'esbuild'

let ctx = await esbuild.context({
  entryPoints: [
    'src/sections/*.index.js'
  ],
  outdir: 'theme/assets',
  platform: 'node',
  sourcemap: true,
  bundle: true,
  filename: (path) => path.replace(/^src\/sections\/(.*)\.index\.js$/, '$1.min.js'),
})

await ctx.watch()
console.log('watching...')