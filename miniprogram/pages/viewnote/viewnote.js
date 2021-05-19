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
    profile: {},
    comment_list: [],
    comment_list_number: 0,
    comment_list_reply: [],
    content: '',
    comment_time: '',
    avatar: '',
    nickName: '',
    goodList: [],
    collectionList: [],
    user_id: '',
    uid: ''
  },


  goodUp: function (e) {
    var noteid = e.currentTarget.dataset['noteid']
    var that = this
    const db = wx.cloud.database()

    if (wx.getStorageSync('isLogin')) {
      wx.cloud.callFunction({
        name: "getOpenid"
      }).then(res => {
        that.setData({
          user_id: res.result.openid
        })
        wx.cloud.callFunction({
          name: "getUserInfo",
          data: {
            openid: res.result.openid
          }
        }).then(res => {
          that.setData({
            uid: res.result.data[0]._id,
            goodList: res.result.data[0].myLikes,
            collectionList: res.result.data[0].myCollections
          })
          console.log("goodList_before:" + that.data.goodList)
          wx.cloud.callFunction({
            name: "upGoodNum",
            data: {
              note_id: noteid,
              user_id: that.data.uid,
              goodlist: that.data.goodList
            },
            success(res) {
              var temp = that.data.goodList
              temp.push(noteid)
              that.setData({
                goodList: temp
              })
              console.log("更改成功！", res)
              db.collection('note').where({
                _id: noteid
              }).get({
                success: res => {
                  that.setData({
                    note: res.data,
                    nostarnumber: 5 - res.data[0].level,
                    background: res.data[0].picture,
                  })
                }
              })
            },
            fail(res) {
              console.log("更改失败！", res)
            }
          })
        })
      })
    } else {
      wx.showModal({
        title: '点赞',
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
            wx.cloud.callFunction({
              name: "getUserInfo",
              data: {
                openid: res.result.openid
              }
            }).then(res => {
              that.setData({
                goodList: res.result.data[0].myLikes,
                collectionList: res.result.data[0].myCollections
              })
            })
          }
        },
        fail: function (res) {}, //接口调用失败的回调函数
        complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
      })
    }
  },

  goodDown: function (e) {
    var noteid = e.currentTarget.dataset['noteid']
    var that = this
    const db = wx.cloud.database()

    if (wx.getStorageSync('isLogin')) {
      wx.cloud.callFunction({
        name: "getOpenid"
      }).then(res => {
        that.setData({
          user_id: res.result.openid
        })
        wx.cloud.callFunction({
          name: "getUserInfo",
          data: {
            openid: res.result.openid
          }
        }).then(res => {
          that.setData({
            uid: res.result.data[0]._id,
            goodList: res.result.data[0].myLikes,
            collectionList: res.result.data[0].myCollections
          })
          console.log("goodList_before:" + that.data.goodList)
          wx.cloud.callFunction({
            name: "downGoodNum",
            data: {
              note_id: noteid,
              user_id: that.data.uid,
              goodlist: that.data.goodList,
            },
            success(res) {
              var temp = that.data.goodList
              console.log(temp)
              console.log(noteid)
              temp.splice(temp.findIndex(function (d) {
                return d == noteid;
              }), 1)
              console.log(temp)
              that.setData({
                goodList: temp
              })
              console.log("更改成功！", res)
              db.collection('note').where({
                _id: noteid
              }).get({
                success: res => {
                  that.setData({
                    note: res.data,
                    nostarnumber: 5 - res.data[0].level,
                    background: res.data[0].picture,
                  })
                }
              })
            }
          })
        })
      })
    } else {
      wx.showModal({
        title: '取消点赞',
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
  },

  collectionUp: function (e) {
    var noteid = e.currentTarget.dataset['noteid']
    var that = this
    const db = wx.cloud.database()

    if (wx.getStorageSync('isLogin')) {
      wx.cloud.callFunction({
        name: "getOpenid"
      }).then(res => {
        that.setData({
          user_id: res.result.openid
        })
        wx.cloud.callFunction({
          name: "getUserInfo",
          data: {
            openid: res.result.openid
          }
        }).then(res => {
          that.setData({
            uid: res.result.data[0]._id,
            goodList: res.result.data[0].myLikes,
            collectionList: res.result.data[0].myCollections
          })
          console.log("colList_before:" + that.data.collectionList)
          wx.cloud.callFunction({
            name: "upColNum",
            data: {
              note_id: noteid,
              user_id: that.data.uid,
              collist: that.data.collectionList
            },
            success(res) {
              var temp = that.data.collectionList
              temp.push(noteid)
              that.setData({
                collectionList: temp
              })
              console.log("更改成功！", res)
              db.collection('note').where({
                _id: noteid
              }).get({
                success: res => {
                  that.setData({
                    note: res.data,
                    nostarnumber: 5 - res.data[0].level,
                    background: res.data[0].picture,
                  })
                }
              })
            },
            fail(res) {
              console.log("更改失败！", res)
            }
          })
        })
      })
    } else {
      wx.showModal({
        title: '收藏',
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
  },

  collectionDown: function (e) {
    var noteid = e.currentTarget.dataset['noteid']
    var that = this
    const db = wx.cloud.database()

    if (wx.getStorageSync('isLogin')) {
      wx.cloud.callFunction({
        name: "getOpenid"
      }).then(res => {
        that.setData({
          user_id: res.result.openid
        })
        wx.cloud.callFunction({
          name: "getUserInfo",
          data: {
            openid: res.result.openid
          }
        }).then(res => {
          that.setData({
            uid: res.result.data[0]._id,
            goodList: res.result.data[0].myLikes,
            collectionList: res.result.data[0].myCollections
          })
          console.log("colList_before:" + that.data.collectionList)
          wx.cloud.callFunction({
            name: "downColNum",
            data: {
              note_id: noteid,
              user_id: that.data.uid,
              collectionList: that.data.collectionList,
            },
            success(res) {
              var temp = that.data.collectionList
              console.log(temp)
              console.log(noteid)
              temp.splice(temp.findIndex(function (d) {
                return d == noteid;
              }), 1)
              console.log(temp)
              that.setData({
                collectionList: temp
              })
              console.log("更改成功！", res)
              db.collection('note').where({
                _id: noteid
              }).get({
                success: res => {
                  that.setData({
                    note: res.data,
                    nostarnumber: 5 - res.data[0].level,
                    background: res.data[0].picture,
                  })
                }
              })
            },
            fail(res) {
              console.log("更改失败！", res)
            }
          })
        })
      })
    } else {
      wx.showModal({
        title: '取消收藏',
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
  },

  click: function () {
    var that = this
    for (var i = 0; i < that.data.comment_list_number; i++) {
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

        wx.cloud.callFunction({
          name: "insertComment",
          data: {
            comment_pr_id: that.data.note[0]._id, //评论所属的日记id，从入口得到       
            comment_user_name: nickName, //发表评论人的姓名
            comment_user_profile: avatar, //发表评论人的头像
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
      })
    })
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

  login: function (e) {
    if (!wx.getStorageSync('isLogin')) {
      if (!wx.getStorageSync('isLogin')) {
        wx.showModal({
          title: '评论笔记',
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const db = wx.cloud.database()
    if (wx.getStorageSync('isLogin')) {
      wx.cloud.callFunction({
        name: "getOpenid"
      }).then(res => {
        that.setData({
          user_id: res.result.openid
        })
        wx.cloud.callFunction({
          name: "getUserInfo",
          data: {
            openid: res.result.openid
          }
        }).then(res => {
          that.setData({
            uid: res.result.data[0]._id,
            goodList: res.result.data[0].myLikes,
            collectionList: res.result.data[0].myCollections
          })
        })
      })
    }
    // 查询页面除了评论外所有的值   
    db.collection('note').where({
      _id: options.id
    }).get({
      success: res => {
        this.setData({
          note: res.data,
          nostarnumber: 5 - res.data[0].level,
          background: res.data[0].picture,
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
          comment_list_number: get_comment.data.length
        })
        var comment_list_replys = []
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
          comment_list_reply: comment_list_replys
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
    db.collection("note").where({
        _id: options.id
      })
      .get()
      .then(res => {
        console.log(res.data[0])
        that.setData({
          avatar: res.data[0].avatar,
          nickName: res.data[0].nickName
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
  onShow: function () {},

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