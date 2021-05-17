//app.js
App({
  onLaunch: function () {
    var that = this

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:"cloud1-3g2crjv629049c8c",
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })

      var openid = wx.getStorageSync('openid')
      if(openid) {
        console.log("已经登录过")
        //直接请求登录业务逻辑
        // wx.request({
        //   url: '///login',
        //   data: {
        //     openid: result.data.openid
        //   },
        //   success: data => {
        //     console.log(data)
        //   }
        // })
      }

      // wx.getSetting({
      //   success (res) {
      //     console.log(res.authSetting)
      //     if(res.authSetting["scope.userInfo"]) {
      //       wx.getUserInfo({
      //         success: data => {
      //           console.log(data)
      //           that.globalData.userInfo = data.userInfo
      //         }
      //       })
      //     } 
      //   }
      // })
    }

    this.globalData = {
      userInfo: '',
      isLogin: wx.getStorageSync('isLogin')
    }
  }
})
