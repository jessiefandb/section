import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

// 定义规则
const rules = [
  {
    srcDir: 'src/layout',
    outDir: 'theme/assets',
    filePattern: 'index.js',
    outFileSuffix: '.min'
  },
  {
    srcDir: 'src/sections',
    outDir: 'theme/assets',
    filePattern: 'index.js',
    outFileSuffix: '.min'
  },
  {
    srcDir: 'src/views',
    outDir: 'theme/assets',
    filePattern: 'index.js',
    outFileSuffix: '.min'
  }
];

// 递归遍历目录，找到所有符合条件的文件
function findAllIndexFiles(dir, filePattern) {
  let files = []
  
  const items = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name)

    if (item.isDirectory()) {
      files = files.concat(findAllIndexFiles(fullPath, filePattern));
    } else if (item.isFile() && item.name === filePattern) {
      files.push(fullPath)
    }
  }
  
  return files
}

// 动态生成 entryPoints
function generateEntryPoints(rules) {
  const entryPoints = {}

  rules.forEach(({ srcDir, outDir, filePattern, outFileSuffix }) => {
    const indexFiles = findAllIndexFiles(srcDir, filePattern)
    
    indexFiles.forEach(filePath => {
      // 计算相对于 srcDir 的路径
      const relativePath = path.relative(srcDir, filePath);
      // 去掉文件名（index.js）并替换路径分隔符为 -
      const outFileName = relativePath
        .replace(path.sep + filePattern, '') // 去掉 index.js
        .replace(new RegExp(`\\${path.sep}`, 'g'), '-') + outFileSuffix // 替换路径分隔符为 -

      entryPoints[outFileName] = filePath
    });
  });

  return entryPoints
}

let ctx = await esbuild.context({
  entryPoints: generateEntryPoints(rules),
  outdir: 'theme/assets',
  platform: 'node',
  sourcemap: false,
  bundle: true
});

await ctx.watch();
console.log('watching...')