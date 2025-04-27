
Page({
  data: {
    contentText: '请传入要显示的文本内容',
    mediaType: 'image', // image或video
    mediaUrl: ''
  },

  onLoad(options) {
    if (options.text) {
      this.setData({ contentText: decodeURIComponent(options.text) });
    }
    if (options.mediaType) {
      this.setData({ mediaType: options.mediaType });
    }
    if (options.mediaUrl) {
      this.setData({ mediaUrl: decodeURIComponent(options.mediaUrl) });
    }
  },

  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {}
});