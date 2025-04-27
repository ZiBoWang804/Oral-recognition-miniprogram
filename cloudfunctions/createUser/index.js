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
  let Gender = '';
  blankValues = [undefined,null,'',NaN]
  if(event.Gender == '1'){
    Gender = '男'
  }else if (event.Gender == '2'){
    Gender = '女'
  }
  if(blankValues.includes(event.Dr_Sign)){
    const data_1 = await models.User.create({
      data: {
          openID: event.openID,  // openID
          Gender: Gender,  // Sex
          Name: event.Name,  // Name
          Type: "1",  // Type
          age: event.Age,  // age
          PhoneNumber: event.phoneNumber,
          //Address:event.Address,
          //area:event.Area
        },
    })
    const data_2 = await models.Guardian.create({
      data: {
        UtoG:{
          _id:data_1.data.Id,
        },  
      },
    });
    return String(1)
  }else{
    const data_1 = await models.User.create({
      data: {
          openID: event.openID,  // openID
          Gender: Gender,  // Sex
          Name: event.Name,  // Name
          Type: "3",  // Type
          age: event.Age,  // age
          PhoneNumber: event.phoneNumber,
          //Address:event.Address,
          //area:event.Area
        },
    })
    const data_2 = await models.Doctor.create({
      data: {
        UtoD:{
          _id:data_1.data.Id,
        },
        Dr_Sign:event.Dr_Sign
      },
    });
    return String(3)
  }
}