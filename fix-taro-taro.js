const fs = require('fs');
const path = require('path');

function walk(dir) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('dist')) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            walk(full);
        } else if (full.endsWith('.mjs') || full.endsWith('.js') || full.endsWith('.ts') || full.endsWith('.json')) {
            const content = fs.readFileSync(full, 'utf-8');
            if (content.includes('@spcsn/taro')) {
                const newContent = content.replace(/@spcsn\/taro-taro/g, "@spcsn/taro");
                fs.writeFileSync(full, newContent);
                console.log('Fixed', full);
            }
        }
    }
}
walk(__dirname);
