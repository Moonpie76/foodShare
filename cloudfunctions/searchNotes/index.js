// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var keyword = event.keyword
  return await db.collection('note').where({
    title: db.RegExp({
    regexp: keyword,
    options: 'i',
    })
  }).get()
}