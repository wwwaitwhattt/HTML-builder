const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFilePath = path.join(outputDir, 'bundle.css');

const isCssFile = file => path.extname(file) === '.css';

async function mergeStyles() {
  try {
    await fsPromises.mkdir(outputDir, { recursive: true });

    const files = await fsPromises.readdir(stylesDir);
    const cssFiles = files.filter(isCssFile);

    const writeStream = fs.createWriteStream(outputFilePath);

    for (const file of cssFiles) {
      const filePath = path.join(stylesDir, file);
      const data = await fsPromises.readFile(filePath, 'utf8');
      writeStream.write(data + '\n');
    }

    writeStream.end();
    console.log('bundle.css has been successfully created.');
  } catch (err) {
    console.error('Error:', err);
  }
}

mergeStyles();
