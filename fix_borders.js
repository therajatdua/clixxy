/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = [...walkSync('app'), ...walkSync('components')];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace thick borders
  content = content.replace(/border-r-2/g, 'border-r');
  content = content.replace(/border-l-2/g, 'border-l');
  content = content.replace(/border-t-2/g, 'border-t');
  content = content.replace(/border-b-2/g, 'border-b');
  content = content.replace(/divide-y-2/g, 'divide-y');

  // Change border colors to be classy (dark grey instead of light grey on dark background)
  content = content.replace(/border-\[#e5e5e5\]/g, 'border-[#2b2b2b]');
  content = content.replace(/divide-\[#e5e5e5\]/g, 'divide-[#2b2b2b]');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
