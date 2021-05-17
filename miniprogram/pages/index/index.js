const db = wx.cloud.database()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    cityPickerValue: [0, 0],
    cityPickerIsShow: false,
    noteList: [],
    user_id: '',
    goodList: ['28ee4e3e609e8dec18a8f799233a217b'],
    collectionList: ['28ee4e3e609e8dec18a8f799233a217b'],
    avatar: "",
    nickName: ""
  },

  checkNote: function (e) {
    var id = e.currentTarget.dataset["id"];
    var openid;
    console.log(id);
    wx.cloud.callFunction({
      name: "getOpenidInNote",
      data: {
        id: id
      }
    }).then(res => {
      openid = res.result.openid
      wx.navigateTo({
        url: '../viewnote/viewnote?id='+ id +'&openid=' + openid + ''
      })
    })
    
  },

  //点赞事件
  good() {

  },

  //收藏事件
  collection() {

  },

  handleInput: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  getNotes: function (num = 4, page = 0, city) {
    wx.cloud.callFunction({
      name: "showNotes",
      data: {
        num: num,
        page: page,
        city: city
      }
    }).then(res => {
      var oldData = this.data.noteList
      var newData = oldData.concat(res.result.data)
      this.setData({
        noteList: newData
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.autoLocate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      console.log(res.result.openid)
    })

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
    this.setData({
      noteList: []
    })
    this.getNotes(4, 0, this.data.city)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.noteList.length
    this.getNotes(4, page, this.data.city)
  },

  /**
   页面监听点击“+”
   */
  Onadd: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 城市选择确认
   */
  cityPickerOnSureClick: function (e) {
    var city = e.detail.valueName[1];
    city = city.substr(0, city.length - 1);
    wx.setStorage({
      key: 'city',
      data: city,
      success: () => {
        this.setData({
          city: city,
          cityPickerValue: e.detail.valueCode,
          cityPickerIsShow: false,
        });
      }
    })

  },
  /**
   * 城市选择取消
   */
  cityPickerOnCancelClick: function (event) {
    this.setData({
      cityPickerIsShow: false,
    });
  },


  showCityPicker() {
    this.setData({
      cityPickerIsShow: true,
    });
  },

  autoLocate: function () {
    wx.getLocation({
      type: 'wgs84',
    }).then(res => {
      var longitude = res.longitude
      var latitude = res.latitude
      this.loadCity(longitude, latitude)
    })
  },

  loadCity: function (longitude, latitude) {
    var that = this
    wx.request({
      url: 'https://api.map.baidu.com/reverse_geocoding/v3/?ak=zFlHvfuzeORso0OveUQDCElE118kdlbz&output=json&coordtype=wgs84ll&location=' + latitude + ',' + longitude + '',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success 
        var city = res.data.result.addressComponent.city;
        city = city.substr(0, city.length - 1)
        wx.setStorage({
          key: 'city',
          data: city,
          success: () => {
            that.setData({
              city: city
            })
            that.getNotes(4, 0, that.data.city)
          }
        })
      }
    })
  }
})