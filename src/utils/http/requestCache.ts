import Axios, { AxiosRequestConfig } from 'axios';
import { generateReqKey } from './tools';

const options = {
    storage: true, // 是否开启localstorage缓存
    storageKey: 'apiCache',
    storage_expire: 600000, // localStorage 数据存储时间10min（刷新页面判断是否清除）
    expire: 20000 // 每个接口数据缓存ms 数
};
// 初始化  缓存
(function () {
    const cache = window.localStorage.getItem(options.storageKey);
    if (cache) {
        const { storageExpire } = JSON.parse(cache);
        // 未超时不做处理
        if (storageExpire && getNowTime() - storageExpire < options.storage_expire) {
            return;
        }
    }
    window.localStorage.setItem(options.storageKey, JSON.stringify({ data: {}, storageExpire: getNowTime() }));
})();

function getCacheItem(key: any) {
    const cache = window.localStorage?.getItem(options.storageKey);
    const { data, storageExpire } = JSON.parse(cache as string);
    return (data && data[key]) || null;
}
function setCacheItem(key: any, value: any) {
    const cache = window.localStorage.getItem(options.storageKey);
    const { data, storageExpire } = JSON.parse(cache as string);
    data[key] = value;
    window.localStorage.setItem(options.storageKey, JSON.stringify({ data, storageExpire }));
}

const _CACHES = {};
// 使用Proxy代理
const cacheHandler = {
    get: function (target: any, key: any) {
        let value = target[key];
        console.log(`${key} 被读取`, value);
        if (options.storage && !value) {
            value = getCacheItem(key);
        }
        return value;
    },
    set: function (target: any, key: any, value: any) {
        console.log(`${key} 被设置为 ${value}`);
        target[key] = value;
        if (options.storage) {
            setCacheItem(key, value);
        }

        return true;
    }
};
const CACHES = new Proxy(_CACHES, cacheHandler);

export function requestInterceptor(config: AxiosRequestConfig) {
    // 开启缓存则保存请求结果和cancel 函数
    // @ts-ignore
    if (config.cache) {
        const data = CACHES[`${generateReqKey(config)}`];
        // 这里用于存储是默认时间还是用户传递过来的时间
        let setExpireTime;
        // @ts-ignore
        config.setExpireTime ? (setExpireTime = config.setExpireTime) : (setExpireTime = options.expire);
        // 判断缓存数据是否存在 存在的话 是否过期 没过期就返回
        if (data && getNowTime() - data.expire < setExpireTime) {
            config.cancelToken = new Axios.CancelToken((cancel) => {
                // cancel 函数的参数会作为 promise 的 error 被捕获
                cancel(data);
            }); // 传递结果到catch中
        }
    }
}

export function responseInterceptor(response: AxiosRequestConfig) {
    // 返回的code === 200 时候才会缓存下来
    // @ts-ignore
    if (response && response.config.cache && response.data.code === 200) {
        // @ts-ignore
        CACHES[`${generateReqKey(response.config)}`] = {
            expire: getNowTime(),
            data: response
        };
    }
}

// 获取当前时间戳
function getNowTime() {
    return new Date().getTime();
}
