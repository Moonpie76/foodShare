// pages/me/me.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeTab: 0,
    goodList:['28ee4e3e60a3cdf619e51fd15667f9f3'],
    collectionList:['28ee4e3e60a3cdf619e51fd15667f9f3'],
    datalist:[],
    openid:'',
    alist:[],
    height:600
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
   
    this.handleClick()
    await this.sleep(1500);
    console.log(this.data.datalist)
    const tabs=[{
      title: '我的发布',  
      dataList:this.data.datalist  
    },{
      title: '我的收藏',
      dataList:this.data.a
    }
    ]
    this.setData({ tabs })
    
    console.log(tabs)
  },
  sleep(time){
    return new Promise((resolve) => setTimeout(resolve, time));
   },
  onTabClick(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index 
    })
  },

  checkNote: function (e) {
    var id = e.currentTarget.dataset["id"];
    console.log(this.data.noteList);
    wx.navigateTo({
      url: '../viewnote/viewnote?id=' + id,
    })
  },

  getdataList:function(openid){
    console.log(this.data.openid)
    wx.cloud.callFunction({
      name: "getdatalist",
      data: {
        openid:this.data.openid
      }
    }).then(res => {
      //var oldData = this.data.noteList
      console.log(res.result.data)
      var newData = this.data.datalist.concat(res.result.data)
      this.setData({
        datalist: newData,
        height:newData.length*150
      })
      console.log(this.data.datalist.length)
      console.log(this.data.height)
    })
  },

  getaList:function(openid){
    console.log(this.data.openid)
    wx.cloud.callFunction({
      name: "getalist",
      data: {
        openid:this.data.openid
      }
    }).then(res => {
      //var oldData = this.data.noteList
      console.log(res.result.data)
      var newData = this.data.alist.concat(res.result.data)
      this.setData({
        alist: newData,
        height:newData.length*150
      })
      console.log(this.data.alist.length)
      console.log(this.data.height)
    })
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index 
    })
  },



  handleClick(e) {
    wx.cloud.callFunction({
      name:'getOpenid'
    }).then(res=>{
      console.log(res.result.openid)
      this.setData({
        openid:  res.result.openid
      })
      console.log(this.data.openid)
      this.getdataList()
      this.getaList()
      
    })
   wx.navigateTo({
      url: './webview',
    })
    //console.log("aaaaa")
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

  onPullDownRefresh: function () {
    this.setData({
      datalist: []
    })
    this.getdataList(4, 0, this.data.openid)
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