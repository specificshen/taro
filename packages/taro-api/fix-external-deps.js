const fs = require('fs');
const glob = require('glob');
const path = require('path');

const packages = fs.readdirSync('packages').map(name => {
  const pkg = require(path.join(process.cwd(), 'packages', name, 'package.json'));
  return pkg.name;
});

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
    if (!['.ts', '.tsx', '.js', '.jsx', '.json', '.md'].includes(ext)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    
    // We only want to keep @spcsn/taro-... if it's in `packages` list, OR if it's @spcsn/taro, @spcsn/taro-components.
    // Actually, any @spcsn/taro-... that is NOT in `packages` array should be reverted to @tarojs/...
    
    newContent = newContent.replace(/@spcsn\/taro-([a-zA-Z0-9_-]+)/g, (match, p1) => {
        if (packages.includes(match) || match === '@spcsn/taro-components') {
            return match;
        } else {
            // external, revert
            return `@spcsn/taro-${p1}`;
        }
    });

    // Also handle @spcsn/binding... wait, we replaced @tarojs/binding to @tarojs/binding.
    // If p1 is binding... wait. @tarojs/binding is not taro-binding. My script replaced @tarojs/binding to @tarojs/binding. Let's revert perfectly.
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Reverted external deps in: ${filePath}`);
    }
  }
}

replaceInFile(process.cwd());
