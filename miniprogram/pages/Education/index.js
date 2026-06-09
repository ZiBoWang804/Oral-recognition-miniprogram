Page({
  data: {
    isVideoPlaying: false, // 控制视频播放器显示
    currentVideo: null,    // 当前播放的视频
    videoLoading: false,   // 视频加载状态
    isPlaying: false,      // 播放/暂停状态
    currentTime: 0,        // 当前播放时间（秒）
    duration: 0,           // 视频总时长（秒）
    progress: 0,           // 播放进度（0-100）
    educationItems: [
      { id: 1, title: '口腔卫生', icon: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/image/兵团口腔医院儿牙科.png' },
      { id: 2, title: '刷牙方法', icon: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/image/兵团口腔医院儿牙科.png' },
      { id: 3, title: '饮食指导', icon: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/image/兵团口腔医院儿牙科.png' },
      { id: 4, title: '龋齿预防', icon: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/image/兵团口腔医院儿牙科.png' },
      { id: 5, title: '牙周健康', icon: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/image/兵团口腔医院儿牙科.png' },
      { id: 6, title: '正畸知识', icon: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/image/兵团口腔医院儿牙科.png' },
      { id: 7, title: '儿童护牙', icon: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/image/兵团口腔医院儿牙科.png' },
      { id: 8, title: '常见问题', icon: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/image/兵团口腔医院儿牙科.png' }
    ],
    videos: [
      {
        id: 1,
        title: '水平震颤刷牙法',
        coverUrl: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/宣教首页封面/微信图片_20250515115810.jpg',
        videoUrl:'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/宣教文件/视频/水平震颤刷牙法.mp4'
      },
      {
        id: 2,
        title: '儿童圆弧刷牙法',
        coverUrl: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/宣教首页封面/微信图片_20250515115838.jpg',
        videoUrl:'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/宣教文件/视频/儿童圆弧刷牙法.mp4'
      },
      {
        id: 3,
        title: '牙线使用方法',
        coverUrl: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/宣教首页封面/微信图片_20250515115839.jpg',
        videoUrl:'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/宣教文件/视频/牙线使用方法.mp4'
      },
      {
        id: 4,
        title: '窝沟封闭',
        coverUrl: 'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/宣教首页封面/微信图片_20250515115840.jpg',
        videoUrl:'cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/宣教文件/视频/窝沟封闭.mp4'
      },
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
    wx.setStorageSync('id', id)
    wx.navigateTo({
      url: `/pages/Ed_detial/index?id=${id}`,
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
  },

  playVideo: function(e) {
    const videoId = e.currentTarget.dataset.id;
    const video = this.data.videos.find(v => v.id === videoId);
    
    if (video) {
      this.setData({
        currentVideo: video,
        isVideoPlaying: true,
        videoLoading: true,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        progress: 0
      });
    }
  },
  
  closeVideo: function() {
    this.setData({
      isVideoPlaying: false,
      currentVideo: null,
      isPlaying: false
    });
  },
  
  onVideoLoad: function() {
    this.setData({
      videoLoading: false
    });
  },
  
  onVideoError: function(e) {
    console.error('视频播放错误', e);
    wx.showToast({
      title: '视频加载失败',
      icon: 'none'
    });
    this.closeVideo();
  },
  
  // 处理视频播放时间更新
  onVideoTimeUpdate: function(e) {
    const currentTime = e.detail.currentTime;
    const duration = e.detail.duration;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    
    this.setData({
      currentTime,
      duration,
      progress
    });
  },
  
  // 切换播放/暂停状态
  togglePlayPause: function() {
    const videoContext = wx.createVideoContext('videoPlayer');
    const isPlaying = !this.data.isPlaying;
    
    if (isPlaying) {
      videoContext.play();
    } else {
      videoContext.pause();
    }
    
    this.setData({
      isPlaying
    });
  },
  
  // 处理进度条拖动
  onProgressChange: function(e) {
    const value = e.detail.value;
    const videoContext = wx.createVideoContext('videoPlayer');
    const duration = this.data.duration;
    const currentTime = (value / 100) * duration;
    
    videoContext.seek(currentTime);
    
    this.setData({
      progress: value,
      currentTime
    });
  },
  
  // 格式化时间为 mm:ss
  formatTime: function(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  },
});