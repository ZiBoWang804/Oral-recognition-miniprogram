
// 微信云函数入口文件
const cloud = require('wx-server-sdk')
const cloudbase = require("@cloudbase/node-sdk")

cloud.init({
  env: "test-9gtawg6paf1c6ec1",
})
const app = cloudbase.init({
  env: "test-9gtawg6paf1c6ec1",
}); // 使用当前云环境

exports.main = async (event, context) => {
    // 获取数据库引用
    const models = app.models;
    const data = await models.Child.get({
      select:{
        _id:true,
      },
      filter:{
        where:{
          openID:{
            $eq: event._id,
          }
        }
      }
    }) 
    // 判断是否有结果
    if (result.data && result.data.length > 0) {
      return _id
    } else {
      return -1
    }
  } 