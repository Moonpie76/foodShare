const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: "",
    cityPickerValue: [0, 0],
    cityPickerIsShow: false,
    noteList: []
  },

  getNotes: function (num=4, page=0) {
    wx.cloud.callFunction({
      name: "showNotes",
      data: {
        num: num,
        page: page,
        city: this.data.city
      }
    }).then(res=>{
      var oldData = this.data.noteList
      var newData = oldData.concat(res.result.data)
      this.setData({
        noteList: newData
      })
      console.log(this.data.noteList)
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
    this.getNotes()
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
    this.getNotes()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.noteList.length
    this.getNotes(4, page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 城市选择确认
   */
  cityPickerOnSureClick: function (e) {
    console.log('cityPickerOnSureClick');
    console.log(e);
    var city = e.detail.valueName[1];
    city = city.substr(0, city.length-1);
    this.setData({
      city: city,
      cityPickerValue: e.detail.valueCode,
      cityPickerIsShow: false,
    });

  },
  /**
   * 城市选择取消
   */
  cityPickerOnCancelClick: function (event) {
    console.log('cityPickerOnCancelClick');
    console.log(event);
    this.setData({
      cityPickerIsShow: false,
    });
  },


  showCityPicker() {
    // this.data.cityPicker.show()
    console.log("show city-picker")
    this.setData({
      cityPickerIsShow: true,
    });
  },

  autoLocate: function () {
    var page = this
    wx.getLocation({
     type: 'wgs84',
     success: function (res) {
     // success 
     var longitude = res.longitude
     var latitude = res.latitude
     page.loadCity(longitude, latitude)
     }
    })
  },
     
    loadCity: function (longitude, latitude) {
      var page = this
      wx.request({
      url: 'https://api.map.baidu.com/reverse_geocoding/v3/?ak=zFlHvfuzeORso0OveUQDCElE118kdlbz&output=json&coordtype=wgs84ll&location=' + latitude + ',' + longitude + '',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
     success: function (res) {
     // success 
     console.log(res.data.result.addressComponent);
     var city = res.data.result.addressComponent.city;
     city = city.substr(0, city.length-1)
     console.log("城市为" + city)
     page.setData({ city: city });
     }
    })
  }
})