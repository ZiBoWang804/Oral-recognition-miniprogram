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
    const data_1 = await models.User.create({
      data: {
          openID: event.openID,  // openID
          Gender: event.Gender,  // Sex
          Name: event.Name,  // Name
          Type: event.Type,  // Type
          Age: event.Age,  // age
          PhoneNumber: event.phoneNumber,
        },
    })
    const data_2 = await models.Guardian.create({
      data: {
        Address: event.Address,
        Aera: event.Aera,
        study: event.study,
        Income: event.Income,
        UtoG:{
          _id:data_1.data.Id,
        },  
      },
    });
    return String(1)
  }