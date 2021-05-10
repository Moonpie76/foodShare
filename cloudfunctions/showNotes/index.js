// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  var num = event.num
  var page = event.page
  const city = event.city
  r_data = await db.collection("note").where({
    location: "天津"
  }).orderBy("time", "desc").limit(num).skip(page).get()
  return r_data
}