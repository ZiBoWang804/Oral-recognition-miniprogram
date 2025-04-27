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
  const {data} = await models.Child.list({
    filter:{
      where:{},
    },
    pageSize:200,
    pageNumber:1,
    getCount:true
  }) 
  for(var i = 0;i<data.records.length;i++){
    if (data.records[i].child_Gender == '1'){
      data.records[i].child_Gender = '男'
    }else if(data.records[i].child_Gender == '2'){
      data.records[i].child_Gender = '女'
    }

    if (data.records[i].only_child == '1'){
      data.records[i].only_child = '独生子女'
    }else if(data.records[i].only_child == '2'){
      data.records[i].only_child = '非独生子女'
    }

    if (data.records[i].status_child == '1'){
      data.records[i].status_child = '婚生子女'
    }else if(data.records[i].status_child == '3'){
      data.records[i].status_child = '养子女'
    }else if(data.records[i].status_child == '4'){
      data.records[i].status_child = '继子女'
    }

  }
  return data
}