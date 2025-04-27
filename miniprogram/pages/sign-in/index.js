// pages/sign-in/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gendersindex:0,
    edbcindex:0,
    genders:['男','女'],
    edbc:['小学','初中','中专','高中','专科','本科','硕士研究生','博士研究生','无教育经历'],
    selectgender:'',
    selectedbc:'',
    selectregion:['请选择籍贯'],
    setphoneNumber:'未获取',
    code:'',
    encryptedData:'',
    iv:''
  },

  onEdbcChange:function (e) {
    this.setData({
      selectedbc : this.data.edbc[e.detail.value]
    })
  },

  onGenderChange(e){
    this.setData({
      selectgender : this.data.genders[e.detail.value]
    })
  },

  onRegionChange(e){
    this.setData({
      selectregion : e.detail.value
    })
  },

  onGetPhoneNumber(e){
    console.log(e)
    this.setData({
       code : e.detail.code,
       encryptedData:e.detail.encryptedData,
       iv:e.detail.iv
       //此处要写一个云函数处理加密信息获取手机号并set给setphoneNumber
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