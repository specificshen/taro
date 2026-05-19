const { hooks } = require('@tarojs/runtime')
const taro = require('@tarojs/api').default

const { initReactHooksFallback } = require('./react-hooks-fallback')
const { initWeappNativeApiFallback } = require('./native-api-fallback')

if (hooks.isExist('initNativeApi')) {
  hooks.call('initNativeApi', taro)
}

initReactHooksFallback(taro)
initWeappNativeApiFallback(taro)

module.exports = taro
module.exports.default = module.exports
