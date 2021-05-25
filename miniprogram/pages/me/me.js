// pages/me/me.js
const db = wx.cloud.database()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeTab: 0,
    datalist:[],
    datalist1:[],
    openid:'',
    alist:[],
    height1:'',
    height2:'',
    nickName:'',
    avatar: '',
    height:''
  },

  login: async function(e) {
    var that = this
    console.log(e)

    if(e.detail.errMsg=="getUserInfo:ok") {
      
      //await this.sleep(1500);
      db.collection("user").add({
        data: {
          nickName: e.detail.userInfo.nickName,
          avatar: e.detail.userInfo.avatarUrl,
          myCollections:[],
          myLikes: []
        }
      }).then(res => {
        //this.handleClick()
        app.globalData.isLogin = true
        that.setData({
          nickName: e.detail.userInfo.nickName,
          avatar: e.detail.userInfo.avatarUrl
        })
        wx.setStorage({
          data: true,
          key: 'isLogin'
        })
  
      })
      this.handleClick()
      await this.sleep(2000)
      this.onLoad()
    } else {
     console.log("授权失败")
    }
    
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
   
   // this.handleClick()
    //await this.sleep(1500);
    console.log(this.data.datalist)
    const tabs=[{
      title: '我的发布'+' '+this.data.datalist.length,
      
      dataList:this.data.datalist  
    },{
      title: '我的收藏'+' '+this.data.datalist1.length,
      dataList:this.data.datalist1,
      
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

  getdataList:function(){
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
        height1:newData.length*140
      })
      console.log(this.data.datalist.length)
      console.log(this.data.height)
    })
  },

  getaList:function(){
    
    console.log(this.data.openid)
    wx.cloud.callFunction({
      name: "getalist",
      data: {
        openid:this.data.openid
      }
    }).then(res => {
      //var oldData = this.data.noteList
     console.log(res)
      //var newData = this.data.alist.concat(res.result.data)
      var newData = []
      for(var i=0;i<res.result.data.length;i++){
        newData[i]=res.result.data[i].myCollections
      }
      
      this.setData({
        alist: newData,
        
      })

      

      console.log(this.data.alist)
      console.log(this.data.height)
      this.getbyid()
    })
  },

getbyid: async function(){
  for(var i=0;i<this.data.alist.length;i++){
    for(var j=0;j<this.data.alist[i].length;j++){
  var Id=this.data.alist[i][j]
  console.log(typeof(Id) )
  wx.cloud.callFunction({
    name: "getbyid",
    data: {
      id:Id
    }
  }).then(res=>{
    console.log(res.result.data)
    this.setData({
      datalist1: this.data.datalist1.concat(res.result.data)

    })
    
    
  })
}}
await this.sleep(2000);
console.log(this.data.datalist1)
if(this.data.height1>this.data.datalist1.length*140){
  this.setData({
    height:this.data.height1
  })
}else{
  this.setData({
    height:this.data.datalist1.length*100
  })
}
console.log(this.data.height)
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