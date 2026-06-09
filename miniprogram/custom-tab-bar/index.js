Component({
  data: {
    selected: 0,
    userType: 1, // 默认监护人类型
    // 医生tab配置
    doctorTabs: [
      {
        pagePath: "/pages/List/index",
        text: "检查列表",
        iconPath: "cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/图标/list.png",
        selectedIconPath: "cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/图标/list_select.png"
      },
      {
        pagePath: "/pages/UserCenter/index",
        text: "用户中心",
        iconPath: "cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/图标/me (1).png",
        selectedIconPath: "cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/图标/me (2).png"
      }
    ],
    // 监护人tab配置
    guardianTabs: [
      {
        pagePath: "/pages/Education/index",
        text: "宣教学习",
        iconPath: "cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/图标/学习 (1).png",
        selectedIconPath: "cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/图标/学习.png"
      },
      {
        pagePath: "/pages/Child/index",
        text: "儿童管理",
        iconPath: "cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/图标/幼儿.png",
        selectedIconPath: "cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/图标/幼儿 (1).png"
      },
      {
        pagePath: "/pages/UserCenter/index",
        text: "用户中心",
        iconPath: "cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/图标/me (1).png",
        selectedIconPath: "cloud://test-9gtawg6paf1c6ec1.7465-test-9gtawg6paf1c6ec1-1329830728/图标/me (2).png"
      }
    ],
    currentTabs: [], // 当前显示的tab列表
  },

  lifetimes: {
    attached() {
      this.updateTabBar();
      
      // 设置页面切换监听器
      this.setupPageChangeListener();

      // 监听页面不存在的情况
      wx.onPageNotFound(() => {
        console.warn('页面不存在，使用默认tab');
        this.setData({ selected: 0 });
      });
    },
    
    detached() {
      // 清理事件监听器
      if (typeof wx.offAppShow === 'function') {
        wx.offAppShow();
      }
      if (typeof wx.offPageNotFound === 'function') {
        wx.offPageNotFound();
      }
    }
  },

  methods: {
    // 更新tabbar显示
    updateTabBar() {
      try {
        // 获取用户类型，默认为监护人类型(1)
        const userType = wx.getStorageSync('userType') || wx.getStorageSync('Type') || 1;
        const currentTabs = userType == 3 ? this.data.doctorTabs : this.data.guardianTabs;
        
        this.setData({
          userType,
          currentTabs
        });
        
        // 更新选中状态
        this.updateSelectedTab();
      } catch (error) {
        console.error('更新tabbar失败:', error);
        wx.showToast({
          title: '系统出现异常',
          icon: 'none'
        });
      }
    },

    // 更新选中状态
    updateSelectedTab() {
      const pages = getCurrentPages();
      
      // 如果页面栈为空，尝试通过当前路由更新
      if (!pages || pages.length === 0) {
        console.warn('页面栈为空，尝试其他方式更新tabbar状态');
        
        // 获取当前页面路径
        const currentPath = this.getCurrentPagePath();
        if (currentPath) {
          this.updateTabBarByPath(currentPath);
        } else {
          // 如果无法获取路径，设置默认选中状态
          this.setData({ selected: 0 });
          
          // 添加重试机制
          setTimeout(() => {
            this.updateSelectedTab();
          }, 300);
        }
        return;
      }
      
      const currentPage = pages[pages.length - 1];
      if (!currentPage || !currentPage.route) {
        console.warn('无法获取当前页面路由信息，使用默认值');
        this.setData({ selected: 0 });
        return;
      }

      const currentPath = '/' + currentPage.route;
      this.updateTabBarByPath(currentPath);
    },

    // 根据路径更新tabbar状态
    updateTabBarByPath(path) {
      const tabIndex = this.data.currentTabs.findIndex(tab => tab.pagePath === path);
      if (tabIndex !== -1) {
        this.setData({ selected: tabIndex });
      } else {
        // 如果找不到对应的tab，使用默认值
        this.setData({ selected: 0 });
      }
    },

    // 获取当前页面路径的备选方法
    getCurrentPagePath() {
      try {
        const pages = getCurrentPages();
        if (pages && pages.length > 0) {
          const currentPath = '/' + pages[pages.length - 1].route;
          // 保存当前路径到本地存储
          wx.setStorageSync('lastPagePath', currentPath);
          return currentPath;
        }
        
        // 尝试从本地存储获取最后访问的页面路径
        const lastPath = wx.getStorageSync('lastPagePath');
        if (lastPath) {
          return lastPath;
        }
        
        return null;
      } catch (error) {
        console.error('获取当前页面路径失败:', error);
        return null;
      }
    },

    // 监听页面切换
    setupPageChangeListener() {
      // 使用页面显示事件来更新状态
      wx.onAppShow(() => {
        setTimeout(() => {
          this.updateSelectedTab();
        }, 100);
      });

      // 监听页面切换事件
      const updateOnShow = () => {
        setTimeout(() => {
          this.updateSelectedTab();
        }, 100);
      };

      // 将更新函数绑定到当前组件实例
      this.updateOnShow = updateOnShow;

      // 获取当前页面实例并添加显示监听
      const pages = getCurrentPages();
      if (pages && pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        if (currentPage && typeof currentPage.onShow === 'function') {
          const originalOnShow = currentPage.onShow;
          currentPage.onShow = function() {
            originalOnShow.call(this);
            updateOnShow();
          };
        }
      }
    },

    // 切换tab页
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset;
      
      if (!path) {
        console.error('无效的页面路径');
        wx.showToast({
          title: '页面不存在',
          icon: 'none'
        });
        return;
      }

      wx.switchTab({
        url: path,
        success: () => {
          this.setData({ selected: index });
        },
        fail: (err) => {
          console.error('切换tab失败:', err);
          wx.showToast({
            title: '页面切换失败',
            icon: 'none'
          });
        }
      });
    }
  }
})