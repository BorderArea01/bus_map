// 主要API地址
let BASE_URL = 'http://113.44.69.253:1987';
// 备用API地址
const BACKUP_URL = 'https://113.44.69.253:1987';

const APP_KEY = '8a7de2209b223648';
const SIGN = 'D9800AF8C2A1DBC00EE302A3356C582D';

// 生成符合格式的时间戳
const generateTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 封装wx.request为Promise
const request = (options, retries = 2, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const requestTask = wx.request({
            ...options,
            success: (res) => {
                console.log('请求成功:', res);
                resolve(res);
            },
            fail: (err) => {
                console.error('请求失败:', err);
                if (retries > 0) {
                    console.log(`重试请求，剩余重试次数: ${retries - 1}`);
                    // 延迟1秒后重试
                    setTimeout(() => {
                        request(options, retries - 1, timeout)
                            .then(resolve)
                            .catch(reject);
                    }, 1000);
                } else {
                    reject(err);
                }
            }
        });

        // 设置请求超时
        setTimeout(() => {
            try {
                requestTask.abort();
                if (retries > 0) {
                    console.log(`请求超时，重试，剩余重试次数: ${retries - 1}`);
                    // 延迟1秒后重试
                    setTimeout(() => {
                        request(options, retries - 1, timeout)
                            .then(resolve)
                            .catch(reject);
                    }, 1000);
                } else {
                    reject(new Error('请求超时'));
                }
            } catch (e) {
                console.error('中止请求失败:', e);
            }
        }, timeout);
    });
};

// 尝试使用备用URL进行请求
const tryBackupUrl = async (apiFunc, ...args) => {
    try {
        console.log('尝试使用主API地址');
        return await apiFunc(...args);
    } catch (error) {
        console.error('主API地址失败，尝试备用地址:', error);
        // 将BASE_URL临时替换为BACKUP_URL
        const originalUrl = BASE_URL;
        BASE_URL = BACKUP_URL;
        try {
            const result = await apiFunc(...args);
            // 恢复原来的URL
            BASE_URL = originalUrl;
            return result;
        } catch (backupError) {
            // 恢复原来的URL
            BASE_URL = originalUrl;
            throw backupError;
        }
    }
};

// 获取accessToken
const getAccessToken = async (username, password) => {
    try {
        console.log('开始获取accessToken...');
        const response = await request({
            url: `${BASE_URL}/open/oauth/token/get`,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                method: 'open.oauth.token.get',
                timestamp: generateTimestamp(),
                appKey: APP_KEY,
                sign: SIGN,
                signMethod: 'md5',
                v: '1.29',
                format: 'json',
                username: username,
                userPwd: password,
                expiresIn: 43200
            }
        });

        if (!response || !response.data) {
            throw new Error('API响应数据为空');
        }

        if (response.data.code === 1000) {
            return response.data.data;
        } else {
            throw new Error(response.data.msg || '获取accessToken失败');
        }
    } catch (error) {
        console.error('获取accessToken失败:', error);
        throw error;
    }
};

// 刷新accessToken
const refreshAccessToken = async (accessToken, refreshToken) => {
    try {
        console.log('开始刷新accessToken...');
        const response = await request({
            url: `${BASE_URL}/open/oauth/token/refresh`,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                method: 'open.oauth.token.refresh',
                timestamp: generateTimestamp(),
                appKey: APP_KEY,
                sign: SIGN,
                signMethod: 'md5',
                v: '1.29',
                format: 'json',
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresIn: 43200
            }
        });

        if (!response || !response.data) {
            throw new Error('API响应数据为空');
        }

        if (response.data.code === 1000) {
            return response.data.data;
        } else {
            throw new Error(response.data.msg || '刷新accessToken失败');
        }
    } catch (error) {
        console.error('刷新accessToken失败:', error);
        throw error;
    }
};

// 获取巴士位置信息
const getBusLocations = async (accessToken, imeiList) => {
    try {
        console.log('开始获取巴士位置...');
        const response = await request({
            url: `${BASE_URL}/open/device/latest/location`,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                method: 'open.device.latest.location',
                timestamp: generateTimestamp(),
                appKey: APP_KEY,
                sign: SIGN,
                signMethod: 'md5',
                v: '1.29',
                format: 'json',
                accessToken: accessToken,
                imeiList: imeiList,
                mapType: 1 // 使用高德/腾讯地图坐标系
            }
        });

        if (!response || !response.data) {
            throw new Error('API响应数据为空');
        }

        if (response.data.code === 1000) {
            return response.data.data;
        } else {
            throw new Error(response.data.msg || '获取巴士位置失败');
        }
    } catch (error) {
        console.error('获取巴士位置失败:', error);
        throw error;
    }
};

module.exports = {
    getAccessToken,
    refreshAccessToken,
    getBusLocations
}; 