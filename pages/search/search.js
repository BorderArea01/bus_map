// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buses: [
      {
        id: 1,
        name: '校园巴士1',
        status: '运行中',
        route: '',
        crowdLevel: 'comfortable',
        location: {
          latitude: 23.141389,
          longitude: 113.054909
        }
      },
      {
        id: 2,
        name: '校园巴士2',
        status: '运行中',
        route: '',
        crowdLevel: 'crowded',
        location: {
          latitude: 23.139389,
          longitude: 113.052909
        }
      },
      {
        id: 3,
        name: '校园巴士3',
        status: '停靠中',
        route: '',
        crowdLevel: 'free',
        location: {
          latitude: 23.142389,
          longitude: 113.053909
        }
      },
      {
        id: 4,
        name: '校园巴士4',
        status: '运行中',
        route: '',
        crowdLevel: 'crowded',
        location: {
          latitude: 23.138389,
          longitude: 113.054909
        }
      }
    ],
    showPopup: false,
    selectedBus: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  //搜索位置
  startSearch() {
    wx.chooseLocation({
      latitude: "30.256517049608455" * 1,
      longitude: "120.1503332472505" * 1,
    })
      .then(res => {
        console.log('搜索位置:' + res.name);
        console.log(res);

      })
      .catch(err => {
        console.log('err', err);
      })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 显示拥挤程度弹窗
  showCrowdLevel(e) {
    const bus = e.currentTarget.dataset.bus;
    this.setData({
      selectedBus: bus,
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

  // 选择当前显示的巴士
  selectCurrentBus() {
    const bus = this.data.selectedBus;
    if (!bus) return;

    // 将选中的巴士信息存入全局数据
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 获取上一个页面

    // 更新上一个页面的数据
    prevPage.setData({
      latitude: bus.location.latitude.toString(),
      longitude: bus.location.longitude.toString(),
      name: bus.name
    });

    // 返回上一页
    wx.navigateBack({
      success: () => {
        // 显示提示信息
        wx.showToast({
          title: `已定位到${bus.name}`,
          icon: 'success',
          duration: 2000
        });
      }
    });
  }
})