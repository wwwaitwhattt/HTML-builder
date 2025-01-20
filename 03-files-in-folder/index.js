// use modules
const fs = require('node:fs/promises');
const path = require('node:path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true })
  .then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        fs.stat(filePath).then((stats) => {
          const { name, ext } = path.parse(file.name);
          console.log(`${name} - ${ext.slice(1)} - ${(stats.size / 1024).toFixed(3)}kb`);
        });
      }
    });
  })
.catch((err) => console.error('error:', err.message));