const db = wx.cloud.database()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    noteList: [],
    user_id: '',
    uid: '',
    goodList: [],
    collectionList: [],
    reFresh: false
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
        url: '../viewnote/viewnote?id=' + id + '&goodList=' + JSON.stringify(this.data.goodList) + '&length=' + this.data.goodList.length + '&collectionList=' + JSON.stringify(this.data.collectionList) + '&c_length=' + this.data.collectionList.length + ' &openid=' + openid + ''
      })
    })

  },

  goodUp: function (e) {
    var noteid = e.currentTarget.dataset['noteid']
    var that = this

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
              wx.cloud.callFunction({
                name: "updateNote",
                data: {
                  num: that.data.noteList.length,
                  city: that.data.city
                }
              }).then(res => {
                that.setData({
                  noteList: res.result.data
                })
                console.log(that.data.noteList)
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
              wx.cloud.callFunction({
                name: "updateNote",
                data: {
                  num: that.data.noteList.length,
                  city: that.data.city
                }
              }).then(res => {
                that.setData({
                  noteList: res.result.data
                })
                console.log(that.data.noteList)
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
              wx.cloud.callFunction({
                name: "updateNote",
                data: {
                  num: that.data.noteList.length,
                  city: that.data.city
                }
              }).then(res => {
                that.setData({
                  noteList: res.result.data
                })
                console.log(that.data.noteList)
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
              wx.cloud.callFunction({
                name: "updateNote",
                data: {
                  num: that.data.noteList.length,
                  city: that.data.city
                }
              }).then(res => {
                that.setData({
                  noteList: res.result.data
                })
                console.log(that.data.noteList)
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

  handleInput: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  //根据定位显示所有笔记（每次触底显示六条）
  getNotes: function (num = 6, page = 0, city) {
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
  //根据定位只显示最新的六条笔记
  firstGetNotes: function (num = 6, page = 0, city) {
    wx.cloud.callFunction({
      name: "showNotes",
      data: {
        num: num,
        page: page,
        city: city
      }
    }).then(res => {
      this.setData({
        noteList: res.result.data
      })
    })
  },
  //没有定位显示所有笔记（每次触底显示六条）
  initializeNotes: function (num = 6, page = 0) {
    wx.cloud.callFunction({
      name: "initializeNotes",
      data: {
        num: num,
        page: page
      }
    }).then(res => {
      var oldData = this.data.noteList
      var newData = oldData.concat(res.result.data)
      this.setData({
        noteList: newData
      })
      console.log(this.data.noteList)
    })
  },
  //没有定位只显示最新的六条笔记
  firstShowNotes: function (num = 6, page = 0) {
    wx.cloud.callFunction({
      name: "initializeNotes",
      data: {
        num: num,
        page: page
      }
    }).then(res => {
      this.setData({
        noteList: res.result.data
      })
      console.log(this.data.noteList)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    that.setData({
      city: wx.getStorageSync('city')
    })
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
          //判断有没有定位
          if(that.data.city!="") {
            that.firstGetNotes(6, 0, that.data.city)
          } else {
            that.firstShowNotes(6, 0)
          }
        })
      })
    } else {
      //判断有没有定位
      if(that.data.city!="") {
        that.firstGetNotes(6, 0, that.data.city)
      } else {
        that.firstShowNotes(6, 0)
      }
    }

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
    // var that = this
    // var a = setInterval(function () {
    //   if (wx.getStorageSync('isLogin')) {
    //     wx.cloud.callFunction({
    //       name: "getOpenid"
    //     }).then(res => {
    //       that.setData({
    //         user_id: res.result.openid
    //       })
    //       wx.cloud.callFunction({
    //         name: "getUserInfo",
    //         data: {
    //           openid: res.result.openid
    //         }
    //       }).then(res => {
    //         that.setData({
    //           uid: res.result.data[0]._id,
    //           goodList: res.result.data[0].myLikes,
    //           collectionList: res.result.data[0].myCollections
    //         })
    //         wx.cloud.callFunction({
    //           name: "updateNote",
    //           data: {
    //             num: that.data.noteList.length,
    //             city: that.data.city
    //           }
    //         }).then(res => {
    //           that.setData({
    //             noteList: res.result.data
    //           })
    //         })
    //       })
    //     })
    //     that.setData({
    //       reFresh: false
    //     })
    //     if (!that.data.reFresh) {
    //       clearInterval(a)
    //     }
    //   }
    // }, 100)

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
    if(this.data.city!="") {
      this.firstGetNotes(6, 0, this.data.city)
    } else {
      this.firstShowNotes(6, 0)
    }
    wx.stopPullDownRefresh();  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.noteList.length
    if(this.data.city!="") {
      this.getNotes(4, page, this.data.city)
    } else {
      this.initializeNotes(6,page)
    }
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

  

  showcityPicker() {
    wx.navigateTo({
      url: '/pages/universityPicker/universityPicker',
    })
  },

})