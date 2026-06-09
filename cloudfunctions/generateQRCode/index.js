const cloud = require('wx-server-sdk')
const QRCode = require('qrcode')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  try {
    // 获取生成二维码的参数
    const { text, width = 200 } = event
    
    // 生成二维码并返回base64格式
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: width,
      margin: 1
    })
    
    return {
      code: 0,
      data: qrCodeDataURL,
      message: '二维码生成成功'
    }
  } catch (err) {
    return {
      code: -1,
      message: '二维码生成失败: ' + err.message
    }
  }
}