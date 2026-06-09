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

  const {data_User} = await models.User.update({
    data:{
      Age:event.Age,
      Gender:event.Gender,
      Name:event.Name,
    },
    filter: {
      where: {
        _id:{
          $eq:event._id
          },
        },
      },
  })

  const {User} = await models.User.get({
    data:{
      UtoG:{
        _id:true,
      },
    },
    filter: {
      where: {
        _id:{
          $eq:event._id
          },
        },
      },
  })

  const {User} = await models.User.update({
    data:{
      Address:event.Address,
      Aera:event.Aera,
      study:event.study,
      Income:event.Income,
    },
    filter: {
      where: {
        _id:{
          $eq:User.result.data.UtoG._id
          },
        },
      },
  })
}