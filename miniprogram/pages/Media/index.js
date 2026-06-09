
Page({
  data: {
    videoUrl: '',
    textContent: '',
    imageUrl: '',
    loading: false
  },

  onLoad: function(options) {
    this.loadEducationData();
  },

  loadEducationData: function() {
    wx.showLoading({
      title: '加载中...'
    });
    wx.cloud.callFunction({
      name: 'queryEducation',
      data: {
        id:wx.getStorageSync('_id')
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          videoUrl:res.result.data.mtnr1,
          textContent:res.result.data.wbnr,
          imageUrl:res.result.data.mtnr2
        });
      },
      fail: err => {
        wx.hideLoading();
        console.error('加载失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    });
  },

  // 图片预览功能
  previewImage: function() {
    if (!this.data.imageUrl) {
      wx.showToast({
        title: '暂无图片可预览',
        icon: 'none'
      });
      return;
    }
    wx.previewImage({
      current: this.data.imageUrl,
      urls: [this.data.imageUrl]
    });
  },

  onUnload() {
    wx.removeStorageSync('_id')
  },

});