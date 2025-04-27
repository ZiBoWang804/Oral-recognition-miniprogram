
// pages/Inspection/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoPath: '', // 存储拍照后的图片路径
    decay: '',      // 蛀牙情况
    missing: '',    // 缺失情况
    filling: '',    // 充填情况
    primary_incisor1: '', // 乳切牙1
    primary_incisor2: '', // 乳切牙2
    primary_incisor3: '', // 乳切牙3
    primary_incisor4: '', // 乳切牙4
    cariostat: ''   // Cariostat检测
  },

  // 表单提交
  formSubmit: function(e) {
    const formData = e.detail.value
    console.log('表单数据:', formData)
    // 合并拍照数据
    const submitData = {
      ...formData,
      photo: this.data.photoPath
    }
    console.log('提交数据:', submitData)
    // 这里可以添加表单数据提交逻辑
  },

  // 拍照功能
  takePhoto: function() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          photoPath: tempFilePaths[0]
        })
      }
    })
  },

  // 完成检查
  completeInspection: function() {
    wx.switchTab({
      url: './../List/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})