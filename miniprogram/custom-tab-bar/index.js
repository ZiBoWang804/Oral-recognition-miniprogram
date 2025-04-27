Component({
  data: {
    selected: 0,
    userType: 1, // 默认监护人类型
    // 医生tab配置
    doctorTabs: [
      {
        pagePath: "/pages/List/index",
        text: "检查列表",
        iconPath: "/images/tab-doctor.png",
        selectedIconPath: "/images/tab-doctor-active.png"
      },
      {
        pagePath: "/pages/UserCenter/index",
        text: "用户中心",
        iconPath: "/images/tab-home.png",
        selectedIconPath: "/images/tab-home-active.png"
      }
    ],
    // 监护人tab配置
    guardianTabs: [
      {
        pagePath: "/pages/Education/index",
        text: "宣教学习",
        iconPath: "/images/tab-home.png",
        selectedIconPath: "/images/tab-home-active.png"
      },
      {
        pagePath: "/pages/Child/index",
        text: "儿童管理",
        iconPath: "/images/tab-user.png",
        selectedIconPath: "/images/tab-user-active.png"
      },
      {
        pagePath: "/pages/UserCenter/index",
        text: "用户中心",
        iconPath: "/images/tab-home.png",
        selectedIconPath: "/images/tab-home-active.png"
      }
    ],
    currentTabs: [] // 当前显示的tab列表
  },

  lifetimes: {
    attached() {
      this.updateTabBar();
    }
  },

  methods: {
    // 更新tabbar显示
    updateTabBar() {
      const userType = wx.getStorageSync('Type');
      const currentTabs = userType == 3 ? this.data.doctorTabs : this.data.guardianTabs;
      
      this.setData({
        userType,
        currentTabs
      });
      
      // 更新选中状态
      const pages = getCurrentPages();
      const currentPage = pages[pages.length -1];
      const currentPath = '/' + currentPage.route;
      
      currentTabs.forEach((tab, index) => {
        if (tab.pagePath === currentPath) {
          this.setData({ selected: index });
        }
      });
    },

    // 切换tab页
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset;
      wx.switchTab({
        url: path,
        success: () => {
          this.setData({ selected: index });
        },
        fail: (err) => {
          console.error('切换tab失败:', err);
        }
      });
    }
  }
});