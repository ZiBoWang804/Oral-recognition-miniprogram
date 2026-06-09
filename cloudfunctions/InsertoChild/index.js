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
  const {data} = await models.Child.create({
    data:{
      child_name:event.child_name,
      child_age:event.child_age,
      child_Gender:event.child_Gender,
      status_child:event.status_child,
      only_child:event.only_child,
      relation:event.relation,
      phtotopath:event.phtotopath,
      GtoC:{
        _id:event.GtoC,
      }
    },
  });
}