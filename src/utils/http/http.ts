import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse, AxiosAdapter } from 'axios';
import {
    handleChangeRequestHeader,
    handleConfigureAuth,
    // handleAuthError,
    // handleGeneralError,
    handleNetworkError
} from './tools';
import { RequestCanceler } from './requestAbortController';
// import retryAdapterEnhancer from '@/utils/http/retryRequest';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress'; // nprogress插件
import 'nprogress/nprogress.css'; // nprogress样式

const canceler = new RequestCanceler();

const http: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 60 * 1000,
    // 表示跨域请求时是否需要使用凭证
    withCredentials: true,
    validateStatus() {
        // `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
        // 使用 async-await，处理 reject 情况较为繁琐，所以全部返回 resolve，在业务代码中处理异常
        return true;
    },
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [
        (data) => {
            if (typeof data === 'string' && data.startsWith('{')) {
                data = JSON.parse(data);
            }
            return data;
        }
    ]
    //适配 请求重试
    // adapter: retryAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, {
    //     delay: 1000
    // })
});
//请求拦截
http.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        NProgress.start();
        // 检查是否存在重复请求，若存在则取消已发的请求
        canceler.removePendingRequest(config);
        // 把当前的请求信息添加到pendingRequest
        canceler.addPendingRequest(config);
        //请求头级以及参数调整 如token
        config = handleChangeRequestHeader(config);
        config = handleConfigureAuth(config);
        //  请求缓存
        // cacheReqInterceptor(config, axios);
        return config;
    },
    (err: AxiosError) => {
        //错误处理
        handleNetworkError(err.response?.status);
        return Promise.reject(err.response);
    }
);
//响应拦截
http.interceptors.response.use(
    (response: AxiosResponse) => {
        NProgress.done();
        // 移除重复请求
        canceler.removePendingRequest(response.config);
        // 返回参数处理
        if (response.status !== 200) return Promise.reject(response.data);
        // handleAuthError(response.data.errno);
        // handleGeneralError(response.data.errno, response.data.errmsg);
        return response;
    },
    (err: AxiosError) => {
        //错误处理
        handleNetworkError(err.response?.status);
        // 移除重复请求
        canceler.removePendingRequest(err.config || {});
        // 异常情况console，方便排查问题
        console.log('error', err);
        if (axios.isCancel(err)) {
            ElMessage({
                showClose: true,
                message: 'repeat_request:请勿重复请求',
                type: 'error'
            });
        }
        // 需要特殊处理请求被取消的情况
        /*
        if (!axios.isCancel(err)) {
            // 请求重发
            return againRequest(err, axios);
        }
        // 请求缓存处理方式
        if (axios.isCancel(err) && err.message.data && err.message.data.config.cache) {
            return Promise.resolve(err.message.data.data.data); // 返回结果数据
        }
        */
        return Promise.reject(err.response);
    }
);

export default http;
