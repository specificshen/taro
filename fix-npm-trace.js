const fs = require('fs');
const filepath = '/Users/shen/Desktop/study/taro/packages/taro-helper/src/npm.ts';
let code = fs.readFileSync(filepath, 'utf-8');
code = code.replace(
  /console\.log\(chalk\.cyan\(\`缺少npm包.*?\`\), err\)/g,
  "console.error('!!! CAUGHT FATAL !!!', err, err.stack);"
);
fs.writeFileSync(filepath, code);
