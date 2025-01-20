// use modules
const fs = require('node:fs');
const path = require('node:path'); 
const readline = require('readline'); 

// define file path
const filePath = path.join(__dirname, 'output.txt');

// create writable stream
const writeStream = fs.createWriteStream(filePath, {flags: 'a'});

// create an interface for reading input from the console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log('hi! type below anything you want, and i will write it in output.txt! type "exit" to quit');

// user input
rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
      console.log('thank you! bye!');
      rl.close();
    } else {
      writeStream.write(input + '\n', (err) => {
        if (err) {
          console.error('error writing to file:', err.message);
        }
      });
    }
});

// process termination
rl.on('SIGINT', () => {
    console.log('\ngoodbye! thank you for using the app!');
    rl.close();
});

// close
rl.on('close', () => {
    writeStream.end();
    process.exit(0);
});