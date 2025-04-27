Page({
  data: {
    educationItems: [
      { id: 1, title: '口腔卫生', icon: '/images/edu-oral.png' },
      { id: 2, title: '刷牙方法', icon: '/images/edu-brush.png' },
      { id: 3, title: '饮食指导', icon: '/images/edu-diet.png' },
      { id: 4, title: '龋齿预防', icon: '/images/edu-cavity.png' },
      { id: 5, title: '牙周健康', icon: '/images/edu-gum.png' },
      { id: 6, title: '正畸知识', icon: '/images/edu-ortho.png' },
      { id: 7, title: '儿童护牙', icon: '/images/edu-kids.png' },
      { id: 8, title: '常见问题', icon: '/images/edu-faq.png' }
    ],
    videos: [
      {
        id: 1,
        title: '正确的刷牙方法演示',
        coverUrl: '/images/video-cover1.jpg',
        videoUrl: 'cloud://your-env-id.xxx/videos/brush.mp4',
      },
      {
        id: 2,
        title: '儿童龋齿预防指南',
        coverUrl: '/images/video-cover2.jpg',
        videoUrl: 'cloud://your-env-id.xxx/videos/cavity.mp4',
      },
      {
        id: 3,
        title: '固定视频3',
        coverUrl: '/images/video-cover2.jpg',
        videoUrl: 'cloud://your-env-id.xxx/videos/cavity.mp4',
      },
      {
        id: 4,
        title: '固定视频4',
        coverUrl: '/images/video-cover2.jpg',
        videoUrl: 'cloud://your-env-id.xxx/videos/cavity.mp4',
      },
      
      // 更多视频...此页面上的视频是固定的
    ]
  },

  onLoad() {
    this.loadEducationData();
  },

  // 加载宣教数据
  loadEducationData() {
    wx.showLoading({ title: '加载中...' });
    
    // 实际项目中这里调用云函数获取数据
    wx.hideLoading();
  },

  // 点击网格项
  onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `./../Ed-detail/index`,
    });
  },

  // 播放视频
  playVideo(e) {
    const video = this.data.videos.find(item => item.id == e.currentTarget.dataset.id);
    wx.navigateTo({
      url: `/pages/video-player/index?url=${encodeURIComponent(video.videoUrl)}&title=${video.title}`
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