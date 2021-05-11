// miniprogram/pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteList: [],
    // 模糊查询时长
    timer: 0,
    // 点击结果项之后替换到文本框的值
    inputValue: '',
    // 是否隐藏模糊查询的面板
    hideScroll: true,
    // 历史查询记录
    historySearch: wx.getStorageSync('historySearch') || [],
    // 模糊查询结果
    searchTip: []
  },

  getInf(str, key) {
    return str
      .replace(new RegExp(`${key}`, 'g'), `%%${key}%%`)
      .split('%%')
      .filter(item => {
        if (item) {
          return true
        }
        return false
      })
  },
  onInput(e) {
    var that = this
    const inputValue = e.detail.value
    clearTimeout(that.data.timer)
    let timer = setTimeout(() => {
      if (inputValue) {
        wx.request({
          url: 'https://home.meishichina.com/ajax/ajax.php?ac=commondata&op=searchTips&q=' + inputValue + '',
          data: {},
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
          // success 
            var tips = new Array()
            const  rTips = res.data.data
            for(var i=0;i < rTips.length; i++) {
              tips.push(rTips[i])
            }
            if(tips.indexOf('[')!=-1) {
              tips.splice(tips.indexOf('['),1)
            }
            if(tips.indexOf(']')!=-1) {
              tips.splice(tips.indexOf(']'),1)
            }
            if(tips.length != 0) {
              if(tips.indexOf(inputValue)==-1) {
                tips.unshift(inputValue)
              }
            } else {
              tips.push(inputValue)
            }
            const newTips = tips.map(item => {
              const tip = item
              const newTip = that.getInf(tip, inputValue)
              return newTip
          })
            that.setData({
              inputValue: inputValue,
              searchTip: newTips,
              hideScroll: false
            })
            return
          }
        })
      }
      // 如果为空，则收起
      that.setData({
        searchTip: [],
        hideScroll: true,
        inputValue: ''
      })
    }, 600)

    that.data.timer = timer
  },
  itemtap(e) {
    const { info } = e.currentTarget.dataset
    console.log(info.join(''))
    this.setData({
      // 将点击选择的值展示在input框中
      inputValue: info.join(''),
      // 当用户选择某个联想词，隐藏下拉列表
      hideScroll: true
    })
    this.addHistorySearch(this.data.inputValue)
    // 发起请求，获取查询结果
    this.searchByKeyWord(this.data.inputValue)
  },
  searchByKeyWord(info) {
    wx.cloud.callFunction({
      name: "searchNotes",
      data: {
        keyword: info
      }
    }).then(res=>{
      console.log(res)
    })
  },
  addHistorySearch(value) {
    const historySearch = wx.getStorageSync('historySearch') || []

    // 是否有重复的历史记录
    let has = false
    for (let history of historySearch) {
      const content  = history
      if (value === content) {
        has = true
        break
      }
    }
    if (has) {
      return
    }
    const len = historySearch.length
    if (len >= 16) {
      historySearch.pop()
    }
    historySearch.unshift(value)
    wx.setStorage({
      key: 'historySearch',
      data: historySearch,
      success: () => {
        this.setData({ historySearch: historySearch })
      }
    })
  },

  search: function (e) {
     
  },
  searchHistory: function(e) {
    const info = e.currentTarget.dataset
    console.log(info.info)
    this.searchByKeyWord(info.info)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      historySearch: wx.getStorageSync('historySearch')
    })
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