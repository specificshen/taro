const fs = require('fs');
const filepath = '/Users/shen/Desktop/study/taro/packages/taro-helper/src/npm.ts';
let code = fs.readFileSync(filepath, 'utf-8');

code = code.replace(
  /console\.log\(chalk\.cyan\(\`缺少npm包\$\{npmName\}，开始安装\.\.\.\`\)\)/g,
  "console.log(chalk.cyan(`缺少npm包${npmName}，开始安装...`), err)"
);
code = code.replace(
  /console\.log\(chalk\.cyan\(\`缺少npm包\$\{pluginName\}，开始安装\.\.\.\`\)\)/g,
  "console.log(chalk.cyan(`缺少npm包${pluginName}，开始安装...`), err)"
);

fs.writeFileSync(filepath, code);
