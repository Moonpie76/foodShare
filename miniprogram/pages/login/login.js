// pages/testLogin/testLogin.js
const db = wx.cloud.database()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    avatar: ''
  },

 
  // up: function(e) {
  //   var that = this
  //   wx.cloud.callFunction({
  //     name: "getOpenid"
  //   }).then(res => {
  //     console.log(res)
  //     db.collection("user").where({
  //       _openid: res.result.openid
  //     })
  //     .get()
  //     .then(result => {
  //       console.log(result.data[0])
  //       that.setData({
  //         nickName: result.data[0].nickName,
  //         avatarUrl: result.data[0].avatar
  //       })
  //     })
  //   })
  // },


  login: function(e) {
    var that = this
    console.log(e)

    db.collection("user").add({
      data: {
        nickName: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl,
        myCollections:[],
        myLikes: []
      }
    }).then(res => {
      app.globalData.isLogin = true
      that.setData({
        nickName: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl
      })
      wx.setStorage({
        data: true,
        key: 'isLogin'
      })

      wx.navigateBack({
        delta: 0,
      })
    })
    
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