// components/bmap/bmap.js
const BMapWX = require('../../libs/bmap-wx.js').BMapWX;

Component({
    properties: {
        latitude: {
            type: String,
            value: '27.915056968706804'
        },
        longitude: {
            type: String,
            value: '120.67756804417415'
        },
        scale: {
            type: Number,
            value: 16
        },
        markers: {
            type: Array,
            value: []
        },
        showLocation: {
            type: Boolean,
            value: true
        },
        enableSatellite: {
            type: Boolean,
            value: true
        }
    },

    data: {
        bmap: null
    },

    lifetimes: {
        attached() {
            // 在组件实例进入页面节点树时执行
            this.initBMap();
        }
    },

    methods: {
        initBMap() {
            try {
                // 初始化百度地图
                this.data.bmap = new BMapWX({
                    ak: 'REqn7Bs2WOh4It2AG4csXUTMkUWEZOue'
                });
                console.log('百度地图组件初始化成功');
            } catch (error) {
                console.error('百度地图组件初始化失败:', error);
                // 可以在这里设置一个默认的地图对象或显示错误信息
                wx.showToast({
                    title: '地图组件加载失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        },

        search(options) {
            return new Promise((resolve, reject) => {
                try {
                    if (!this.data.bmap) {
                        try {
                            this.initBMap();
                            if (!this.data.bmap) {
                                throw new Error('百度地图初始化失败');
                            }
                        } catch (error) {
                            reject(new Error('无法初始化百度地图: ' + error.message));
                            return;
                        }
                    }

                    this.data.bmap.search({
                        ...options,
                        success: (res) => {
                            resolve(res);
                        },
                        fail: (err) => {
                            console.error('搜索失败:', err);
                            reject(err);
                        }
                    });
                } catch (error) {
                    console.error('search方法执行失败:', error);
                    reject(error);
                }
            });
        },

        regeocoding(options) {
            return new Promise((resolve, reject) => {
                try {
                    if (!this.data.bmap) {
                        try {
                            this.initBMap();
                            if (!this.data.bmap) {
                                throw new Error('百度地图初始化失败');
                            }
                        } catch (error) {
                            reject(new Error('无法初始化百度地图: ' + error.message));
                            return;
                        }
                    }

                    this.data.bmap.regeocoding({
                        ...options,
                        success: (res) => {
                            resolve(res);
                        },
                        fail: (err) => {
                            console.error('逆地理编码失败:', err);
                            reject(err);
                        }
                    });
                } catch (error) {
                    console.error('regeocoding方法执行失败:', error);
                    reject(error);
                }
            });
        },

        // 转发地图点击事件
        handleTap(e) {
            this.triggerEvent('tap', e.detail);
        },

        // 转发标记点击事件
        handleMarkerTap(e) {
            this.triggerEvent('markertap', e.detail);
        },

        // 转发标签点击事件
        handleCalloutTap(e) {
            console.log('气泡点击事件:', e);
            this.triggerEvent('callouttap', e);
        },

        // 转发标注点击事件
        handleLabelTap(e) {
            this.triggerEvent('labeltap', e);
        }
    }
}) 