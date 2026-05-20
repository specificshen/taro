const fs = require('fs');
let content = fs.readFileSync('packages/taro-cli/package.json', 'utf8');
content = content.replace('"@types/babel__traverse": "^7.20.6",\n  }', '"@types/babel__traverse": "^7.20.6"\n  }');
fs.writeFileSync('packages/taro-cli/package.json', content);
