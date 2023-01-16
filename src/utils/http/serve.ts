import http from '@/utils/http/http';

export interface Result<T = any> {
    code: number;
    message: string;
    data: T;
}
type Fn = (data: Result) => unknown;

interface IAnyObj {
    [index: string]: unknown;
}

export const Get = <T>(url: string, params: IAnyObj = {}, clearFn?: Fn): Promise<[any, Result<T> | undefined]> =>
    new Promise((resolve) => {
        http.get(url, { params })
            .then((result) => {
                let res: Result<T>;
                if (clearFn !== undefined) {
                    res = clearFn(result.data) as unknown as Result<T>;
                } else {
                    res = result.data as Result<T>;
                }
                resolve([null, res as Result<T>]);
            })
            .catch((err) => {
                resolve([err, undefined]);
            });
    });

export const Post = <T>(url: string, data: IAnyObj, params: IAnyObj = {}): Promise<[any, Result<T> | undefined]> => {
    return new Promise((resolve) => {
        http.post(url, data, { params })
            .then((result) => {
                resolve([null, result.data as Result<T>]);
            })
            .catch((err) => {
                resolve([err, undefined]);
            });
    });
};
