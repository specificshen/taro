const fs = require('fs');
const filepath = '/Users/shen/Desktop/study/taro/packages/taro-helper/src/npm.ts';
let code = fs.readFileSync(filepath, 'utf-8');
code = code.replace(/} catch \(e2\) \{\}/g, '} catch (e2) { console.error("!!! FATAL e2 !!!", e2); throw e2; }');
fs.writeFileSync(filepath, code);
