
// pages/Inspection/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photopath:'',
    tempPath:'',// 临时路径
    imageLoaded: false,
    // 牙齿状况选项
    yczkOptions: ['没有异常，值得鼓励，请继续保持口腔卫生!', '有异常，需要进一步医院就诊!'],
    yczkIndex: -1,
    // 口腔状况选项
    kqzkOptions: ['口腔卫生良好', '口腔卫生一般', '口腔卫生差（建议学习正确刷牙方法）'],
    kqzkIndex: -1,
    // 牙列情况选项
    ylqkOptions: ['个别牙反合', '地包天', '咬合异常 （后牙反合、锁合等）', '口腔不良习惯（吮指、口呼吸、吐舌、咬下唇、偏侧咀嚼等）'],
    ylqkIndex: -1,
    // 其他情况选项
    qtqkOptions: ['多生牙', '牙齿发育异常', '口腔粘膜异常', '牙齿萌出异常'],
    qtqkIndex: -1,
    //建议选项
    bcjyOptions: ['需要就诊进一步检查和治疗', '需要尽早矫治', '需要尽早咨询和定期检查', '每3～6个月口腔检查一次，每天饭后刷牙3次，每次3分钟'],
    bcjyIndex: -1,
    // 间隙保持选项
    jxbcOptions: ['是', '否'],
    jxbcIndex: -1,
    
    yczk: '',      // 牙齿状况
    kqzk: '',    // 口腔状况
    ryqcsl: '',    // 乳牙龋齿数量
    hyqcsl: '', // 恒牙龋齿数量
    ryqysl: '', // 乳牙缺牙数量
    rycgcgsl: '', // 乳牙残根/残冠数量
    jxbc: '', // 需做间隙保持
    dbrysl: '',   // 待拔乳牙数量
    ylqk: '',   // 牙列情况
    qtqk: '',   // 其他情况
    bcjy: '',   // 保持建议
  },

  handleyczkChange:function (e) {
    this.setData({
      yczk: this.data.yczkOptions[e.detail.value],
      yczkIndex: e.detail.value
    })
  },

  handlekqzkChange:function (e) {
    this.setData({
      kqzk: this.data.kqzkOptions[e.detail.value],
      kqzkIndex: e.detail.value
    })
  },

  handleryqcslChange:function (e) {
    this.setData({
      ryqcsl:e.detail.value
    })
  },

  handlehyqcslChange:function (e) {
    this.setData({
      hyqcsl:e.detail.value
    })
  },

  handleryqyslChange:function (e) {
    this.setData({
      ryqysl:e.detail.value
    })
  },

  handlerycgcgslChange:function (e) {
    this.setData({
      rycgcgsl:e.detail.value
    })
  },

  handlejxbcChange:function (e) {
    this.setData({
      jxbc: this.data.jxbcOptions[e.detail.value],
      jxbcIndex: e.detail.value
    })
  },

  handledbryslChange:function (e) {
    this.setData({
      dbrysl:e.detail.value
    })
  },

  handleylqkChange:function (e) {
    this.setData({
      ylqk: this.data.ylqkOptions[e.detail.value],
      ylqkIndex: e.detail.value
    })
  },

  handleqtqkChange:function (e) {
    this.setData({
      qtqk: this.data.qtqkOptions[e.detail.value],
      qtqkIndex: e.detail.value
    })
  },

  handlebcjyChange:function (e) {
    this.setData({
      bcjy: this.data.bcjyOptions[e.detail.value],
      bcjyIndex: e.detail.value
    })
  },

  handlePhotoChange:function (e) {
    this.setData({
      photopath:'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/检查图像/' + wx.getStorageSync('child') +'.png'
    })
  },

  // 表单提交
  formSubmit: function(e) {
    // 这里可以添加表单数据提交逻辑
    //加云函数
    wx.cloud.callFunction({
      name:"InsertoStudy",
       data:{
        yczk:this.data.yczk,
        kqzk:this.data.kqzk,
        ryqcsl:this.data.ryqcsl,
        hyqcsl:this.data.hyqcsl,
        ryqysl:this.data.ryqysl,
        rycgcgsl:this.data.rycgcgsl,
        jxbc:this.data.jxbc,
        dbrysl:this.data.dbrysl,
        ylqk:this.data.ylqk,
        qtqk:this.data.qtqk,
        bcjy:this.data.bcjy,
        photo_url:this.data.photopath,
        CtoS:wx.getStorageSync('child')
      }
    })
  },
  

  // 图片加载成功
  imageLoad: function() {
    this.setData({
      imageLoaded: true
    });
  },

  // 图片加载失败
  imageError: function() {
    this.setData({
      imageLoaded: false
    });
    wx.showToast({
      title: '图片加载失败',
      icon: 'none'
    });
  },

  // 预览图片
  previewImage: function() {
    if (this.data.tempPath) {
      wx.previewImage({
        urls: [this.data.tempPath],
        current: this.data.tempPath
      });
    }
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
          tempPath: tempFilePaths[0],
        })
        wx.cloud.uploadFile({
          cloudPath:'检查图像/' + wx.getStorageSync('child') + '.png',
          filePath:that.data.tempPath
        })
        that.handlePhotoChange()
      }
    })
  },


  // 完成检查
  completeInspection: function() {
    this.formSubmit()
    wx.switchTab({
      url: './../List/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 如果已有选中值，设置对应的index
    const that = this;
    if (that.data.yczk) {
      const index = that.data.yczkOptions.findIndex(item => item === that.data.yczk);
      if (index !== -1) {
        that.setData({ yczkIndex: index });
      }
    }
    if (that.data.kqzk) {
      const index = that.data.kqzkOptions.findIndex(item => item === that.data.kqzk);
      if (index !== -1) {
        that.setData({ kqzkIndex: index });
      }
    }
    if (that.data.jxbc) {
      const index = that.data.jxbcOptions.findIndex(item => item === that.data.jxbc);
      if (index !== -1) {
        that.setData({ jxbcIndex: index });
      }
    }
    if (that.data.ylqk) {
      const index = that.data.ylqkOptions.findIndex(item => item === that.data.ylqk);
      if (index !== -1) {
        that.setData({ ylqkIndex: index });
      }
    }
    if (that.data.qtqk) {
      const index = that.data.qtqkOptions.findIndex(item => item === that.data.qtqk);
      if (index !== -1) {
        that.setData({ qtqkIndex: index });
      }
    }
    if (that.data.bcjy) {
      const index = that.data.bcjyOptions.findIndex(item => item === that.data.bcjy);
      if (index !== -1) {
        that.setData({ bcjyIndex: index });
      }
    }
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
    wx.removeStorageSync('child')
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