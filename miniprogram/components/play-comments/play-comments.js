// components/play-comments/play-comments.js
var util = require("../../util/util.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comment_details: null,
    comment_list_reply: null,
    note_open_id:null
  },

  /**
   * 组件的初始数据
   */
  data: {
    content_reply: '',
    comment_time_reply: '',
    input_if: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //子组件调用刷新
    get_refurbish_reply:function(){
      this.triggerEvent('updataSelect')
    },
    //召唤输入键盘
    call_comment: function () {
      if (!wx.getStorageSync('isLogin')) {
        wx.showModal({
          title: '回复评论',
          content: '请到个人中心登录，登录后方可进行操作',
          showCancel: true, //是否显示取消按钮
          confirmText: "去登录", //默认是“确定”
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              //点击确定
              wx.switchTab({
                url: '/pages/me/me'
              })
            }
          },
          fail: function (res) {}, //接口调用失败的回调函数
          complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
        })
      }
      this.setData({
        input_if: true,
        comment_time_reply: ''
      })
    },

    //键盘失去焦点
    set_input_if: function () {
      console.log("键盘失去焦点")
      this.setData({
        input_if: false
      })
    },

    //获取时间
    gain_time: function () {
      var date = new Date()
      const month = date.getMonth() + 1
      const day = date.getDate()
      var comment_time_reply = [month, day].join('-')
      this.setData({
        comment_time_reply: comment_time_reply
      })
    },

    //获取时间
    getTime: function () {
      var that = this;
      var TIME = util.formatTime(new Date());
      this.setData({
        comment_time_reply: TIME,
      });
    },

    //回复评论
    gain_content_reply: function (res) {
      const db = wx.cloud.database()
      var that = this
      that.getTime()
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
          db.collection('comment').add({ //向数据库里面插入评论回复
            data: {
              comment_pr_id: that.properties.comment_details.comment_pr_id, //评论所属的日记id，从入口得到       
              comment_user_id: 22, //发表评论人的id，
              comment_user_name:nickName, //发表评论人的姓名
              comment_user_profile:avatar, //发表评论人的头像
              comment_text: res.detail.value, //评论内容        
              comment_time: that.data.comment_time_reply, //评论时间       
              reply_if: 1, //如果不是回复，则默认为0，如果为回复，则为1       
              parent_id: that.properties.comment_details._id, //默认为0，如果是楼中楼，则为所处楼层的id,即所在评论的ID
              reply_name: '', //默认为'',如果为楼中楼，则为被回复的姓名
            },
            success() { //插入成功，调用父组件的onload函数刷新界面
              that.triggerEvent('updataSelect')
              that.setData({
                content_reply: '',
                comment_time: '',
                input_if: false
              })
            },
          })
        })
      })
    },

    //查找该评论下的评论
    search_reply_comment: function (res) {
      var that = this
      const db = wx.cloud.database()
      db.collection('comment').where({
        comment_pr_id: that.properties.comment_details.comment_pr_id, //属于该笔记
        parent_id: that.properties.comment_details._id, //属于该评论
        reply_if: 1 //为回复评论
      }).get({
        success: get_comment_reply => {
          that.setData({
            comment_list_reply: get_comment_reply.data,
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
        },
      })
    }
  }
})