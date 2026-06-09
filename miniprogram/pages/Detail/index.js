// pages/Detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id:'',
    child:{
      name:'',
      age:'',
      gender:'',
      is_only_child:'',
      condition:'',
      phtotopath:'',
      relationship:'',
    },
    guardian:{
      name:'',
      phone:'',
      gender:'',
      age:'',
      income:'',
      education:'',
      hometown:'',
      address:'',
    },
    inspection:{
      yczk:'',
      kqzk:'',
      ryqcsl:'',
      hyqcsl:'',
      ryqysl:'',
      rycgcgsl:'',
      jxbc:'',
      dbrysl:'',
      ylqk:'',
      qtqk:'',
      bcjy:'',
      photo_url:'',
    },
    guardiannum:'',
    inspectionnum:''
  },

  getchildinfo(){
    wx.cloud.callFunction({
      name:'getchildinfo',
      data:{
        openID:wx.getStorageSync('pageIndex')
      }
    }).then(res =>{

      if (res.result.child_Gender == 1){
        res.result.child_Gender = '男'
      } else if (res.result.child_Gender == 2){
        res.result.child_Gender = '女'
      }

      if (res.result.only_child == 1){
        res.result.only_child = '独生子女'
      } else if (res.result.only_child == 2){
        res.result.only_child = '非独生子女'
      }

      if (res.result.status_child == 1){
        res.result.status_child = '婚生子女'
      } else if(res.result.status_child == 2){
        res.result.status_child = '非婚生子女'
      }else if(res.result.status_child == 3){
        res.result.status_child = '养子女'
      } else if(res.result.status_child == 4){
        res.result.status_child = '继子女'
      }

      if (res.result.relation == 1){
        res.result.relation = '父亲'
      } else if(res.result.relation == 2){
        res.result.relation = '母亲'
      }else if(res.result.relation == 3){
        res.result.relation = '祖父'
      } else if(res.result.relation == 4){
        res.result.relation = '祖母'
      } else if(res.result.relation == 5){
        res.result.relation = '外祖父'
      } else if(res.result.relation == 6){
        res.result.relation = '外祖母'
      } else if(res.result.relation == 7){
        res.result.relation = '继父'
      } else if(res.result.relation == 8){
        res.result.relation = '继母'
      } else if(res.result.relation == 9){
        res.result.relation = '养父'
      } else if(res.result.relation == 10){
        res.result.relation = '养母'
      } else if(res.result.relation == 11){
        res.result.relation = '继祖父'
      } else if(res.result.relation == 12){
        res.result.relation = '继祖母'
      } else if(res.result.relation == 13){
        res.result.relation = '养祖父'
      } else if(res.result.relation == 14){
        res.result.relation = '养祖母'
      } else if(res.result.relation == 15){
        res.result.relation = '继外祖父'
      } else if(res.result.relation == 16){
        res.result.relation = '继外祖母'
      } else if(res.result.relation == 17){
        res.result.relation = '养外祖父'
      } else if(res.result.relation == 18){
        res.result.relation = '养外祖母'
      }

      if (res.result.GtoC.study == 1){
        res.result.GtoC.study = '小学'
      } else if(res.result.GtoC.study == 2){
        res.result.GtoC.study = '初中'
      }else if(res.result.GtoC.study == 3){
        res.result.GtoC.study = '中专'
      } else if(res.result.GtoC.study == 4){
        res.result.GtoC.study = '高中'
      }else if(res.result.GtoC.study == 5){
        res.result.GtoC.study = '专科'
      }else if(res.result.GtoC.study == 6){
        res.result.GtoC.study = '本科'
      }else if(res.result.GtoC.study == 7){
        res.result.GtoC.study = '硕士研究生'
      }else if(res.result.GtoC.study == 8){
        res.result.GtoC.study = '博士研究生'
      }else if(res.result.GtoC.study == 9){
        res.result.GtoC.study = '无教育经历'
      }

      
      this.setData({
        'child.name':res.result.child_name,
        'child.age':res.result.child_age,
        'child.gender':res.result.child_Gender,
        'child.is_only_child':res.result.only_child,
        'child.condition':res.result.status_child,
        'child.phtotopath':res.result.phtotopath,
        'child.relationship':res.result.relation,
      })
    })
  },

  getGinfo(){
    wx.cloud.callFunction({
      name:'getGinfo',
      data:{
        openID:this.data._id,
      }
    }).then(res =>{
      this.setData({
        'guardian.name':res.result.UtoG.Name,
        'guardian.phone':res.result.UtoG.PhoneNumber,
        'guardian.gender':res.result.UtoG.Gender,
        'guardian.age':res.result.UtoG.Age,
      })
    })
  },
  
  getSinfo(){
    wx.cloud.callFunction({
      name:'getStudy',
      data:{
        openID:wx.getStorageSync('pageIndex')
      }
    }).then(res =>{
      this.setData({
        'inspection.yczk':res.result.CtoS.yczk,
        'inspection.kqzk':res.result.CtoS.kqzk,
        'inspection.ryqcsl':res.result.CtoS.ryqcsl,
        'inspection.hyqcsl':res.result.CtoS.hyqcsl,
        'inspection.ryqysl':res.result.CtoS.ryqysl,
        'inspection.rycgcgsl':res.result.CtoS.rycgcgsl,
        'inspection.jxbc':res.result.CtoS.jxbc,
        'inspection.dbrysl':res.result.CtoS.dbrysl,
        'inspection.ylqk':res.result.CtoS.ylqk,
        'inspection.qtqk':res.result.CtoS.qtqk,
        'inspection.bcjy':res.result.CtoS.bcjy,
        'inspection.photo_url':res.result.CtoS.photo_url
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      _id : wx.getStorageSync('pageIndex'),
    })
    this.getchildinfo()
    this.getSinfo()
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
    wx.removeStorageSync('pageIndex')
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

  /**
   * 跳转到检查页面
   */
  navigateToInspection() {
    wx.setStorageSync('child',this.data._id)
    wx.navigateTo({
      url: '/pages/Inspection/index'
    })
  },

  /**
   * 预览儿童照片
   */
  previewChildPhoto() {
    if (this.data.child.phtotopath) {
      wx.previewImage({
        urls: [this.data.child.phtotopath],
        current: this.data.child.phtotopath
      })
    }
  },

  /**
   * 预览口腔照片
   */
  previewToothPhoto() {
    if (this.data.inspection.photo_url) {
      wx.previewImage({
        urls: [this.data.inspection.photo_url],
        current: this.data.inspection.photo_url
      })
    }
  }
})