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

  // Colors
  content = content.replace(/#0d0d0c/g, '#111111');
  content = content.replace(/#f4f2e9/g, '#e5e5e5');
  content = content.replace(/#ff6b4a/g, '#ffffff'); // Accent orange -> white
  content = content.replace(/#52ff7a/g, '#e5e5e5'); // Green -> light grey
  content = content.replace(/#e55a3b/g, '#e5e5e5'); // Hover orange -> light grey
  content = content.replace(/#1a1a19/g, '#1c1c1c'); // dark grey -> darker grey
  content = content.replace(/#ff4a4a/g, '#ef4444'); // red

  // Brutalist shapes
  content = content.replace(/border-dashed/g, 'border-solid');
  content = content.replace(/border-2/g, 'border');
  content = content.replace(/shadow-\[[^\]]+\]/g, 'shadow-md');
  
  // Typography
  content = content.replace(/font-black/g, 'font-medium');
  content = content.replace(/transform\s+-skew-y-2/g, ''); // remove skew

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
