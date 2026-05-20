const fs = require('fs');
const filepath = '/Users/shen/Desktop/study/taro/packages/taro-service/src/utils/index.ts';
let code = fs.readFileSync(filepath, 'utf-8');

code = code.replace(
  `        extensions: ['.js', '.ts'],
      })
    } catch (err) {`,
  `        extensions: ['.js', '.ts'],
      })
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        try {
          const cliPath = require.resolve('@spcsn/taro-cli/package.json', { paths: [__dirname, root].filter(Boolean) });
          fPath = resolve.sync(item, { basedir: require('path').dirname(cliPath), extensions: ['.js', '.ts'] });
        } catch(e) {}
      }
      if (!fPath) {`
);

code = code.replace(
  `        process.exit(1)
      }
    }`,
  `        process.exit(1)
      }
    }
    }`
);

fs.writeFileSync(filepath, code);
