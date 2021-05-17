// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    var user_id = event.user_id
    var note_id = event.note_id
    var collist = event.collist.splice(event.collist.findIndex(function (d) {
        return d == note_id;
    }, 1))
    console.log("collist" + collist)
    var user_add_id
    var note_add_num
    try {
        user_add_id = await db.collection('user').doc(user_id).update({
            data: {
                myCollections: collist
            }
        })
        note_add_num = await db.collection('note').doc(note_id).update({
            data: {
                collection_num: collection_num - 1
            }
        })
    } catch (e) {
        console.error(e)
    }
    return {
        user_add_id: user_add_id,
        note_add_num: note_add_num
    }
}