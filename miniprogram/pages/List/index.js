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
    scanResult:'',
    Doctor_openID:'',
    photoUrl:''
  },
 
 getDoctorID(){
  wx.cloud.callFunction({
    name: "getDoctorID",
    data: {
      Doctor_openID: wx.getStorageSync('OpenID')
    }
  }).then(res => {
    this.setData({
      Doctor_openID:res.result.data.UtoD._id,
    }
    )
  })
 },

  async scanCode() {
    try {
      // 扫描二维码
      const scanRes = await wx.scanCode();
      const scanResult = scanRes.result;
      wx.setStorageSync('scanResult', scanResult);

      // 获取医生ID
      const doctorRes = await wx.cloud.callFunction({
        name: "getDoctorID",
        data: {
          Doctor_openID: wx.getStorageSync('OpenID')
        }
      });
      
      const doctorId = doctorRes.result.data.UtoD._id;
      wx.setStorageSync('DoctorID', doctorId);

      // 关联儿童和医生
      const associationRes = await wx.cloud.callFunction({
        name: "AssociationChildandDoctor",
        data: {
          DoctorID: wx.getStorageSync('DoctorID'),
          ChirdID: wx.getStorageSync('scanResult')
        }
      });
      console.log(associationRes)
      if (associationRes.result) {
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        });
        this.fetchData()
      } else {
        wx.showToast({
          title: '添加失败',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('扫码过程出错：', error);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'error'
      });
    }
  },

  update: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },

  
  fetchData: function() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: "getDoctorID",
        data: {
          Doctor_openID: wx.getStorageSync('OpenID')
        }
      })
      .then(res => {
        return wx.cloud.callFunction({
          name: 'getChildListbyD',
          data: {
            DoctorID: res.result.data.UtoD._id
          }
        });
      })
      .then(res => {
        const child_list_1 = [];
        for(let i = 0; i < res.result.DtoC.length; i++) {
          child_list_1.push(res.result.DtoC[i]);
        }
        this.setData({
          child_list: child_list_1
        });
        console.log('儿童列表已更新:', this.data.child_list);
        resolve();
      })
      .catch(err => {
        console.error('获取数据失败:', err);
        reject(err);
      });
    });
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
  /**
   * 页面加载时的生命周期函数
   * @param {Object} options 页面跳转所带来的参数
   * @description 页面加载时调用 fetchData 方法获取数据
   */
  onLoad(options) {
    //this.getDoctorID()
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
    wx.removeStorageSync('scanResult')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.fetchData()
      .then(() => {
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '刷新成功',
          icon: 'success',
          duration: 1000
        });
      })
      .catch(err => {
        console.error('刷新失败:', err);
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '刷新失败',
          icon: 'error',
          duration: 1000
        });
      });
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