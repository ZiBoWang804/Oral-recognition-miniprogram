
// 微信云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  try {
    const { _id } = event
    
    if (!_id) {
      return {
        code: 400,
        message: '缺少_id参数'
      }
    }

    // 获取数据库引用
    const db = cloud.database()
    
    // 查询Child表中指定_id的记录
    const result = await db.collection('Child')
      .where({
        _id: _id
      })
      .get()
    
    // 判断是否有结果
    if (result.data && result.data.length > 0) {
      return _id
    } else {
      return -1
    }
  } catch (err) {
    console.error('查询出错:', err)
    return {
      code: 500,
      message: '服务器内部错误'
    }
  }
}