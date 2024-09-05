const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const inputDirs = ['src/views', 'src/sections', 'src/layout'];

const getIndexScssFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getIndexScssFiles(filePath)); // 递归调用
    } else if (file === 'index.scss') {
      results.push(filePath);
    }
  });

  return results;
};

const watchSassFiles = () => {
  inputDirs.forEach(dir => {
    const indexFiles = getIndexScssFiles(dir);
    indexFiles.forEach(file => {
      const dirname = path.basename(path.dirname(file));
      const outputFile = `theme/assets/${dirname}.min.css`;

      // 使用 Sass 的 --watch 选项
      exec(`sass --watch ${file}:${outputFile} --style=compressed --no-source-map`, (error) => {
        if (error) {
          console.error(`Error watching ${file}: ${error.message}`);
        } else {
          console.log(`Watching ${file} for changes...`);
        }
      });
    });
  });
};

watchSassFiles();
