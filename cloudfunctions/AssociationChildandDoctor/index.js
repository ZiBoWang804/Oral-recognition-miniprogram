// 云函数入口文件
const cloud = require('wx-server-sdk')
const cloudbase = require("@cloudbase/node-sdk")


cloud.init({
  env: "test-9gtawg6paf1c6ec1",
})
const app = cloudbase.init({
  env: "test-9gtawg6paf1c6ec1",
}); // 使用当前云环境

exports.main = async (event, context) => {
  const models = app.models;
  const {data} = await models.Child.update({
    data:{
      DtoC:{
        _id:event.DoctorID,
      },
    },
    filter: {
      where: {
        _id:{
          $eq:event.ChirdID
          },
        },
      },
  })
  return data
}