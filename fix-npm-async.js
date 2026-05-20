const fs = require('fs');
const filepath = '/Users/shen/Desktop/study/taro/packages/taro-helper/src/npm.ts';
let code = fs.readFileSync(filepath, 'utf-8');

code = code.replace(
  `        if (err && (err as any).code === 'MODULE_NOT_FOUND') {`,
  `        if (err && (err as any).code === 'MODULE_NOT_FOUND') {
          try {
            const cliPath = require.resolve('@spcsn/taro-cli/package.json', { paths: [__dirname, root].filter(Boolean) as string[] });
            const res = resolvePath.sync(pluginName, { basedir: require('path').dirname(cliPath) });
            if (res) {
              npmCached[pluginName] = res;
              resolve(res);
              return;
            }
          } catch (e2) {}`
);

fs.writeFileSync(filepath, code);
