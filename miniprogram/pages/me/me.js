// pages/me/me.js
const db = wx.cloud.database()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeTab: 0,
    datalist: [],
    datalist1: [],
    openid: '',
    alist: [],
    height1: '',
    height2: '',
    nickName: '',
    avatar: '',
    height: '',
    lock: false
  },

  login: async function (e) {
    var that = this
    console.log(e)

    //如果没有登录，点击头像登录
    if (!wx.getStorageSync('isLogin')) {
      wx.getUserProfile({
        desc: "获取你的昵称、头像、地区及性别",
        complete: (res) => {
          let errMsg = res.errMsg
          //用户同意授权
          if (errMsg == "getUserProfile:ok") {
            //存储已登录的状态
            wx.setStorage({
              data: true,
              key: 'isLogin'
            })
            //显示头像和昵称
            let userInfo = res.userInfo
            that.setData({
              nickName: userInfo.nickName,
              avatar: userInfo.avatarUrl
            })


            //查看用户是否是第一次登录
            wx.cloud.callFunction({
              name: "getOpenid"
            }).then(open => {
              console.log(open.result.openid)
              wx.cloud.callFunction({
                name: "getUserInfo",
                data: {
                  openid: open.result.openid
                }
              }).then(info => {
                //用户是第一次登录，把用户信息插入到user表中
                if (info.result.data.length == 0) {
                  db.collection("user").add({
                    data: {
                      nickName: userInfo.nickName,
                      avatar: userInfo.avatarUrl,
                      myCollections: [],
                      myLikes: []
                    }
                  }).then(res => {

                  })
                }
              })
            })

          } else {
            console.log("授权失败！")
          }
        }
      })
    } else {
      // 如果已经是登录状态，点击头像退出登录
      wx.showActionSheet({
        itemList: ['退出登录'], //显示的列表项
        itemColor: '#007aff',
        success: function (res) { //res.tapIndex点击的列表项
          if (res.tapIndex == 0) {
            wx.setStorage({
              data: false,
              key: 'isLogin',
            })
            wx.getUserInfo({
              success: res => {
                that.setData({
                  avatar: res.userInfo.avatarUrl,
                  nickName: "请点击头像进行登录"
                })
                that.setData({
                  datalist: [],
                  datalist1: []
                })
                const tabs = [{
                  title: '我的发布' + ' ' + 0,

                  dataList: []
                }, {
                  title: '我的收藏' + ' ' + 0,
                  dataList: [],

                }]
                that.setData({
                  tabs: tabs
                })
              }

            })
          }
        },
        fail: function (res) {},
        complete: function (res) {}
      })
    }

  },
  asleep: function (n) {
    var start = new Date().getTime();
    while (true)
      if (new Date().getTime() - start > n) break;
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var that = this

    console.log("onload")

    if (wx.getStorageSync('isLogin')) {
      this.handleClick()


    } else {
      const tabs = [{
        title: '我的发布' + ' ' + 0,

        dataList: []
      }, {
        title: '我的收藏' + ' ' + 0,
        dataList: [],

      }]
      that.setData({
        tabs: tabs
      })

    }

  },
  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  },
  onTabClick(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index
    })
  },

  checkNote: function (e) {
    var id = e.currentTarget.dataset["id"];
    console.log(this.data.noteList);
    wx.navigateTo({
      url: '../viewnote/viewnote?id=' + id,
    })
  },

  getdataList: async function () {
    var that = this
    console.log(that.data.openid)
    wx.cloud.callFunction({
      name: "getdatalist",
      data: {
        openid: that.data.openid
      }
    }).then(res => {
      //var oldData = this.data.noteList
      console.log(res.result.data)
      // var newData = that.data.datalist.concat(res.result.data)

      that.setData({
        datalist: res.result.data,
        height1: res.result.data.length * 140
      })
      console.log(that.data.datalist.length)

      wx.cloud.callFunction({
        name: "getalist",
        data: {
          openid: that.data.openid
        }
      }).then(res => {
        //var oldData = this.data.noteList
        console.log(res)
        //var newData = this.data.alist.concat(res.result.data)
        var newData = []
        for (var i = 0; i < res.result.data.length; i++) {
          newData[i] = res.result.data[i].myCollections
        }
        console.log(newData)
        that.setData({
          alist: newData,

        })
        console.log(that.data.alist)

        for (var i = 0; i < that.data.alist.length; i++) {
          for (var j = 0; j < that.data.alist[i].length; j++) {
            var Id = that.data.alist[i][j]

            wx.cloud.callFunction({
              name: "getbyid",
              data: {
                id: Id
              }
            }).then(res => {
              that.setData({
                datalist1: that.data.datalist1.concat(res.result.data)

              })
              console.log(that.data.datalist1)
              if (that.data.height1 < 500 && that.data.datalist1.length * 500 < 500) {
                that.setData({
                  height: 500
                })
              } else {
                if (that.data.height1 > that.data.datalist1.length * 140) {
                  that.setData({
                    height: that.data.height1
                  })
                } else {
                  that.setData({
                    height: that.data.datalist1.length * 140
                  })
                }
              }

            })
          }
        }
        // console.log(new Date())
        // const tabs = [{
        //   title: '我的发布' + ' ' + this.data.datalist.length,

        //   dataList: this.data.datalist
        // }, {
        //   title: '我的收藏' + ' ' + this.data.datalist1.length,
        //   dataList: this.data.datalist1,
        // }]
        // this.setData({
        //   tabs: tabs
        // })
        // console.log(tabs)


      })
    })

  },

  getaList: function () {

    console.log(this.data.openid)
    wx.cloud.callFunction({
      name: "getalist",
      data: {
        openid: this.data.openid
      }
    }).then(res => {
      //var oldData = this.data.noteList
      console.log(res)
      //var newData = this.data.alist.concat(res.result.data)
      var newData = []
      for (var i = 0; i < res.result.data.length; i++) {
        newData[i] = res.result.data[i].myCollections
      }

      this.setData({
        alist: newData,

      })

      console.log(this.data.alist)
      console.log(this.data.height)
      this.getbyid()
    })
  },

  getbyid: async function () {
    for (var i = 0; i < this.data.alist.length; i++) {
      for (var j = 0; j < this.data.alist[i].length; j++) {
        var Id = this.data.alist[i][j]

        wx.cloud.callFunction({
          name: "getbyid",
          data: {
            id: Id
          }
        }).then(res => {
          this.setData({
            datalist1: this.data.datalist1.concat(res.result.data)

          })


        })
      }
    }
    await this.sleep(2000);
    if (this.data.height1 > this.data.datalist1.length * 140) {
      this.setData({
        height: this.data.height1
      })
    } else {
      this.setData({
        height: this.data.datalist1.length * 100
      })
    }
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index
    })
  },



  handleClick: async function () {
    wx.cloud.callFunction({
      name: 'getOpenid'
    }).then(res => {
      this.setData({
        openid: res.result.openid
      })
      this.getdataList()
    })

    await this.sleep(2000)

    const tabs = [{
      title: '我的发布' + ' ' + this.data.datalist.length,

      dataList: this.data.datalist
    }, {
      title: '我的收藏' + ' ' + this.data.datalist1.length,
      dataList: this.data.datalist1,
    }]
    this.setData({
      tabs: tabs
    })
    console.log(tabs)
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
    var that = this
    if (!wx.getStorageSync('isLogin')) {
      wx.getUserInfo({
        success: res => {
          that.setData({
            avatar: res.userInfo.avatarUrl,
            nickName: "请点击头像进行登录"
          })
        }
      })
    } else {
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

          that.setData({
            avatar: avatar,
            nickName: nickName
          })
        })
      })
    }

  },

  onPullDownRefresh: function () {
    this.setData({
      datalist: []
    })
    this.getdataList(4, 0, this.data.openid)
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