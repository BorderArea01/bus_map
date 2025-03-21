// 根据拥挤程度获取对应的颜色
const getCrowdLevelColor = (crowdLevel) => {
  switch (crowdLevel) {
    case 'free':
      return '#52c41a';  // 绿色
    case 'normal':
      return '#1890ff';  // 蓝色
    case 'crowded':
      return '#faad14';  // 黄色
    default:
      return '#000000';
  }
};

// 巴士标记
const bus1 = {
  id: 1,
  latitude: 27.920283,
  longitude: 120.694047,
  width: 40,
  height: 40,
  iconPath: '/image/bus.png',
  crowdLevel: 'normal',
  callout: {
    content: '巴士1号',
    color: '#1890ff',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#1890ff',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  }
};

const bus2 = {
  id: 2,
  latitude: 27.916283,
  longitude: 120.690047,
  width: 40,
  height: 40,
  iconPath: '/image/bus.png',
  crowdLevel: 'crowded',
  callout: {
    content: '巴士2号',
    color: '#faad14',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#faad14',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  }
};

const bus3 = {
  id: 3,
  latitude: 27.919283,
  longitude: 120.691047,
  width: 40,
  height: 40,
  iconPath: '/image/bus.png',
  crowdLevel: 'free',
  callout: {
    content: '巴士3号',
    color: '#52c41a',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#52c41a',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  }
};

const bus4 = {
  id: 4,
  latitude: 27.917283,
  longitude: 120.693047,
  width: 40,
  height: 40,
  iconPath: '/image/bus.png',
  crowdLevel: 'crowded',
  callout: {
    content: '巴士4号',
    color: '#faad14',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#faad14',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  }
};

// 合并所有标记
const allMarkers = [bus1, bus2, bus3, bus4];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "27.918283",
    longitude: "120.692047",
    markers: allMarkers,
    latitude_a: '',
    longitude_a: '',
    isMenuOpen: false,
    showPopup: false,
    selectedBus: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //搜索位置
  startSearch() {
    // 模拟巴士数据
    const buses = [
      { id: 1, name: '巴士1号', status: '运行中', location: { latitude: 27.920283, longitude: 120.694047 } },
      { id: 2, name: '巴士2号', status: '运行中', location: { latitude: 27.916283, longitude: 120.690047 } },
      { id: 3, name: '巴士3号', status: '停靠中', location: { latitude: 27.919283, longitude: 120.691047 } },
      { id: 4, name: '巴士4号', status: '运行中', location: { latitude: 27.917283, longitude: 120.693047 } }
    ];

    wx.showActionSheet({
      itemList: buses.map(bus => `${bus.name} (${bus.status})`),
      success: (res) => {
        const selectedBus = buses[res.tapIndex];
        // 更新地图中心点到所选巴士位置
        this.setData({
          latitude: selectedBus.location.latitude.toString(),
          longitude: selectedBus.location.longitude.toString(),
          name: selectedBus.name
        });

        // 显示巴士信息
        wx.showToast({
          title: `${selectedBus.name} - ${selectedBus.status}`,
          icon: 'none',
          duration: 2000
        });
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });
  },

  queryRoute() {
    // 暂时显示开发中提示
    wx.showToast({
      title: '路线查询功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 地点地图事件
   * @param {*} e 
   */
  mapBindtap(e) {
    console.log(e.detail);
    this.setData({
      latitude_a: e.detail.latitude,
      longitude_a: e.detail.longitude
    })
  },
  // 点击标注图标
  markertap(e) {
    let marker = this.data.markers.find(m => m.id === e.markerId);
    if (!marker) return;

    this.setData({
      longitude_a: marker.longitude,
      latitude_a: marker.latitude,
      name: marker.callout.content,
      selectedBus: {
        name: marker.callout.content,
        crowdLevel: marker.crowdLevel
      },
      showPopup: true
    });
  },

  //点击标注文字 气泡触发
  callouttap(e) {
    let marker = this.data.markers.find(m => m.id === e.markerId);
    if (!marker) return;

    this.setData({
      longitude_a: marker.longitude,
      latitude_a: marker.latitude,
      name: marker.callout.content,
      selectedBus: {
        name: marker.callout.content,
        crowdLevel: marker.crowdLevel
      },
      showPopup: true
    });
  },
  // 点击标签
  labeltap(e) {
    let index = e.markerId - 1;
    let marker = this.data.markers[index];

    this.setData({
      longitude_a: marker.longitude,
      latitude_a: marker.latitude,
      name: marker.callout.content,
      selectedBus: {
        name: marker.callout.content,
        crowdLevel: marker.crowdLevel
      },
      showPopup: true
    });
  },

  // 隐藏弹窗
  hidePopup() {
    this.setData({
      showPopup: false
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 什么都不做，仅阻止事件冒泡
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toggleMenu() {
    this.setData({
      isMenuOpen: !this.data.isMenuOpen
    });
  },

  handleMenuItem(e) {
    const type = e.currentTarget.dataset.type;

    switch (type) {
      case 'favorite':
        wx.showToast({
          title: '收藏功能开发中',
          icon: 'none'
        });
        break;
      case 'history':
        wx.showToast({
          title: '历史记录开发中',
          icon: 'none'
        });
        break;
      case 'settings':
        wx.showToast({
          title: '设置功能开发中',
          icon: 'none'
        });
        break;
      case 'about':
        wx.showToast({
          title: '关于页面开发中',
          icon: 'none'
        });
        break;
    }

    this.toggleMenu(); // 关闭菜单
  }
})