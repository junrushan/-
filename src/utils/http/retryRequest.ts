import { AxiosAdapter, AxiosRequestConfig } from 'axios';
interface Options {
    times?: number;
    delay?: number;
}
// Axios 实现请求重试 适配器方案
export default function retryAdapterEnhancer(adapter: AxiosAdapter, options: Options): any {
    const { times = 0, delay = 300 } = options;

    return async (config: AxiosRequestConfig) => {
        // @ts-ignore
        const { retryTimes = times, retryDelay = delay } = config;
        let __retryCount = 0;
        const request = async (): Promise<any> => {
            try {
                return await adapter(config);
            } catch (err) {
                // 判断是否进行重试
                if (!retryTimes || __retryCount >= retryTimes) {
                    return Promise.reject(err);
                }
                __retryCount++; // 增加重试次数
                // 延时处理
                const delay = new Promise((resolve) => {
                    setTimeout(() => {
                        // @ts-ignore
                        resolve();
                    }, retryDelay);
                });
                // 重新发起请求
                return delay.then(() => {
                    return request();
                });
            }
        };
        return request();
    };
}
