const fs = require('fs');
const path = require('path');

// Set the directory containing your React project's  .tsx files
const appDir = './app';

// Set the output file name and path
const outputFile = 'project_code.txt';
const outputPath = './';

// Function to read all files recursively from a given directory
function readFiles(dir) {
  const files = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      // Recursively read files in subdirectories
      files.push(...readFiles(filePath));
    } else if (path.extname(file) === '.tsx') {
      // Read the contents of each .tsx file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let outputLine = `**${file}**`;
      for (const line of fileContent.split('\n')) {
        outputLine += `\n${line}`;
      }
      files.push(outputLine);
    }
  });
  return files;
}

// Read all .tsx files and write their contents to the output file
const projectCode = readFiles(appDir).join('\n');
fs.writeFileSync(outputPath + outputFile, projectCode, { encoding: 'utf8' });
