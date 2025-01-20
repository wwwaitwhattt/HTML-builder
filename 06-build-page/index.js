const fs = require('fs');
const path = require('path');

const projectDistDir = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputHtmlPath = path.join(projectDistDir, 'index.html');
const outputCssPath = path.join(projectDistDir, 'style.css');
const outputAssetsDir = path.join(projectDistDir, 'assets');

fs.mkdirSync(projectDistDir, { recursive: true });

fs.readFile(templatePath, 'utf-8', (err, templateData) => {
  if (err) throw err;

  const regex = /{{(.*?)}}/g;
  let updatedTemplate = templateData;

  let match;
  while ((match = regex.exec(templateData)) !== null) {
    const tag = match[1].trim();
    const componentPath = path.join(componentsDir, `${tag}.html`);

    try {
      const componentData = fs.readFileSync(componentPath, 'utf-8');
      updatedTemplate = updatedTemplate.replace(match[0], componentData);
    } catch (err) {
      console.error(`error reading component for tag: {{${tag}}}`, err);
    }
  }

  fs.writeFileSync(outputHtmlPath, updatedTemplate);
  console.log('index.html created');
});

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;

  const cssFiles = files.filter(file => path.extname(file) === '.css');
  let cssContent = '';

  cssFiles.forEach(file => {
    const filePath = path.join(stylesDir, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    cssContent += data + '\n';
  });

  fs.writeFileSync(outputCssPath, cssContent);
  console.log('style.css created');
});

function copyAssets(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdir(src, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      fs.stat(srcPath, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          copyAssets(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    });
  });
}

copyAssets(assetsDir, outputAssetsDir);
console.log('assets copied');
