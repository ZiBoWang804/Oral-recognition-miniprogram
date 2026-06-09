// pages/List/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    child_name: '',
    child_age: '',
    child_gender: '男',
    child_list: [],
    total: 1,
    genderArray: ['男', '女'],
    only_child:'独生子女',
    only_childArray: ['独生子女', '非独生子女'],
    status_child:'婚生子女',
    status_childArray:['婚生子女','非婚生子女','养子女','继子女'],
    relation:'父亲',
    relationArray:['父亲','母亲','祖父','祖母','外祖父','外祖母','继父','继母','养父','养母','继祖父','继祖母','养祖父','养祖母','继外祖父','继外祖母','养外祖父','养外祖母',],
    tempPhotoPath: '', // 临时图片路径
    cloudPhotoPath: '' // 云存储图片路径
  },

  // 显示添加儿童弹窗
  showAddChildModal() {
    this.setData({
      showModal: true
    })
  },

  // 选择图片
  async chooseImage() {
    try {
      const res = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back'
      })
      
      this.setData({
        tempPhotoPath: res.tempFiles[0].tempFilePath
      })
    } catch (err) {
      console.error('选择图片失败:', err)
    }
  },

  // 预览图片
  previewImage() {
    if (this.data.tempPhotoPath) {
      wx.previewImage({
        urls: [this.data.tempPhotoPath]
      })
    }
  },

  // 上传图片到云存储
  async uploadPhoto() {
    if (!this.data.tempPhotoPath) return ''
    
    try {
      const cloudPath = `child-photos/${Date.now()}-${Math.random().toString(36).slice(-6)}.${this.data.tempPhotoPath.match(/\.(\w+)$/)[1]}`
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath: this.data.tempPhotoPath
      })
      return res.fileID
    } catch (err) {
      console.error('上传图片失败:', err)
      throw err
    }
  },

  // 隐藏添加儿童弹窗
  hideAddChildModal() {
    this.setData({
      showModal: false,
      child_name: '',
      child_age: '',
      child_gender: '男',
      tempPhotoPath: '',
      cloudPhotoPath: '',
      only_child: '',
      status_child: '',
      relation: ''
    })
  },

  // 处理输入框变化
  onNameInput(e) {
    this.setData({
      child_name: e.detail.value
    })
  },

  onAgeInput(e) {
    const age = parseInt(e.detail.value);
    if (age > 18) {
      wx.showToast({
        title: '年龄不能超过18岁',
        icon: 'none'
      });
      this.setData({
        child_age: '18'
      });
    } else if (age < 0) {
      wx.showToast({
        title: '年龄不能小于0岁',
        icon: 'none'
      });
      this.setData({
        child_age: '0'
      });
    } else {
      this.setData({
        child_age: e.detail.value
      });
    }
  },

  // 处理性别选择
  onGenderChange(e) {
    this.setData({
      child_gender: this.data.genderArray[e.detail.value]
    })
  },

  onstatus_childChange(e) {
    this.setData({
      status_child: this.data.status_childArray[e.detail.value]
    })
  },

  onrelationChange(e) {
    this.setData({
      relation: this.data.relationArray[e.detail.value]
    })
  },

  onOnlyChange(e) {
    this.setData({
      only_child: this.data.only_childArray[e.detail.value]
    })
  },

  // 确认添加儿童
  async confirmAddChild() {
    let { child_name, child_age, child_gender, tempPhotoPath, only_child, status_child,
    relation} = this.data
    
    if (child_gender == '男'){
      child_gender = '1'
    } else if (child_gender == '女'){
      child_gender = '2'
    }

    if (only_child == '独生子女'){
      only_child = '1'
    } else if (only_child == '非独生子女'){
      only_child = '2'
    }

    if (status_child == '婚生子女'){
      status_child = '1'
    } else if(status_child == '非婚生子女'){
      status_child = '2'
    }else if(status_child == '养子女'){
      status_child = '3'
    } else if(status_child == '继子女'){
      status_child = '4'
    }

    if (relation == '父亲'){
      relation = '1'
    } else if(relation == '母亲'){
      relation = '2'
    }else if(relation == '祖父'){
      relation = '3'
    } else if(relation == '祖母'){
      relation = '4'
    } else if(relation == '外祖父'){
      relation = '5'
    } else if(relation == '外祖母'){
      relation = '6'
    } else if(relation == '继父'){
      relation = '7'
    } else if(relation == '继母'){
      relation = '8'
    } else if(relation == '养父'){
      relation = '9'
    } else if(relation == '养母'){
      relation = '10'
    } else if(relation == '继祖父'){
      relation = '11'
    } else if(relation == '继祖母'){
      relation = '12'
    } else if(relation == '养祖父'){
      relation = '13'
    } else if(relation == '养祖母'){
      relation = '14'
    } else if(relation == '继外祖父'){
      relation = '15'
    } else if(relation == '继外祖母'){
      relation = '16'
    } else if(relation == '养外祖父'){
      relation = '17'
    } else if(relation == '养外祖母'){
      relation = '18'
    }

    if (!child_name || !child_age) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
      // 获取监护人ID
      const guardianRes = await wx.cloud.callFunction({
        name: "getGuardianID",
        data: {
          Guardian_openID: wx.getStorageSync('OpenID')
        },
      })
      wx.setStorageSync('getGuardianID', guardianRes.result.data.UtoG._id)

      let photoUrl = ''

      const now = new Date()
      // 如果有上传照片则先上传
      if (tempPhotoPath) {
        const uploadRes = await wx.cloud.uploadFile({
          cloudPath: '儿童照片/' + wx.getStorageSync('getGuardianID') + now.getMinutes() + now.getSeconds() + '.png',
          filePath: tempPhotoPath
        })
        photoUrl = uploadRes.fileID
      }

      // 调用添加儿童云函数
      const res = await wx.cloud.callFunction({
        name: 'InsertoChild',
        data: {
          child_name:child_name,
          child_age:child_age,
          child_Gender:child_gender,
          status_child:status_child,
          only_child:only_child,
          relation:relation,
          phtotopath: photoUrl,
          GtoC:wx.getStorageSync('getGuardianID')
        }
      })
      this.hideAddChildModal()
      this.fetchData() // 刷新列表
  },

  getGuardianID(){
    wx.cloud.callFunction({
      name: "getGuardianID",
      data: {
        Guardian_openID: wx.getStorageSync('OpenID')
      }
    }).then(res => {
      wx.setStorageSync('GuardianID', res.result.data.UtoG._id);
    })
   },

  update: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },

  fetchData: function() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: "getGuardianID",
        data: {
          Guardian_openID: wx.getStorageSync('OpenID')
        }
      })
      .then(guardianRes => {
        return wx.cloud.callFunction({
          name: 'geChildListbyG',
          data: {
            GuardianID: guardianRes.result.data.UtoG._id
          }
        });
      })
      .then(res => {
        const child_list_1 = [];
        for(let i = 0; i < res.result.GtoC.length; i++) {
          child_list_1.push(res.result.GtoC[i]);
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
      url: './../DetailNoGuardian/index',
    })
  },

  // 阻止事件冒泡
  stopPropagation() {
    return;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //this.getGuardianID()
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
    this.fetchData().then(() => {
      wx.stopPullDownRefresh()
    }).catch(err => {
      console.error('刷新失败:', err)
      wx.stopPullDownRefresh()
    })
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