const { Current, getPageInstance, hooks, injectPageInstance } = require('@tarojs/runtime')
const taro = require('@tarojs/api').default
const React = require('react')

function initWeappNativeApiFallback (taro) {
  if (typeof wx === 'undefined' || typeof taro.addInterceptor === 'function') return

  const { processApis } = require('@tarojs/shared')
  const needPromiseApis = new Set([
    'addFileToFavorites',
    'addVideoToFavorites',
    'authPrivateMessage',
    'checkIsAddedToMyMiniProgram',
    'chooseContact',
    'cropImage',
    'disableAlertBeforeUnload',
    'editImage',
    'enableAlertBeforeUnload',
    'getBackgroundFetchData',
    'getChannelsLiveInfo',
    'getChannelsLiveNoticeInfo',
    'getFuzzyLocation',
    'getGroupEnterInfo',
    'getLocalIPAddress',
    'getShareInfo',
    'getUserProfile',
    'getWeRunData',
    'join1v1Chat',
    'openChannelsActivity',
    'openChannelsEvent',
    'openChannelsLive',
    'openChannelsUserProfile',
    'openCustomerServiceChat',
    'openVideoEditor',
    'saveFileToDisk',
    'scanItem',
    'setEnable1v1Chat',
    'setWindowSize',
    'sendBizRedPacket',
    'startFacialRecognitionVerify',
  ])

  processApis(taro, wx, {
    needPromiseApis,
    modifyApis (apis) {
      apis.delete('lanDebug')
    },
    transformMeta (api, options) {
      if (api === 'showShareMenu') {
        options.menus = options.showShareItems?.map(item => item === 'wechatFriends' ? 'shareAppMessage' : item === 'wechatMoment' ? 'shareTimeline' : item)
      }

      return {
        key: api,
        options
      }
    }
  })

  taro.cloud = wx.cloud
  taro.getTabBar = function (pageCtx) {
    if (typeof pageCtx?.getTabBar === 'function') {
      return pageCtx.getTabBar()?.$taroInstances
    }
  }
  taro.getRenderer = function () {
    return taro.getCurrentInstance()?.page?.renderer ?? 'webview'
  }
}

function initReactHooksFallback (taro) {
  if (typeof taro.useShareAppMessage === 'function') return

  const createHook = lifecycle => fn => {
    const router = Current.router
    const id = router?.$taroPath || router?.path || 'taro-app'
    const instRef = React.useRef()
    const fnRef = React.useRef(fn)
    if (fnRef.current !== fn) fnRef.current = fn

    React.useLayoutEffect(() => {
      let inst = instRef.current = getPageInstance(id)
      if (!inst) {
        inst = instRef.current = Object.create(null)
        injectPageInstance(inst, id)
      }

      const callback = (...args) => fnRef.current(...args)
      if (typeof inst[lifecycle] === 'function') {
        inst[lifecycle] = [inst[lifecycle], callback]
      } else {
        inst[lifecycle] = [...(inst[lifecycle] || []), callback]
      }

      return () => {
        const inst = instRef.current
        if (!inst) return

        const list = inst[lifecycle]
        if (list === callback) {
          inst[lifecycle] = undefined
        } else if (Array.isArray(list)) {
          inst[lifecycle] = list.filter(item => item !== callback)
        }
        instRef.current = undefined
      }
    }, [])
  }

  const hooksMap = {
    useAddToFavorites: 'onAddToFavorites',
    useDidHide: 'componentDidHide',
    useDidShow: 'componentDidShow',
    useError: 'onError',
    useKeyboardHeight: 'onKeyboardHeight',
    useLaunch: 'onLaunch',
    useLoad: 'onLoad',
    useOptionMenuClick: 'onOptionMenuClick',
    usePageNotFound: 'onPageNotFound',
    usePageScroll: 'onPageScroll',
    usePullDownRefresh: 'onPullDownRefresh',
    usePullIntercept: 'onPullIntercept',
    useReachBottom: 'onReachBottom',
    useReady: 'onReady',
    useResize: 'onResize',
    useSaveExitState: 'onSaveExitState',
    useShareAppMessage: 'onShareAppMessage',
    useShareTimeline: 'onShareTimeline',
    useTabItemTap: 'onTabItemTap',
    useTitleClick: 'onTitleClick',
    useUnhandledRejection: 'onUnhandledRejection',
    useUnload: 'onUnload',
  }

  Object.keys(hooksMap).forEach(key => {
    taro[key] = createHook(hooksMap[key])
  })

  taro.useRouter = function useRouter (dynamic = false) {
    if (dynamic) return Current.router
    return React.useMemo(() => Current.router, [])
  }

  taro.useScope = function useScope () {
    return undefined
  }
}

if (hooks.isExist('initNativeApi')) {
  hooks.call('initNativeApi', taro)
}

initReactHooksFallback(taro)
initWeappNativeApiFallback(taro)

module.exports = taro
module.exports.default = module.exports
