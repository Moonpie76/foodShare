var util = require("../../util/util.js")
var app = getApp()
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
    profile: {},
    comment_list: [],
    comment_list_number:0,
    comment_list_reply: [],
    content: '',
    comment_time: '',
    avatar: '',
    nickName: ''
  },
  click:function(){
    var that=this
    for(var i=0;i<that.data.comment_list_number;i++){
      console.log(that.data.comment_list_reply[i])
    }
  },
  //获取时间
  gain_time: function () {
    var date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    var comment_time = [month, day].join('-')
    this.setData({
      comment_time: comment_time
    })
  },
  //发表评论
  gain_content: function (res) {
    var that = this
    const db = wx.cloud.database()
    that.gain_time()
    wx.cloud.callFunction({
      name: "insertComment",
      data: {
        comment_pr_id: that.data.note[0]._id, //评论所属的日记id，从入口得到       
        comment_user_id: 22, //发表评论人的id，
        comment_user_name: '小李', //发表评论人的姓名
        comment_user_profile: 'cc', //发表评论人的头像
        comment_text: res.detail.value, //评论内容        
        comment_time: that.data.comment_time, //评论时间       
        reply_if: 0, //如果不是回复，则默认为0，如果为回复，则为1       
        parent_id: '', //默认为0，如果是楼中楼，则为所处楼层的id,即所在评论的ID
        reply_name: '', //默认为'',如果为楼中楼，则为被回复的姓名
      },
      success(res) {
        that.setData({
          content: '',
          comment_time: ''
        })
        db.collection('comment').where({
          comment_pr_id: that.data.note[0]._id,
          reply_if: 0
        }).get({
          success: get_comment => {
            that.setData({
              comment_list: get_comment.data,
            })
            console.log(that.data.comment_list)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
          },
        })
      },
      fail(res) {
        console.log("请求失败！", res)
      }
    })
    console.log("comment_search")
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
  previewpic: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: that.data.background[index],
      urls: that.data.background,
    })
  },

  login: function(e) {
    if(!app.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const db = wx.cloud.database()
    // 查询页面除了评论外所有的值   
    db.collection('note').where({
      _id: options.id
    }).get({
      success: res => {
        this.setData({
          note: res.data,
          nostarnumber: 5 - res.data[0].level,
          background: res.data[0].picture
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      },
    })
    //查询当前页面的所有第一层评论
    db.collection('comment').where({
      comment_pr_id: options.id,
      reply_if: 0
    }).get({
      success: get_comment => {
        that.setData({
          comment_list: get_comment.data,
          comment_list_number:get_comment.data.length
        })
        var comment_list_replys=[]
        //循环查询回复的评论
        for (var i = 0; i < that.data.comment_list.length; i++) {
          console.log("ljlljojoj")
          var index = i
          db.collection('comment').where({
            parent_id: that.data.comment_list[index]._id, //该条主评论的id
            reply_if: 1
          }).get({
            success: get_comment_reply => {
              console.log("chao")
              comment_list_replys.push(get_comment_reply.data)
              console.log(comment_list_replys)
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '查询记录失败'
              })
            },
          })
        }
        console.log("set")
        that.setData({
          comment_list_reply:comment_list_replys
        })
        console.log(that.data.comment_list_reply)
        console.log("jiazaishuju")
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      },
    })

    console.log(options.openid)
    wx.cloud.callFunction({
      name: "getUserInfo",
      data: {
        openid: options.openid
      }
    }).then(res => {
      console.log(res.result.data[0])
      that.setData({
        avatar: res.result.data[0].avatar,
        nickName: res.result.data[0].nickName
      })
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