// components/play-comments/play-comments.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comment_details: null,
    comment_list_reply:null
  },

  /**
   * 组件的初始数据
   */
  data: {
    input_if: false,
    content_reply: '',
    comment_time_reply: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    call_comment: function () {
      this.setData({
        input_if: true,
        comment_time_reply: ''
      })
    },
    //键盘失去焦点
    set_input_if: function () {
      console.log("set_input_id")
      this.setData({
        input_if: false
      })
      console.log(this.data.input_if)
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
    //回复评论
    gain_content_reply: function (res) {
      console.log("confirm")
      var that = this
      that.gain_time()
      console.log(that.data.comment_time_reply)
      wx.cloud.callFunction({
        name: "insertComment",
        data: {
          comment_pr_id: that.properties.comment_details.comment_pr_id, //评论所属的日记id，从入口得到       
          comment_user_id: 22, //发表评论人的id，
          comment_user_name: '小李', //发表评论人的姓名
          comment_user_profile: 'cc', //发表评论人的头像
          comment_text: res.detail.value, //评论内容        
          comment_time: that.data.comment_time, //评论时间       
          reply_if: 1, //如果不是回复，则默认为0，如果为回复，则为1       
          parent_id: that.properties.comment_details._id, //默认为0，如果是楼中楼，则为所处楼层的id,即所在评论的ID
          reply_name: '', //默认为'',如果为楼中楼，则为被回复的姓名
        },
        success(res) {
          that.setData({
            content_reply: '',
            comment_time: '',
            input_if: false
          })
        },
        fail(res) {
          console.log("请求失败！", res)
        }
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