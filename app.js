// app.js
App({
  onLaunch: function () {
    // 设置全局错误处理
    this.setupGlobalErrorHandling();

    // 初始化必要的全局变量
    this.globalData = {
      userInfo: null,
      // 其他全局变量...
    };

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  setupGlobalErrorHandling: function () {
    // 捕获Promise未处理的拒绝
    wx.onUnhandledRejection(({ reason }) => {
      console.error('全局未处理的Promise拒绝:', reason);
    });

    // 捕获JS脚本执行错误
    wx.onError((error) => {
      console.error('全局JS执行错误:', error);
    });

    // 捕获小程序API调用错误
    const originalWxRequest = wx.request;
    wx.request = function (options) {
      const originalFail = options.fail;
      options.fail = function (err) {
        console.error('wx.request调用失败:', err);
        if (originalFail) {
          originalFail(err);
        }
      };
      return originalWxRequest(options);
    };
  },

  // 提供一个全局的错误上报方法
  reportError: function (error, context) {
    console.error('错误上报:', error, context);
    // 可以在这里添加上报到服务器的逻辑
  },

  globalData: {
    userInfo: null
  }
})
