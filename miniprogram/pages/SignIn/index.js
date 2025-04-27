// pages/SignIn/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Name:'',
    columns:["未选择","男","女"],
    gender:0,
    Age:0,
    DrSign:'',
    phoneNumber:''
    },

  pickGender(e){
    this.setData({
      gender: e.detail.value 
    });
    wx.setStorageSync('Gender', this.data.gender)
  },

  getName(e){
    this.setData({
      Name: e.detail.value 
    })
    wx.setStorageSync('Name', this.data.Name)
  },

  getAge(e){
    this.setData({
      Age: e.detail.value 
    })
    wx.setStorageSync('Age', this.data.Age)
  },

  getDrSign(e){
    this.setData({
      DrSign: e.detail.value 
    })
    wx.setStorageSync('DrSign', this.data.DrSign)
  },

  getphoneNumber_hand(event){
    this.setData({
      phoneNumber:event.detail.value
    })
    wx.setStorageSync('phoneNumber', event.detail.value)
  },

  onGetPhoneNumber(e) {
    console.log(e.detail.code); // 动态令牌
    wx.cloud.callFunction({
      name: 'cloudbase_module',
      data: {
        name: 'wx_user_get_phone_number',
        data: {
          code: e.detail.code,
        },
      },
      success: (res) => {
        const phoneInfo = res.result?.phoneInfo;
        console.log('获取到的手机号信息: ', phoneInfo);
        this.setData({
          phoneNumber:phoneInfo.purePhoneNumber
        })
        wx.setStorageSync('phoneNumber', phoneInfo.purePhoneNumber)
      },
    });
  },

  signIn(){
    wx.cloud.callFunction({
      name:"createUser",
      data:{
        openID:wx.getStorageSync('OpenID'),
        Gender:wx.getStorageSync('Gender'),
        Name:wx.getStorageSync('Name'),
        Age:wx.getStorageSync('Age'),
        phoneNumber:wx.getStorageSync('phoneNumber'),
        Dr_Sign:wx.getStorageSync('DrSign'),
      }
    }).then(res =>{
      wx.setStorageSync('Type', res.result)
      wx.switchTab({
        url: './../UserCenter/index',
      })
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