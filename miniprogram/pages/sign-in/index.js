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
    Name:'',
    Age:'',
    Address:'',
    Income:''
  },

  onInInput:function (e) {
    this.setData({
      Income:e.detail.value
    })
  },

  onHomeInput:function (e) {
    this.setData({
      Address: e.detail.value
    })
  },

  onNameInput:function (e) {
    this.setData({
      Name:e.detail.value
    })
  },

  onAgeInput:function (e) {
    this.setData({
      Age:e.detail.value
    })
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

  onGetPhoneNumber(e) {
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
        this.setData({
          setphoneNumber:phoneInfo.purePhoneNumber
        })
      },
    });
  },

  signIn(){

    if (this.data.selectregion == '男'){
      this.data.selectregion = '1'
    } else if (this.data.selectregion == '女'){
      this.data.selectregion = '2'
    }
    const Aera = this.data.selectregion.join()

    wx.cloud.callFunction({
      name:"createUser",
      data:{
        openID:wx.getStorageSync('OpenID'),
        Gender:this.data.selectgender,
        Name:this.data.Name,
        Age:this.data.Age,
        Type:'1',
        phoneNumber:this.data.setphoneNumber,
        Aera:Aera,
        study:this.data.selectedbc,
        Address:this.data.Address,
        Income:this.data.Income
      }
    }).then(res =>{
      wx.cloud.callFunction({
        name:'queryData',
        data:{
          openID:wx.getStorageSync('OpenID')
        }
      }).then(res =>{
        wx.setStorageSync('Type', res.result.data.Type)
        wx.setStorageSync('Name', res.result.data.Name)
        wx.switchTab({
          url: './../UserCenter/index',
        })
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