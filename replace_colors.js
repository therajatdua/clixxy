/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  if (!fs.existsSync(dir)) return filelist;
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

  // Backgrounds
  content = content.replace(/bg-\[#111111\]/g, 'bg-bg');
  content = content.replace(/bg-\[#1c1c1c\]/g, 'bg-surface-hover');
  content = content.replace(/bg-\[#1a1a19\]/g, 'bg-surface-hover');
  content = content.replace(/bg-\[#0d0d0c\]/g, 'bg-bg');
  content = content.replace(/bg-\[#e5e5e5\]/g, 'bg-surface dark:bg-surface-hover');
  content = content.replace(/bg-\[#ffffff\]/g, 'bg-surface');

  // Text
  content = content.replace(/text-\[#111111\]/g, 'text-text-primary'); // e.g., on hover buttons etc. Might need to be bg-bg sometimes, but text-text-primary is safe
  content = content.replace(/text-\[#e5e5e5\]/g, 'text-text-primary');
  content = content.replace(/text-\[#f4f2e9\]/g, 'text-text-primary');
  content = content.replace(/text-white/g, 'text-text-primary');
  content = content.replace(/text-\[#a3a3a3\]/g, 'text-text-secondary');
  content = content.replace(/text-\[#737373\]/g, 'text-text-muted');
  
  // Borders
  content = content.replace(/border-\[#111111\]/g, 'border-border');
  content = content.replace(/border-\[#2b2b2b\]/g, 'border-border');
  content = content.replace(/border-\[#e5e5e5\]/g, 'border-border');

  // Hover states
  content = content.replace(/hover:text-\[#ffffff\]/g, 'hover:text-accent-hover');
  content = content.replace(/hover:text-\[#e5e5e5\]/g, 'hover:text-accent');
  content = content.replace(/hover:text-\[#111111\]/g, 'hover:text-text-primary hover:bg-surface-hover');
  content = content.replace(/hover:bg-\[#1c1c1c\]/g, 'hover:bg-surface-hover');
  content = content.replace(/hover:bg-\[#e5e5e5\]/g, 'hover:bg-surface-hover');
  content = content.replace(/hover:bg-\[#262626\]/g, 'hover:bg-surface-hover');
  content = content.replace(/hover:border-\[#e5e5e5\]/g, 'hover:border-accent');
  content = content.replace(/hover:border-\[#ffffff\]/g, 'hover:border-accent');
  
  // Divide
  content = content.replace(/divide-\[#e5e5e5\]/g, 'divide-border');
  content = content.replace(/divide-\[#2b2b2b\]/g, 'divide-border');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
