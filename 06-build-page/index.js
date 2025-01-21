const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');

fs.promises.mkdir(projectDist, { recursive: true }).then(async () => {

  const template = await fs.promises.readFile(templateFile, 'utf-8');
  const tags = template.match(/{{(.*?)}}/g) || [];

  let finalHtml = template;
  for (const tag of tags) {
    const componentName = tag.slice(2, -2).trim();
    const componentPath = path.join(componentsDir, `${componentName}.html`);
    try {
      const component = await fs.promises.readFile(componentPath, 'utf-8');
      finalHtml = finalHtml.replace(tag, component);
    } catch (e) {
      console.error(`component ${componentName} not found.`);
    }
  }

  await fs.promises.writeFile(path.join(projectDist, 'index.html'), finalHtml);

  const files = await fs.promises.readdir(stylesDir);
  const cssFiles = files.filter(file => path.extname(file) === '.css');
  const styleStream = fs.createWriteStream(path.join(projectDist, 'style.css'));

  for (const file of cssFiles) {
    const data = await fs.promises.readFile(path.join(stylesDir, file), 'utf-8');
    styleStream.write(data + '\n');
  }

  styleStream.end();

  async function copyDir(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true });
    const items = await fs.promises.readdir(src, { withFileTypes: true });
    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);
      if (item.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  }

  await copyDir(assetsDir, path.join(projectDist, 'assets'));
  console.log('build complete!');
}).catch(console.error);
