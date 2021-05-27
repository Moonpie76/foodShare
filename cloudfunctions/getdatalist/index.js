// 云函数入口文件
const cloud = require('wx-server-sdk')



cloud.init()
const db = cloud.database()
<<<<<<< HEAD

=======
 
>>>>>>> e9b0c76528343633ac64173df7ea9e9ea2b443bc

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("note").where({
<<<<<<< HEAD
    _openid:event.openid
=======
    openid:event.openid
>>>>>>> e9b0c76528343633ac64173df7ea9e9ea2b443bc
  }).orderBy("time", "desc").get()
 }