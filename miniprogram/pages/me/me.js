// pages/me/me.js
const db = wx.cloud.database()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    avatar: ''
  },

  login: function(e) {
    var that = this
    console.log(e)

    if(e.detail.errMsg==="getUserInfo:ok") {
      console.log("授权成功")
      app.globalData.isLogin = true
      that.setData({
        nickName: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl
      })
      console.log(that.data.nickName)
      console.log(that.data.avatar)
      wx.setStorage({
        data: true,
        key: 'isLogin'
      })
      db.collection("user").add({
        data: {
          nickName: e.detail.userInfo.nickName,
          avatar: e.detail.userInfo.avatarUrl,
          myCollections:[],
          myLikes: []
        }
      }).then(res => {
  
      })
    } else {
     console.log("授权失败")
    }
    
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    if(!wx.getStorageSync('isLogin')) {
      wx.getUserInfo({
        success: res => {
          that.setData({
            avatar: res.userInfo.avatarUrl,
            nickName: "请点击头像进行登录"
          })
        }
      })
    } else {
      wx.cloud.callFunction({
        name: "getOpenid"
      }).then(open => {
        wx.cloud.callFunction({
          name: "getUserInfo",
          data: {
            openid: open.result.openid
          }
        }).then(userInfo => {
          var avatar = userInfo.result.data[0].avatar
          var nickName = userInfo.result.data[0].nickName
  
          that.setData({
            avatar: avatar,
            nickName: nickName
          })
        })
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})