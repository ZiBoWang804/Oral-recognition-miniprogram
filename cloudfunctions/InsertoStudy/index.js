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
  const {data} = await models.Study.create({
    data:{
      yczk:event.yczk,
      kqzk:event.kqzk,
      ryqcsl:event.ryqcsl,
      hyqcsl:event.hyqcsl,
      ryqysl:event.ryqysl,
      rycgcgsl:event.rycgcgsl,
      jxbc:event.jxbc,
      dbrysl:event.dbrysl,
      ylqk:event.ylqk,
      qtqk:event.qtqk,
      bcjy:event.bcjy,
      photo_url:event.photo_url,
      CtoS:{
        _id:event.CtoS,
      },
    }
  });
}