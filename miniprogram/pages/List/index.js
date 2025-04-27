// pages/List/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    child_name:'',
    child_age:1,
    child_gender:'',
    child_status:'',
    child_only:'',
    total:1,
    scanResult:''
  },
  name(event) { //获取儿童姓名
    const child_name = event.detail.value
    this.setData({
      child_name:child_name
    })
  },
  phone(event) { //获取年龄
    const child_age = event.detail.value
    if((child_age) > 0 || (child_age < 19)){
      this.setData({
        child_age:child_age
      })
    }else{
      wx.showToast({
        title: '年龄超限，请确认',
        icon:'none'
      })
    }
  },
  product(event) { //获取性别
    const child_gender = event.detail.value
    if (child_gender == '男'){
      this.setData({
        child_gender:'1'
      })
    }else{
      this.setData({
        child_gender:'2'
      })
    }
  },
  type(event) { //获取儿童情况
    const child_status = event.detail.value
    if (event.detail.value == '婚生子女'){
      this.setData({
        child_status:'1'
      })
    }else if(event.detail.value == '养子女'){
      this.setData({
        child_status:'3'
      })
    }else if(event.detail.value == '继子女'){
      this.setData({
        child_status:'4'
      })
    }
  },
  address(event) { //获取儿童独生情况
    if (event.detail.value == '独生子女'){
      this.setData({
        child_only:'1'
      })
    }else{
      this.setData({
        child_only:'2'
      })
    }
  },

  scanCode(){
    wx.scanCode({
      success:(res) => {
        wx.setStorageSync('scanResult', res.result)
        wx.cloud.callFunction({
          name:"checkDoctorID",
          data:{
            scanResult: wx.getStorageSync('scanResult')
          }
        }).then(res => {
            wx.cloud.callFunction({
              name:"getDoctorID",
              data:{
                Doctor_openID:wx.getStorageSync('OpenID')
              }
            }).then(res =>{
              wx.cloud.callFunction({
                name:"searchChildbyid",
                data:{
                  _id:scanResult
                }
            }).then(res =>{
              if (res.result == -1){
                wx.showToast({
                  title: '未查询到儿童，请联系监护人添加该儿童',
                  icon:'none'
                })
              }
            }).then(res =>{
              wx.setStorageSync('DoctorID', res.result.data.UtoD._id)
              wx.cloud.callFunction({
                name:"AssociationChildandDoctor",
                 data:{
                  DoctorID:wx.getStorageSync('DoctorID'),
                  GuardianID:wx.getStorageSync('scanResult'),
                }
              }).then(res => {
                if (res.result){
                  wx.showToast({
                    title: '添加成功',
                    icon:'none'
                  })
                }
              })
            })
          })
        })
      }
    })
  },

  update: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },

  fetchData: function() {
    wx.cloud.callFunction({
      name: 'getChildList', // 云函数名，对应上面创建的云函数
      success: res => {
        var child_list_1 = []
        console.log(res)
        for(var i = 0;i<res.result.records.length;i++){
          child_list_1.push(res.result.records[i])
        }
        this.setData({
          child_list:child_list_1
        })
        console.log(this.data.child_list)
      },
    })
  },

  toDetail(event){
    let location = event.currentTarget.dataset.location
    wx.setStorageSync('pageIndex', location),
    wx.navigateTo({
      url: './../Detail/index',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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

  },

  onShow() {
    this.updateTabBar();
  },
  
  updateTabBar() {
    if (typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar();
      tabBar.updateTabBar();
    }
  }
})
