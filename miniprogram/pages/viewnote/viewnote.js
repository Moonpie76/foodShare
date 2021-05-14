Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: {},
    background: [],
    note: {},
    nostarnumber: 0,
    id: '',
    profile: {}
  },
  returnPage: function () {
    wx.navigateBack({
      changed: true
    })
  },
  realImageLoad: function (e) {
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height, //获取图片真实宽度
      ratio = $width / $height; //图片的真实宽高比例
    var viewWidth = 750, //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 718 / ratio; //计算的高度值
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth, //viewWidth
      height: viewHeight //viewHeight
    }
    this.setData({
      images: image
    })
  },
  previewpic:function(e){
    var that = this
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: that.data.background[index],
      urls: that.data.background,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database() // 查询当前用户所有的 counters    
    db.collection('note').where({
      _id: options.id
    }).get({
      success: res => {
        this.setData({
          note: res.data,
          nostarnumber: 5 - res.data[0].level,
          background: res.data[0].picture
        })
        console.log(JSON.stringify(res.data, null, 2))
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      },
    })
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