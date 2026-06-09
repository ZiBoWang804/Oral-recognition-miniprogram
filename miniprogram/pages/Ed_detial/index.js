
Page({
  data: {
    educationList: [],
    noData: false
  },
  getEdlist: function(options) {
    //传入页面名称获取List
    let id_ = wx.getStorageSync('id')
    const id_string = id_.toString();
    wx.cloud.callFunction({
      name:'getMediainfo',
      data:{
        ym:id_string
      }
    }).then(res => {
      console.log(res)
      const records = res.result.data.records || []
      this.setData({
        educationList: records,
        noData: records.length === 0
      })
    })
  },

  onLoad: function(options) {
    this.getEdlist()
  },

  onItemTaps: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.setStorageSync('_id', id)
    wx.navigateTo({
      url: `./../Media/index`,
    })
  },

  onPullDownRefresh: function() {
    this.getEdlist()
  },

  onUnload() {
    wx.removeStorageSync('id')
  },
})