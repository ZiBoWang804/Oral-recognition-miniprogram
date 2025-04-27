Page({
  data: {
    childrenList: [],
    searchValue: '',
    showQRCode: false,
    qrcodeImage: '',
    currentChildId: ''
  },

  onLoad() {
    this.loadChildrenData();
  },

  loadChildrenData() {
    wx.showLoading({ title: '加载中...' });
    
    wx.cloud.callFunction({
      name: 'getChildrenList',
      success: res => {
        this.setData({
          childrenList: res.result.data,
          isLoading: false
        });
        wx.hideLoading();
      },
      fail: err => {
        console.error('加载失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    });
  },

  onSearchInput(e) {
    const keyword = e.detail.value.toLowerCase();
    this.setData({ searchValue: keyword });
    
    const filtered = this.data.childrenList.filter(child => 
      child.name.toLowerCase().includes(keyword) || 
      child._id.toLowerCase().includes(keyword)
    );
    
    this.setData({ childrenList: filtered });
    
    if (keyword === '') {
      this.loadChildrenData();
    }
  },

  // 生成二维码
  generateQRCode(e) {
    const childId = e.currentTarget.dataset.id;
    
    wx.showLoading({ title: '生成中...' });
    
    wx.cloud.callFunction({
      name: 'generateQRCode',
      data: {
        text: childId,
        width: 400
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          showQRCode: true,
          qrcodeImage: res.result.fileID,
          currentChildId: childId
        });
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '生成二维码失败',
          icon: 'none'
        });
      }
    });
  },

  // 关闭二维码
  closeQRCode() {
    this.setData({ showQRCode: false });
  },

  // 跳转详情
  navigateToDetail(e) {
    const childId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/child-detail/index?id=${childId}`
    });
  },

  // 跳转添加
  navigateToAdd() {
    wx.navigateTo({
      url: '/pages/add-child/index'
    });
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
});