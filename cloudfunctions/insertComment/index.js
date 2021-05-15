// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  return await db.collection('comment').add({
    data: {       
      comment_pr_id: event.comment_pr_id, //评论所属的日记id，从入口得到       
      comment_user_id:event.comment_user_id,//发表评论人的id，
      comment_user_name:event.comment_user_name,//发表评论人的姓名
      comment_user_profile:event.comment_user_profile,//发表评论人的头像
      comment_text: event.comment_text, //评论内容        
      comment_time: event.comment_time, //评论时间       
      reply_if: event.reply_if, //如果不是回复，则默认为0，如果为回复，则为1       
      parent_id: event.parent_id, //该条评论在哪条评论下面，默认为0，如果是回复评论，则为主评论的ID
      reply_name: event.reply_name //默认为'',如果为楼中楼，则为被回复的姓名
    }
  })
}