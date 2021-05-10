// miniprogram/pages/sharepage.js
var util=require("../../util/util")
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      images:[],
      title:[],
      content:[],
      city:"",
      cityPickerValue: [0, 0],
      cityPickerIsShow: false,
      fileIDs:{},
      testa:[],
      testb:[],
      Astring:[],
      time:[],
      one_1: '',
      two_1: '',
      one_2: 0,
      two_2: 5
  },

/**
 返回函数
 */
fanhuiupload:function(e){
  var that=this;
  for(var i=0;i<that.data.images.length;i++){
    wx.cloud.uploadFile({
      cloudPath:'test1/' + Math.floor(Math.random()*1000000),
      filePath:that.data.images[i],
      success(res){
        console.log(res)
        console.log(e.currentTarget.id)
        console.log(res.fileID)
        that.setData({
        Astring:that.data.Astring.concat(JSON.stringify(res.fileID)), 
        });
        console.log(that.data.Astring[0])
      }
    })
    }
    this.getTime()
  //if(e.currentTarget.id="fanhui"){  
    wx.showModal({
      title: '退出当前编辑',
      content: '需要保存编辑吗？',
      showCancel: true,//是否显示取消按钮
      cancelText:"不保存",//默认是“取消”
      cancelColor:'skyblue',//取消文字的颜色
      confirmText:"保存",//默认是“确定”
      cancelColor: 'cancelColor',
      success: function (res) {
        if (res.confirm) {
             db.collection('note').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                title: that.data.title,
                discribe: that.data.content,
                picture:that.data.images,             
                time:that.data.time,
                level:that.data.one_2,
                flag:0
              }
            })
            .then(res => {
              console.log(res)
            })
            wx.switchTab({
              url: '/pages/index/index',
            });

         //this.uploaddata();
        } else{
          wx.switchTab({
            url: '/pages/index/index',
          });
        }}
    })
  

},



/**
评星函数 
 */
in_xin:function(e){
  var that=this
  var in_xin = e.currentTarget.dataset.in;
  var one_2;
  if (in_xin === 'use_sc2'){
    one_2 = Number(e.currentTarget.id);
  } else {
    one_2 = Number(e.currentTarget.id) + this.data.one_2;
  }
  this.setData({
    one_2: one_2,
    two_2: 5 - one_2
  })
  console.log(that.data.one_2)
},

/**
 预览图片
 */
previewpic:function(e){
  var that = this
  var index = e.currentTarget.dataset.index;
  wx.previewImage({
    current: that.data.images[index],
    urls: that.data.images,
  })
},
/**
跳出菜单删除图片或添加文字标签   
 */
delpicaddtip:function(e){
var that = this
var index = e.currentTarget.dataset.index;
var images = that.data.images;
console.log(index)
  wx.showActionSheet({
    itemList: ["删除图片"],
    success(res){
      console.log(res.tapIndex)
      if(res.tapIndex==0){
        images.splice(index, 1); //从数组中删除index下标位置，指定数量1，返回新的数组
        that.setData({
          images: images,
        });
      }
    }
  })

},
/**
 获取当前时间
 */
getTime:function(){
  var that=this;
  var TIME = util.formatTime(new Date());
  console.log(TIME)
  this.setData({
  time: TIME,
  });
  console.log(that.data.time)

},
  

/**
  上传内容
*/
uploaddata:function(e){
  var that=this;
  for(var i=0;i<that.data.images.length;i++){
    wx.cloud.uploadFile({
      cloudPath:'test1/' + Math.floor(Math.random()*1000000),
      filePath:that.data.images[i],
      success(res){
        console.log(res)
       
        console.log(e.currentTarget.id)
          console.log(res.fileID)
          that.setData({
         
          //Astring:that.data.Astring.concat(JSON.stringify(res.fileID)),
          
        });
        console.log(that.data.Astring[0])
      }
    })
    } 
    this.getTime()
  db.collection('note').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      title: that.data.title,
      discribe: that.data.content,
      picture:that.data.images,
      location:this.data.city,
      picture:that.data.images,
      time:that.data.time,
      level:that.data.one_2,
      flag:1
    }
  })
  .then(res => {
    console.log(res)
  })
  wx.switchTab({
    url: '/pages/index/index',
  });

 // console.log(that.data.testb)

 // console.log(picture)

},
/**
 获取当前位置
 */
/**
   * 城市选择确认
   */
  cityPickerOnSureClick: function (e) {
    console.log('cityPickerOnSureClick');
    console.log(e);
    var city = e.detail.valueName[1];
    city = city.substr(0, city.length-1);
    this.setData({
      city: city,
      cityPickerValue: e.detail.valueCode,
      cityPickerIsShow: false,
    });

  },
  /**
   * 城市选择取消
   */
  cityPickerOnCancelClick: function (event) {
    console.log('cityPickerOnCancelClick');
    console.log(event);
    this.setData({
      cityPickerIsShow: false,
    });
  },


  showCityPicker() {
    // this.data.cityPicker.show()
    console.log("show city-picker")
    this.setData({
      cityPickerIsShow: true,
    });
  },


/**
 获取标题内容
 */
  biaoti:function(e){
  var that=this;
  
  this.setData({
  title:e.detail.value,
})
console.log(that.data.title)
},

/**
 获取正文内容
 */
zhengwen:function(e) {
var that=this;
console.log(e.detail.value)
this.setData({
content:e.detail.value,
})
console.log(that.data.content)
},
  /**
   跳转到相册 
   */
  openalbum:function(){
    var _this=this

    wx.chooseImage({
      count: 9-_this.data.images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        if(_this.data.images.length<9){
        _this.setData({
          images:_this.data.images.concat(res.tempFilePaths)
         })}
         console.log(_this.data.images)
         if(_this.data.images.length>=9){
          var content="最多只能上传9张照片"
          wx.showModal({
            cancelColor: 'cancelColor',
            content:content
          })}
        
      }
    })
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