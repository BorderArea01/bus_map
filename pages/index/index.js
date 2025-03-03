const normalCallout = {
  id: 1,
  latitude: 23.141389,
  longitude: 113.054909,
  width: 40,
  height: 50,
  iconPath: '/image/location.png',
  callout: {
    content: '校园巴士1',
    color: '#0066FF',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  },
  label: {
    content: '1号线首发站',
    fontSize: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
}
//标注点2
const customCallout1 = {
  id: 2,
  latitude: 23.139389,
  longitude: 113.052909,
  width: 40,
  height: 50,
  iconPath: '/image/location.png',
  callout: {
    content: '校园巴士2',
    color: '#7700BB',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  },
  label: {
    content: '2号线首发站',
    fontSize: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
}
//标注点3

const customCallout2 = {
  id: 3,
  latitude: 23.142389,
  longitude: 113.053909,
  width: 40,
  height: 50,
  iconPath: '/image/location.png',
  callout: {
    content: '校园巴士3',
    color: '#7700BB',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  },
  label: {
    content: '3号线首发站',
    fontSize: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
}
//标注点4
const customCallout3 = {
  id: 4,
  latitude: 23.138389,
  longitude: 113.054909,
  width: 40,
  height: 50,
  iconPath: '/image/location.png',
  callout: {
    content: '校园巴士4',
    color: '#FF0000',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  },
  label: {
    content: '4号线首发站',
    fontSize: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
}

const allMarkers = [normalCallout, customCallout1, customCallout2, customCallout3]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "23.140389",
    longitude: "113.053909",
    markers: allMarkers,
    latitude_a: '',
    longitude_a: '',
    isMenuOpen: false
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
      { id: 1, name: '校园巴士1', status: '运行中', location: { latitude: 23.141389, longitude: 113.054909 } },
      { id: 2, name: '校园巴士2', status: '运行中', location: { latitude: 23.139389, longitude: 113.052909 } },
      { id: 3, name: '校园巴士3', status: '停靠中', location: { latitude: 23.142389, longitude: 113.053909 } },
      { id: 4, name: '校园巴士4', status: '运行中', location: { latitude: 23.138389, longitude: 113.054909 } }
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
    let index = e.markerId - 1
    let marker = this.data.markers[index]
    console.log(marker);


    this.setData({
      longitude_a: marker.longitude,
      latitude_a: marker.latitude,
      name: marker.callout.content
    })
  },

  //点击标注文字 气泡触发
  callouttap(e) {
    let index = e.markerId - 1
    let marker = this.data.markers[index]
    console.log(marker);


    this.setData({
      longitude_a: marker.longitude,
      latitude_a: marker.latitude,
      name: marker.callout.content
    })
  },
  // 点击标签
  labeltap(e) {
    let index = e.markerId - 1
    let marker = this.data.markers[index]
    console.log(marker);


    this.setData({
      longitude_a: marker.longitude,
      latitude_a: marker.latitude,
      name: marker.callout.content
    })
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