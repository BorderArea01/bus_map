const normalCallout = {
  id: 1,
  latitude: 30.26064905500077,
  longitude: 120.14700833494362,
  width: 40,
  height: 50,
  iconPath: '/image/location.png',
  callout: {
    content: '宝石山',
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
    content: '这里是宝石山',
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
  latitude: 30.258747261993033,
  longitude: 120.15197366023278,
  iconPath: '/image/location.png',
  width: 40,
  height: 50,
  callout: {
    content: '断桥残雪',
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
    content: '这里是断桥残雪',
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
  latitude: 30.255288366053747,
  longitude: 120.14901183344466,
  iconPath: '/image/location.png',
  width: 40,
  height: 50,
  callout: {
    content: '白堤',
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
    content: '这里是白堤',
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
  latitude: 30.25456060231621,
  longitude: 120.1463731200422,
  iconPath: '/image/location.png',
  width: 40,
  height: 50,
  callout: {
    content: '千里湖',
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
    content: '这里是千里湖',
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
    latitude: "30.256517049608455",
    longitude: "120.1503332472505",
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
    wx.chooseLocation({
      latitude: "30.256517049608455" * 1,
      longitude: "120.1503332472505" * 1,
    })
      .then(res => {
        console.log('搜索位置:' + res.name);
        this.setData({
          latitude_a: res.latitude,
          longitude_a: res.longitude,
          name: res.name
        })

      })
      .catch(err => {
        console.log('err', err);
      })


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
  // 开始导航 到app导航
  startMap() {
    let latitude_a = this.data.longitude_a * 1
    let longitude_a = this.data.longitude_a * 1
    wx.openLocation({
      latitude: latitude_a,
      longitude: longitude_a,
      success(res) {
        console.log('su', res);
      },
      fail(err) {
        console.log('er', err);
      }
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