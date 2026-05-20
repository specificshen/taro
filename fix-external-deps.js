const fs = require('fs');
const path = require('path');

const packages = fs.readdirSync('packages').map(name => {
  try {
    const pkg = require(path.join(process.cwd(), 'packages', name, 'package.json'));
    return pkg.name;
  } catch(e) { return null; }
}).filter(Boolean);

function replaceInFile(filePath) {
  if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('/dist/')) return;
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(filePath);
    for (const file of files) {
      replaceInFile(path.join(filePath, file));
    }
  } else if (stat.isFile()) {
    const ext = path.extname(filePath);
    if (!['.ts', '.tsx', '.js', '.jsx', '.json', '.md'].includes(ext)) {
      if (path.basename(filePath) !== 'package.json') return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    
    newContent = newContent.replace(/@spcsn\/taro-([a-zA-Z0-9_-]+)/g, (match, p1) => {
        if (packages.includes(match) || match === '@spcsn/taro-components') {
            return match;
        } else {
            return `@spcsn/taro-${p1}`;
        }
    });

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Reverted external deps in: ${filePath}`);
    }
  }
}

replaceInFile(process.cwd());
