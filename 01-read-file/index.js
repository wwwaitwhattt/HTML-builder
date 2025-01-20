// use modules
const path = require('node:path');
const fs = require('node:fs');

// define file path
const filePath = path.join(__dirname, 'text.txt');

// create readable stream
const readStream = fs.createReadStream(filePath);

// output
readStream.pipe(process.stdout);

// handle errors
readStream.on('error', (err) => {
    console.error('An error occurred:', err);
});