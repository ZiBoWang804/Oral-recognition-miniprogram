// app.js
App({
  onLaunch: function () {
    // 初始化云开发
    this.initCloud()
    // 初始化全局数据
    this.initGlobalData()
  },

  // 初始化云开发环境
  initCloud() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }
    
    try {
      wx.cloud.init({
        env: 'test-9gtawg6paf1c6ec1', // 请确保这是正确的环境ID
        traceUser: true, // 是否将用户访问记录到用户管理中，用于统计分析
      })
    } catch (error) {
      console.error('云开发初始化失败：', error)
      wx.showToast({
        title: '系统初始化失败，请重试',
        icon: 'none'
      })
    }
  },

  // 初始化全局数据
  initGlobalData() {
    this.globalData = {
      userInfo: null, // 用户信息
      roleId: null, // 用户角色ID
      isLoggedIn: false, // 登录状态
      systemInfo: null, // 系统信息
    }

    // 获取系统信息
    try {
      const systemInfo = wx.getSystemInfoSync()
      this.globalData.systemInfo = systemInfo
    } catch (error) {
      console.error('获取系统信息失败：', error)
    }

    // 检查登录状态
    this.checkLoginStatus()
  },

  // 检查登录状态
  async checkLoginStatus() {
    try {
      // 从本地存储获取用户信息和角色
      const roleId = wx.getStorageSync('Type')
      const userInfo = wx.getStorageSync('userInfo')

      if (roleId && userInfo) {
        this.globalData.roleId = roleId
        this.globalData.userInfo = userInfo
        this.globalData.isLoggedIn = true
      }
    } catch (error) {
      console.error('检查登录状态失败：', error)
    }
  },

  // 全局数据
  globalData: {
    userInfo: null,
    roleId: null,
    isLoggedIn: false,
    systemInfo: null,
  }
});