Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: {},
    background: [],
    flag: 0,
    note: {},
    starnumber: 0,
    nostarnumber: 0,
    location: '',
    id: '',
    profile: {}
  },
  returnPage: function () {
    console.log('dddddddd')
    wx.navigateTo({
      url: '/pages/index/index'
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database() // 查询当前用户所有的 counters    
    db.collection('note').where({
      _id: this.data.id
    }).get({
      success: res => {
        this.setData({
          note: res.data
        })
        console.log(JSON.stringify(res.data, null, 2))
        var note = options.obj;
        var title = '好好学习，天天向上';
        var detail = '今天天气很好哦';
        var starnumber = 3;
        var nostarnumber = 5 - starnumber;
        var location = '天津';
        var time = '05-12';
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
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