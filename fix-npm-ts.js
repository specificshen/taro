const fs = require('fs');
const filepath = '/Users/shen/Desktop/study/taro/packages/taro-helper/src/npm.ts';
let code = fs.readFileSync(filepath, 'utf-8');

code = code.replace(
  `        if ((e as any).code === 'MODULE_NOT_FOUND') {`,
  `        if ((e as any).code === 'MODULE_NOT_FOUND') {
          try {
            const cliPath = require.resolve('@spcsn/taro-cli/package.json', { paths: [__dirname, root] });
            return resolvePath.sync(pluginName, { basedir: require('path').dirname(cliPath) });
          } catch (e2) {}`
);

fs.writeFileSync(filepath, code);
