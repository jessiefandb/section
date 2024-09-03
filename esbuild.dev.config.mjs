import path from 'path';
import { context } from 'esbuild';
import glob from 'glob';
import { promisify } from 'util';

// 将 glob 转换为返回 Promise 的函数
const globPromise = promisify(glob);

// 定义入口文件规则
const entryPoints = [
  'src/sections/**/index.js',
  'src/pages/**/index.js',
];

// 收集所有匹配的入口文件
const files = await globPromise(entryPoints.flat().join('|'));

// 生成输出文件名
const outputFiles = files.map(entry => {
  const dirName = path.basename(path.dirname(entry)); // 获取父目录名
  return {
    entry,
    output: `theme/assets/${dirName}-index.js`
  };
});

// 创建 esbuild 上下文
const ctx = await context({
  entryPoints: outputFiles.map(file => file.entry),
  outdir: 'theme/assets',
  platform: 'node',
  sourcemap: true,
  bundle: true,
});

// 监听文件变动
await ctx.watch();

console.log('正在监听文件变动...');
