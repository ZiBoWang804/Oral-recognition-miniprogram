// pages/Home/index.js
Page({

  /**
   * 页面的初始数据
   */

  /**
   * 页面的初始数据
   */
  data: {
    imageLoading: true
  },


  toSignIn(){
    wx.cloud.callFunction({
      name: 'cloudbase_module',
      data: {
        name: 'wx_user_get_open_id',
      },
      success: (res) => {
        const openId = res.result?.openId;
        wx.cloud.callFunction({
          name:'queryData',
          data:{
            openID:openId
          }
        }).then(res =>{
          wx.setStorageSync('OpenID', openId)
          wx.setStorageSync('Type', res.result.data.Type)
          wx.setStorageSync('Name', res.result.data.Name)
          if(res.result.data.Type == null){
            wx.navigateTo({
              url: './../sign-in/index',
            })
          }
          else{
            wx.switchTab({
              url: './../UserCenter/index',
            })
          }
        })
      },
    });
  },

/*
  toConnect(){
    wx.startWifi({
      success(res){
        wx.connectWifi({
          SSID: 'SDYFY-free',
          password: '',
          maunal:true,
          success:(res) => {console.log('连接成功')},
          fail:(res) => {console.log('连接失败')}
        })
      }
    })
  },
*/
  onImageLoad() {
    this.setData({
      imageLoading: false
    })
  },

  onImageError(e) {
    console.error('图片加载失败', e)
    wx.showToast({
      title: '图片加载失败',
      icon: 'none'
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