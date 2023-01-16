// 拦截重复请求
import type { AxiosRequestConfig } from 'axios';
import qs from 'qs';
// 从 v0.22.0 开始，Axios 支持以 fetch API 方式—— AbortController 取消请求：
// CancelToken 已经被淘汰了

export class RequestCanceler {
    // 存储每个请求的标志和取消函数
    pendingRequest: Map<string, AbortController>;
    constructor() {
        this.pendingRequest = new Map<string, AbortController>();
    }
    /**
     * @description 成唯一key
     * 通过url，method，params，data生成唯一key，
     * 用于判断是否重复请求 params为get请求参数，data为post请求参数
     * @param {AxiosRequestConfig} config
     * */
    generateReqKey(config: AxiosRequestConfig): string {
        const { url, method, params, data } = config;
        return [url || '', method || '', qs.stringify(params || {}), qs.stringify(data || {})].join('&');
    }
    /**
     * @description: 添加请求
     * @param {AxiosRequestConfig} config
     */
    addPendingRequest(config: AxiosRequestConfig) {
        const requestKey: string = this.generateReqKey(config);
        if (!this.pendingRequest.has(requestKey)) {
            const controller = new AbortController();
            // 给config挂载signal
            config.signal = controller.signal;
            this.pendingRequest.set(requestKey, controller);
        } else {
            // 如果requestKey已经存在，则获取之前设置的controller，并挂载signal
            config.signal = (this.pendingRequest.get(requestKey) as AbortController).signal;
        }
    }
    /**
     * @description: 移除请求
     * @param {AxiosRequestConfig} config
     * @return {*}
     */
    removePendingRequest(config: AxiosRequestConfig) {
        const requestKey = this.generateReqKey(config);
        if (this.pendingRequest.has(requestKey)) {
            // 取消请求
            (this.pendingRequest.get(requestKey) as AbortController).abort();
            // 从pendingRequest中删掉
            this.pendingRequest.delete(requestKey);
        }
    }
}
