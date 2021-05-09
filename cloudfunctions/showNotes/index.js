// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // var num = event.num
  // var page = event.page
  // var city = event.city
  const {
    num,
    page,
    city
  } = event;
  r_data = await db.collection("note").where({
    post_location: "天津"
  }).orderBy("post_time", "desc").limit(num).skip(page).get()
  return r_data
}
