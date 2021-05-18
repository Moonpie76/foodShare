// components/comment-cards/comment-cards.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    reply_details:null
  },

  /**
   * 组件的初始数据
   */
  data: {
    reply_time:''

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取时间
    getTime: function () {
      var that = this;
      var TIME = util.formatTime(new Date());
      this.setData({
        comment_time_reply: TIME,
      });
    },

    //楼中楼回复评论
    play_replys:function(){
      const db = wx.cloud.database()
      var that = this
      that.getTime()
      db.collection('comment').add({//向数据库里面插入评论回复
        data: {
          comment_pr_id: that.properties.comment_details.comment_pr_id, //评论所属的日记id，从入口得到       
          comment_user_id: 22, //发表评论人的id，
          comment_user_name: '小李', //发表评论人的姓名
          comment_user_profile: 'cc', //发表评论人的头像
          comment_text: res.detail.value, //评论内容        
          comment_time: that.data.comment_time_reply, //评论时间       
          reply_if: 1, //如果不是回复，则默认为0，如果为回复，则为1       
          parent_id: that.properties.comment_details.parent_id, //默认为0，如果是楼中楼，则为所处楼层的id,即所在评论的ID
          reply_name:  that.properties.comment_details.comment_user_name, //默认为'',如果为楼中楼，则为被回复的姓名
        },
        success() {//插入成功，调用父组件的onload函数刷新界面
          console.log("这是子组件")
          that.triggerEvent('updataSelect')
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
    }

  }
})
