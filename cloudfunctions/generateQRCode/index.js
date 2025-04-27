const cloud = require('wx-server-sdk')
cloud.init()
const qrcode = require('qrcode')

exports.main = async (event, context) => {
  try {
    // 生成二维码图片
    const qrCodeData = await qrcode.toDataURL(event.text, {
      width: event.width || 200,
      margin: 1
    })
    
    // 上传到云存储
    const fileStream = Buffer.from(qrCodeData.split(',')[1], 'base64')
    const upload = await cloud.uploadFile({
      cloudPath: `qrcodes/${Date.now()}.png`,
      fileContent: fileStream
    })
    
    return {
      code: 0,
      fileID: upload.fileID
    }
  } catch (err) {
    return {
      code: -1,
      message: err.message
    }
  }
}