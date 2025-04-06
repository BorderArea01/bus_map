// 根据拥挤程度获取对应的颜色
const getCrowdLevelColor = (crowdLevel) => {
  // 暂时没有数据，全部显示为正常状态（蓝色）
  return '#1890ff';  // 蓝色

  /* 等待后续接入数据后再启用
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
  */
};

// 根据运动状态获取对应的颜色
const getMovementStatusColor = (movementStatus) => {
  switch (movementStatus) {
    case 'moving':
      return '#faad14';  // 橙色，表示运动中
    case 'stopped':
      return '#52c41a';  // 绿色，表示停靠中
    default:
      return '#1890ff';  // 默认蓝色
  }
};

const api = require('../../utils/api.js');

// 巴士IMEI列表
const BUS_IMEI_LIST = [
  "868755133361683",
  "868755133365445",
  "868755133360420",
  "868755133362327",
  "868755133356980",
  "868755133364588"
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "27.915056968706804",
    longitude: "120.67756804417415",
    markers: [],
    latitude_a: '',
    longitude_a: '',
    isMenuOpen: false,
    showPopup: false,
    selectedBus: null,
    accessToken: null,
    refreshToken: null,
    tokenExpireTime: null,
    scale: 16,  // 修改默认缩放级别为16
    enableSatellite: true,  // 默认启用卫星地图
    mapLabel: '普通地图',  // 修改默认标签文字
    showBusList: false,
    hasShownUpdateError: false,
    mapError: false,         // 地图加载是否出错
    mapErrorMsg: ''          // 地图错误信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    try {
      wx.showLoading({
        title: '正在加载...',
        mask: true
      });

      // 设置全局错误处理
      this.setupErrorHandling();

      // 尝试获取Token并更新巴士位置
      try {
        // 检查本地存储中是否有有效的token
        const storedToken = wx.getStorageSync('accessToken');
        const storedRefreshToken = wx.getStorageSync('refreshToken');
        const storedExpireTime = wx.getStorageSync('tokenExpireTime');

        if (storedToken && storedRefreshToken && storedExpireTime) {
          // 如果token还有超过1小时的有效期，直接使用
          if (storedExpireTime - Date.now() > 3600000) {
            console.log('使用本地存储的有效token');
            this.setData({
              accessToken: storedToken,
              refreshToken: storedRefreshToken,
              tokenExpireTime: storedExpireTime
            });
          } else {
            // token即将过期，尝试刷新
            await this.refreshToken(storedToken, storedRefreshToken);
          }
        } else {
          // 没有本地token，重新获取
          await this.getNewToken();
        }

        // 开始定时更新巴士位置
        this.startBusLocationUpdate();
      } catch (tokenError) {
        console.error('Token获取失败:', tokenError);
        // 尽管Token获取失败，我们也不立即显示错误，只记录日志
        // 可以在这里设置一些默认的静态数据以便地图仍然可以显示

        // 显示提示
        wx.showToast({
          title: '位置数据加载失败，部分功能可能不可用',
          icon: 'none',
          duration: 3000
        });
      }

      wx.hideLoading();
    } catch (error) {
      console.error('初始化失败:', error);
      wx.hideLoading();
      wx.showModal({
        title: '初始化失败',
        content: error.message || '请检查网络连接后重试',
        showCancel: false,
        confirmText: '重试',
        success: (res) => {
          if (res.confirm) {
            // 用户点击确定，尝试重新加载
            this.onLoad(options);
          }
        }
      });
    }
  },

  // 设置全局错误处理
  setupErrorHandling() {
    // 捕获未处理的Promise错误
    wx.onUnhandledRejection((res) => {
      console.error('未处理的Promise错误:', res.reason);
    });

    // 捕获全局错误
    wx.onError((error) => {
      console.error('全局错误:', error);
    });
  },

  // 处理百度地图组件错误
  handleMapError(error) {
    console.error('地图组件错误:', error);

    // 设置默认位置数据
    this.setData({
      latitude: "27.915056968706804",
      longitude: "120.67756804417415",
      scale: 14
    });

    // 显示错误提示
    wx.showToast({
      title: '地图组件加载失败',
      icon: 'none',
      duration: 2000
    });
  },

  // 获取新token
  async getNewToken() {
    console.log('开始获取新token...');
    const tokenData = await api.getAccessToken('温州商学院', 'MTIzNHF3ZQ==');
    console.log('获取新token成功:', tokenData);

    if (!tokenData || !tokenData.accessToken) {
      throw new Error('获取accessToken失败：返回数据无效');
    }

    const expireTime = Date.now() + tokenData.expiresIn * 1000;

    // 保存到本地存储
    wx.setStorageSync('accessToken', tokenData.accessToken);
    wx.setStorageSync('refreshToken', tokenData.refreshToken);
    wx.setStorageSync('tokenExpireTime', expireTime);

    this.setData({
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      tokenExpireTime: expireTime
    });
  },

  // 刷新token
  async refreshToken(accessToken, refreshToken) {
    try {
      console.log('开始刷新token...');
      const tokenData = await api.refreshAccessToken(
        accessToken || this.data.accessToken,
        refreshToken || this.data.refreshToken
      );

      const expireTime = Date.now() + tokenData.expiresIn * 1000;

      // 保存到本地存储
      wx.setStorageSync('accessToken', tokenData.accessToken);
      wx.setStorageSync('refreshToken', tokenData.refreshToken);
      wx.setStorageSync('tokenExpireTime', expireTime);

      this.setData({
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        tokenExpireTime: expireTime
      });
    } catch (error) {
      console.error('刷新token失败:', error);
      // 如果刷新失败，重新获取新token
      await this.getNewToken();
    }
  },

  // 计算位置偏差修正
  correctCoordinate(coordinate) {
    // 根据实际测量数据计算的偏差值
    const LATITUDE_OFFSET = 0.002459621903121;  // 纬度偏差
    const LONGITUDE_OFFSET = 0.01063078776087;  // 经度偏差

    return {
      latitude: parseFloat(coordinate.latitude) + LATITUDE_OFFSET,
      longitude: parseFloat(coordinate.longitude) + LONGITUDE_OFFSET
    };
  },

  // 根据巴士状态获取拥挤程度
  getCrowdLevel(bus) {
    // 暂时没有数据，全部显示为正常状态
    return 'normal';

    /* 等待后续接入数据后再启用
    if (bus.status === 2 || bus.status === 3) {
      return 'free';
    } else if (bus.status === 4) {
      return 'crowded';
    } else {
      return 'normal';
    }
    */
  },

  // 获取巴士运动状态
  getMovementStatus(bus) {
    // 根据速度或其他属性判断运动状态
    // 这里假设bus对象中有speed属性或status可用于判断
    if (bus.speed > 0 || bus.status === 1 || bus.status === 4) {
      return 'moving';  // 运动中
    } else {
      return 'stopped'; // 停靠中
    }
  },

  // 更新巴士位置
  async updateBusLocations() {
    try {
      // 检查是否有token
      if (!this.data.accessToken) {
        console.warn('无法更新巴士位置：缺少accessToken');
        return;
      }

      // 检查token是否即将过期（小于1小时）
      if (this.data.tokenExpireTime - Date.now() < 3600000) {
        try {
          await this.refreshToken();
        } catch (error) {
          console.error('刷新token失败:', error);
          // 尝试获取新token
          try {
            await this.getNewToken();
          } catch (newTokenError) {
            console.error('获取新token失败:', newTokenError);
            // 如果获取新token也失败，则退出本次更新
            return;
          }
        }
      }

      console.log('开始获取巴士位置...');
      let locations;
      try {
        locations = await api.getBusLocations(this.data.accessToken, BUS_IMEI_LIST);
        console.log('获取到的巴士位置数据:', locations);
      } catch (error) {
        console.error('获取巴士位置失败:', error);
        return;
      }

      if (!locations || locations.length === 0) {
        console.warn('未获取到巴士位置数据');
        return;
      }

      // 更新地图标记
      const markers = locations.map((bus, index) => {
        // 检查经纬度是否有效
        if (!bus.lat || !bus.lon) {
          console.warn(`巴士${index + 1}号位置数据无效:`, bus);
          return null;
        }

        // 应用位置偏差修正
        const correctedPosition = this.correctCoordinate({
          latitude: bus.lat,
          longitude: bus.lon
        });

        // 调整巴士编号，特别处理3号和6号巴士
        let busNumber = index + 1;
        if (busNumber === 3) {
          busNumber = 6;
        } else if (busNumber === 6) {
          busNumber = 3;
        }

        const marker = {
          id: index + 1,
          latitude: correctedPosition.latitude,
          longitude: correctedPosition.longitude,
          width: 30,
          height: 30,
          iconPath: '/image/bus.png',
          crowdLevel: this.getCrowdLevel(bus),
          movementStatus: this.getMovementStatus(bus),
          originalData: bus,  // 保存原始数据供后续使用
          rotate: bus.angle || 0,  // 添加旋转角度，如果没有角度数据则默认为0
          callout: {
            content: `巴士${busNumber}号`,
            color: getMovementStatusColor(this.getMovementStatus(bus)),
            fontSize: 12,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: getMovementStatusColor(this.getMovementStatus(bus)),
            bgColor: '#fff',
            padding: 3,
            display: 'ALWAYS',
            textAlign: 'center'
          }
        };
        console.log(`创建标记 ${busNumber}:`, marker);
        return marker;
      }).filter(marker => marker !== null); // 过滤掉无效的标记

      console.log('更新后的地图标记:', markers);

      if (markers.length === 0) {
        console.warn('没有有效的巴士标记可以显示');
        return;
      }

      // 只更新标记，不改变地图中心点和缩放级别
      console.log('更新标记:', markers);
      this.setData({ markers });
    } catch (error) {
      console.error('更新巴士位置失败:', error);
      // 只显示一次提示，避免多次更新失败时频繁弹窗
      if (!this.data.hasShownUpdateError) {
        wx.showToast({
          title: '更新巴士位置失败',
          icon: 'none'
        });
        this.setData({
          hasShownUpdateError: true
        });
      }
    }
  },

  // 开始定时更新巴士位置
  startBusLocationUpdate() {
    // 立即更新一次
    this.updateBusLocations();

    // 每30秒更新一次位置
    setInterval(() => {
      this.updateBusLocations();
    }, 30000);

    // 每12小时检查一次token
    setInterval(() => {
      if (this.data.tokenExpireTime - Date.now() < 3600000) {
        this.refreshToken();
      }
    }, 12 * 60 * 60 * 1000);
  },

  // 搜索巴士
  startSearch() {
    if (!this.data.markers || this.data.markers.length === 0) {
      wx.showToast({
        title: '没有可用的巴士数据',
        icon: 'none'
      });
      return;
    }

    // 将标记按照巴士编号排序
    const sortedBusMarkers = [...this.data.markers].sort((a, b) => {
      // 从callout.content中提取巴士编号
      const busNumberA = parseInt(a.callout.content.replace(/[^0-9]/g, ''));
      const busNumberB = parseInt(b.callout.content.replace(/[^0-9]/g, ''));
      return busNumberA - busNumberB;
    });

    this.setData({
      sortedBusMarkers: sortedBusMarkers,
      showBusList: true
    });
  },

  // 跳转到指定巴士
  jumpToBus(e) {
    const busId = e.currentTarget.dataset.id;
    const bus = this.data.markers.find(m => m.id === busId);

    if (bus) {
      // 获取巴士名称，处理巴士3号和巴士6号的特殊情况
      let busName = bus.callout.content;

      // 更新地图中心为选中的巴士位置
      this.setData({
        latitude: bus.latitude.toString(),
        longitude: bus.longitude.toString(),
        scale: 16, // 放大一点以便更清楚地看到巴士
        showBusList: false // 关闭巴士列表
      });

      // 可选：显示巴士详情
      this.setData({
        selectedBus: {
          name: busName,
          crowdLevel: bus.crowdLevel,
          movementStatus: bus.movementStatus,
          originalData: bus.originalData
        },
        showPopup: true
      });
    }
  },

  // 关闭巴士列表
  closeBusList() {
    this.setData({
      showBusList: false
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
    console.log('地图点击:', e.detail);

    // 应用位置偏差修正（反向修正，因为这里是从地图到实际位置）
    const reverseCorrection = {
      latitude: e.detail.latitude - 0.002459621903121,
      longitude: e.detail.longitude - 0.01063078776087
    };

    // 记录点击位置，但不获取用户位置
    this.setData({
      latitude_a: reverseCorrection.latitude,
      longitude_a: reverseCorrection.longitude
    });
  },

  // 点击标注图标
  markertap(e) {
    let marker = this.data.markers.find(m => m.id === e.markerId);
    if (!marker) return;

    // 标记的位置已经被修正过，这里不需要再次修正
    this.setData({
      longitude_a: marker.longitude,
      latitude_a: marker.latitude,
      name: marker.callout.content,
      selectedBus: {
        name: marker.callout.content,
        crowdLevel: marker.crowdLevel,
        movementStatus: marker.movementStatus,
        originalData: marker.originalData  // 添加原始数据
      },
      showPopup: true
    });
  },

  //点击标注文字 气泡触发
  callouttap(e) {
    console.log('气泡点击事件触发:', e);
    // 获取markerId，注意事件数据结构可能不同
    const markerId = e.detail ? e.detail.markerId : (e.markerId || null);

    if (!markerId) {
      console.warn('未找到有效的markerId:', e);
      return;
    }

    let marker = this.data.markers.find(m => m.id === markerId);
    if (!marker) {
      console.warn(`未找到ID为${markerId}的标记`);
      return;
    }

    console.log('找到对应标记:', marker);
    this.setData({
      longitude_a: marker.longitude,
      latitude_a: marker.latitude,
      name: marker.callout.content,
      selectedBus: {
        name: marker.callout.content,
        crowdLevel: marker.crowdLevel,
        movementStatus: marker.movementStatus,
        originalData: marker.originalData  // 添加原始数据
      },
      showPopup: true
    });
  },

  // 点击标签
  labeltap(e) {
    let marker = this.data.markers.find(m => m.id === e.markerId);
    if (!marker) return;

    this.setData({
      longitude_a: marker.longitude,
      latitude_a: marker.latitude,
      name: marker.callout.content,
      selectedBus: {
        name: marker.callout.content,
        crowdLevel: marker.crowdLevel,
        movementStatus: marker.movementStatus,
        originalData: marker.originalData  // 添加原始数据
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
    // 处理菜单项点击
    console.log('点击菜单项:', type);
  },

  // 切换卫星地图
  toggleSatellite() {
    const newSatelliteState = !this.data.enableSatellite;
    this.setData({
      enableSatellite: newSatelliteState,
      mapLabel: newSatelliteState ? '普通地图' : '卫星地图',
      isMenuOpen: false  // 关闭菜单
    });

    // 提示用户已切换地图类型
    wx.showToast({
      title: newSatelliteState ? '已切换到卫星地图' : '已切换到普通地图',
      icon: 'none',
      duration: 1500
    });
  },

  // 地图加载错误处理
  onMapError(e) {
    console.error('地图加载错误:', e);
    this.setData({
      mapError: true,
      mapErrorMsg: e.detail && e.detail.errMsg ? e.detail.errMsg : '地图组件初始化失败，请重试'
    });

    // 上报错误
    if (getApp() && getApp().reportError) {
      getApp().reportError('地图加载错误', e);
    }
  },

  // 重试加载地图
  retryLoadMap() {
    console.log('尝试重新加载地图...');
    this.setData({
      mapError: false,
      mapErrorMsg: ''
    });

    // 延迟一秒再次初始化，避免立即重试可能导致的同样错误
    setTimeout(() => {
      // 获取地图组件实例
      const mapComponent = this.selectComponent('#bmap');
      if (mapComponent) {
        try {
          mapComponent.initBMap();
          console.log('地图重新初始化成功');
        } catch (error) {
          console.error('地图重新初始化失败:', error);
          this.setData({
            mapError: true,
            mapErrorMsg: '地图组件重新初始化失败，请退出后重试'
          });
        }
      } else {
        this.setData({
          mapError: true,
          mapErrorMsg: '找不到地图组件，请退出后重试'
        });
      }
    }, 1000);
  }
})