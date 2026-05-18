// React-only / weapp-first fork：仅保留小程序入口。
// 此前的 h5 / harmony 入口已在阶段 2 移除。
module.exports = require('./dist/index.mini.js').default

module.exports.default = module.exports
