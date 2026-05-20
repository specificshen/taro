import { isNodeModule } from '@spcsn/taro-helper';

import type { Func, IPostcssOption } from '@spcsn/taro/types/compile';

const platform = 'h5';

const defaultConstparseOption = {
  constants: [
    {
      key: 'taro-tabbar-height',
      val: '50PX',
    },
  ],
  platform,
};

const taroModuleRgx = [/@spcsn[/\\_]taro-components/, /\btaro-components\b/];

const defaultEsnextModuleRgx = [
  /@spcsn[/\\_]taro-components/,
  /\btaro-components\b/,
  /@spcsn[/\\_]taro-h5/,
  /\btaro-h5\b/,
  /@spcsn[/\\_]taro-router/,
  /\btaro-router\b/,
];

const isTaroModule = (filename: string) => taroModuleRgx.some((reg) => reg.test(filename));

const isEsnextModule = (filename: string, esnextModules) => {
  const esnextModuleRules = [...defaultEsnextModuleRgx, ...esnextModules];
  return esnextModuleRules.some((pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.test(filename);
    } else {
      return filename.indexOf(pattern) > -1;
    }
  });
};

const getPostcssExclude = (esnextModules: string[]): ((fileName: string) => boolean) => {
  return (filename) => {
    if (isTaroModule(filename)) {
      return true;
    } else if (isEsnextModule(filename, esnextModules)) {
      return false;
    } else {
      return isNodeModule(filename);
    }
  };
};

export const getDefaultPostcssConfig = function ({
  designWidth,
  deviceRatio,
  option = {} as IPostcssOption<'h5'>,
  esnextModules,
}): [string, any, Func?][] {
  const { autoprefixer, htmltransform, pxtransform = {}, ...options } = option;
  if (designWidth) {
    pxtransform.config!.designWidth = designWidth;
  }
  if (deviceRatio) {
    pxtransform.config!.deviceRatio = deviceRatio;
  }

  pxtransform.config!.exclude = getPostcssExclude(esnextModules);

  return [
    ['autoprefixer', autoprefixer, require('autoprefixer')],
    ['postcss-pxtransform', pxtransform, require('@spcsn/postcss-pxtransform')],
    ['postcss-html-transform', htmltransform, require('@spcsn/postcss-html-transform')],
    ['postcss-plugin-constparse', defaultConstparseOption, require('@spcsn/postcss-plugin-constparse')],
    ...Object.entries(options),
  ];
};
