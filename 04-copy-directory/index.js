const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

function copyDirectory(source, destination, callback) {
    fs.mkdir(destination, { recursive: true }, (err) => {
        if (err) return callback(err);

        fs.readdir(source, { withFileTypes: true }, (err, items) => {
            if (err) return callback(err);

            let pending = items.length;
            if (!pending) return callback();

            items.forEach((item) => {
                const sourcePath = path.join(source, item.name);
                const destPath = path.join(destination, item.name);

                if (item.isDirectory()) {
                    copyDirectory(sourcePath, destPath, (err) => {
                        if (err) return callback(err);
                        if (!--pending) callback();
                    });
                } else {
                    fs.copyFile(sourcePath, destPath, (err) => {
                        if (err) return callback(err);
                        if (!--pending) callback();
                    });
                }
            });
        });
    });
}

fs.rm(destDir, { recursive: true, force: true }, (err) => {
    if (err && err.code !== 'ENOENT') return console.error('Error removing directory:', err);
    copyDirectory(sourceDir, destDir, (err) => {
        if (err) return console.error('Error copying directory:', err);
        console.log('Directory copied successfully.');
    });
});