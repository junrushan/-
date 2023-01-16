import { ElMessage } from 'element-plus';
import { AxiosRequestConfig } from 'axios';
import qs from 'qs';
export const handleChangeRequestHeader = (config: any) => {
    // 自行配置
    config['xxxx'] = 'xxx';
    return config;
};

export const handleConfigureAuth = (config: any) => {
    // 获取token
    config.headers['token'] = localStorage.getItem('token') || '';
    return config;
};

export const handleNetworkError = (errStatus?: number): void => {
    const networkErrMap: any = {
        '400': '错误的请求', // token 失效
        '401': '未授权，请重新登录',
        '403': '拒绝访问',
        '404': '请求错误，未找到该资源',
        '405': '请求方法未允许',
        '408': '请求超时',
        '500': '服务器端出错',
        '501': '网络未实现',
        '502': '网络错误',
        '503': '服务不可用',
        '504': '网络超时',
        '505': 'http版本不支持该请求'
    };
    if (errStatus) {
        ElMessage({
            showClose: true,
            message: networkErrMap[errStatus] ?? `其他连接错误 --${errStatus}`,
            type: 'error'
        });
        return;
    }
    ElMessage({
        showClose: true,
        message: '无法连接到服务器',
        type: 'error'
    });
};

export const handleAuthError = (errno: string): boolean => {
    const authErrMap: any = {
        '10031': '登录失效，需要重新登录', // token 失效
        '10032': '您太久没登录，请重新登录~', // token 过期
        '10033': '账户未绑定角色，请联系管理员绑定角色',
        '10034': '该用户未注册，请联系管理员注册用户',
        '10035': 'code 无法获取对应第三方平台用户',
        '10036': '该账户未关联员工，请联系管理员做关联',
        '10037': '账号已无效',
        '10038': '账号未找到'
    };
    if (authErrMap.hasOwnProperty(errno)) {
        ElMessage({
            showClose: true,
            message: authErrMap[errno],
            type: 'error'
        });
        // 授权错误，登出账户
        // logout();
        return false;
    }
    return true;
};

export const handleGeneralError = (errno: string, errmsg: string): boolean => {
    if (errno !== '0') {
        ElMessage({
            showClose: true,
            message: errmsg,
            type: 'error'
        });
        return false;
    }
    return true;
};

// generateReqKey ：用于根据当前请求的信息，生成请求 Key；
export function generateReqKey(config: AxiosRequestConfig) {
    // 响应的时候，response.config 中的data 是一个JSON字符串，所以需要转换一下
    if (config && config.data && isJsonStr(config.data)) {
        config.data = JSON.parse(config.data);
    }
    const { method, url, params, data } = config; // 请求方式，参数，请求地址，
    return [method, url, qs.stringify(params), qs.stringify(data)].join('&'); // 拼接
}

// 判断一个字符串是否为JSON字符串
export const isJsonStr = (str: any) => {
    if (typeof str == 'string') {
        try {
            const obj = JSON.parse(str);
            return !!(typeof obj == 'object' && obj);
        } catch (e) {
            console.log('error：' + str + '!!!' + e);
            return false;
        }
    }
};
