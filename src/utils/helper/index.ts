/**
 * @description 获取显示数据
 * @param dictionaries
 * @return {String} delimiter 回显数据的分割符
 * @example
 *
 *   const getDisplayData = getBasicData()
 *
 *   getDisplayData('ad_target')
 *
 *   [
 *     { value: '1', label: '注册' },
 *     { value: '2', label: '下载' },
 *     { value: '3', label: '关注' }
 *   ]
 *
 *   getDisplayData('ad_target', '2')  // '下载'
 *   getDisplayData('ad_target', '2, 3')  // '下载、关注'
 *   getDisplayData('ad_target', ['2', '3'])  // '下载、关注'
 */
export const getBasicData = (dictionaries = 'basicData') => {
    const basicData = JSON.parse(localStorage.getItem(dictionaries) as string);
    return function (type: any, ids = '', delimiter = '、') {
        const result = basicData[type];
        if (ids && ids.length) {
            return result
                .filter((item: any) => ids.includes(item.id))
                .map((item: any) => item.name)
                .join(delimiter);
        } else {
            return result;
        }
    };
};

/**
 * 扁平化树结构
 *
 * @param {Array} source 源数据
 * @param {String} branch 树杈字段名称
 * @param {Boolean} isChildren 是否包含子树数据，默认不包含
 * @return {Array} list 目标数据
 * @example
 *
 *   flatTree(data)
 *   flatTree(data, 'children', true)
 */
export const flatTree = (source: Array<any>, branch = 'children', isChildren = false): Array<any> => {
    const list = [];
    let item: any = {};
    while ((item = source.shift())) {
        const { [branch]: children, ...rest } = item;
        list.push(isChildren ? item : rest);
        if (children?.length) {
            source = [...children, ...source];
        }
    }
    return list;
};

/**
 * @description 列表分组，一维数组转二维数组
 * @param {Array} list 源数据
 * @param {Number} num 分组基数
 * @return {Array} 目标数据
 * @example
 *
 *   group([1, 2, 3, 4, 5, 6, 7, 8], 2)  // [[1, 2], [3, 4], [5, 6], [7, 8]]
 *
 *   group([1, 2, 3, 4, 5, 6, 7, 8], 3)  // [[1, 2, 3], [4, 5, 6], [7, 8]]
 */
export const group = (list: Array<any>, num: number) => {
    return Array.from({ length: Math.ceil(list.length / num) }, (_, i) => list.slice(i * num, (i + 1) * num));
};

/**
 * @description 列表归档，一维数组转二维数组
 * @param {Array} list 源数据
 * @param {String} key 归档维度
 * @return {Array} 目标数据
 * @example
 *
 *   const source = [
 *     { "date": "1月", "name": "跳舞" },
 *     { "date": "1月", "name": "钢琴" },
 *     { "date": "2月", "name": "游泳" },
 *   ]
 *
 *   archive(source, 'date')
 *
 *   [
 *     [
 *       { "date": "1月", "name": "跳舞" },
 *       { "date": "1月", "name": "钢琴" },
 *     ],
 *     [
 *       { "date": "2月", "name": "游泳" },
 *     ]
 *   ]
 */
export const archive = (list: Array<any>, key: string) => {
    const values = [...new Set(list.map((item) => item[key]))];
    return values.reduce((sets, value) => (sets.push(list.filter((item) => item[key] === value)), sets), []);
};

/**
 * @description 列表归档并分组，一维数组转二维数组
 * @param {Array} list 源数据
 * @param {String} key 归档维度
 * @param {String} groupName 组名称
 * @return {Array} 目标数据
 * @example
 *
 *   const source = [
 *     { "year": "2020", "month": 1, "startDate": "2020-01-01", "endDate": "2020-01-31" },
 *     { "year": "2020", "month": 2, "startDate": "2020-02-01", "endDate": "2020-02-29" },
 *     { "year": "2021", "month": 1, "startDate": "2021-01-01", "endDate": "2021-01-31" },
 *     { "year": "2021", "month": 2, "startDate": "2021-02-01", "endDate": "2021-02-28" },
 *   ]
 *
 *   subgroup(source, 'year', 'options')
 *
 *   [
 *     {
 *       "year": "2020",
 *       "options": [
 *         { "year": "2020", "month": 1, "startDate": "2020-01-01", "endDate": "2020-01-31" },
 *         { "year": "2020", "month": 2, "startDate": "2020-02-01", "endDate": "2020-02-29" },
 *       ]
 *     },
 *     {
 *       "year": "2021",
 *       "options": [
 *         { "year": "2021", "month": 1, "startDate": "2021-01-01", "endDate": "2021-01-31" },
 *         { "year": "2021", "month": 2, "startDate": "2021-02-01", "endDate": "2021-02-28" },
 *       ]
 *     }
 *   ]
 */
export const subgroup = (list: Array<any>, key: string, groupName = 'options') => {
    const hash = new Map();
    list.forEach((item) => {
        const value = item[key];
        if (hash.has(value)) {
            hash.get(value)[groupName].push(item);
        } else {
            hash.set(value, { [key]: value, [groupName]: [item] });
        }
    });
    return [...hash.values()];
};
/**
 *校验下载资源的地址是否有效通过 XMLHttpRequest 创建 同步 的 HEAD 请求，
 * 只获取响应头而不需要获取响应体的方式校验请求地址是否有效
 * @param {url} url
 * */

export const corsEnabled = (url: string) => {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    try {
        xhr.send();
    } catch (e) {}
    return xhr.status >= 200 && xhr.status <= 299;
};
/**
 * 跟踪下载文件的进度
 * 第一步：通过响应头 header 中的 Content-Length 和 Content-Disposition 分别获取完整的响应长度和文件名称
 * 第二步：通过流读取器 stream.getReader() 循环读取并计算当前下载进度，直到响应体 body 下载完成
 * 第三步：返回所有块字节的 Uint8Array 数据 chunks 和文件名称
 * */
export const download = async (url: string, callback: any) => {
    const {
        ok,
        status,
        statusText,
        headers,
        body: stream
    } = await fetch(url, {
        mode: 'cors',
        credentials: 'same-origin'
    });
    if (!ok) return Promise.reject({ status, statusText });

    const reader = stream?.getReader() as any;
    const totalSize = headers.get('Content-Length') as string;
    const filename = decodeURI((headers.get('Content-Disposition') as any).split('filename=')[1]) as string;

    let receiveSize = 0;
    const chunks = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receiveSize += value.length;
        callback(Number(((receiveSize / (Number(totalSize) as number)) * 100).toFixed(2)));
    }
    return Promise.resolve({ filedata: chunks, filename });
};
/**
 * 实现二进制流文件下载
 *第一步：通过 a 标签的 download 属性设置下载文件的名称
 *第二步：通过 a 标签的 href 属性设置下载文件的地址，使用 URL.createObjectURL() 方法生成一个在内存中指向流文件的引用路径作为文件的下载地址
 *第三步：创建可以 同步 执行的自定义事件，通过 dispatchEvent 进行事件的触发，让事件用于非 DOM 代码中
 *
 * */
export const saveAs = (data: any, filename: string) => {
    const blob = data instanceof Blob ? data : new Blob(data);
    const node = document.createElement('a');
    Object.assign(node, {
        download: filename,
        href: URL.createObjectURL(blob)
    });
    try {
        node.dispatchEvent(new MouseEvent('click'));
    } catch (e) {
        const evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
        node.dispatchEvent(evt);
    }
    URL.revokeObjectURL(node.href);
};
