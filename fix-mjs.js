const fs = require('fs');
const path = require('path');

function walk(dir) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('dist')) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            walk(full);
        } else if (full.endsWith('.mjs') || full.endsWith('.js') || full.endsWith('.ts')) {
            const content = fs.readFileSync(full, 'utf-8');
            if (content.includes('@spcsn/taro-')) {
                // carefully replace only dependencies named @tarojs/(plugin-)?something
                const newContent = content.replace(/'@tarojs\//g, "'@spcsn/taro-")
                                          .replace(/"@tarojs\//g, '"@spcsn/taro-')
                                          .replace(/`@tarojs\//g, '`@spcsn/taro-');
                if (newContent !== content) {
                    fs.writeFileSync(full, newContent);
                    console.log('Fixed', full);
                }
            }
        }
    }
}
walk(__dirname);
