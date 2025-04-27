const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  const db = cloud.database()
  
  try {
    const res = await db.collection('children')
      .field({
        _id: true,
        name: true,
        age: true,
        gender: true,
        avatar: true
      })
      .get()
    
    return {
      code: 0,
      data: res.data
    }
  } catch (err) {
    return {
      code: -1,
      message: '获取儿童列表失败'
    }
  }
}