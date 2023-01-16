import { ElMessage } from 'element-plus';

export default function (app: any) {
    app.directive('copy', {
        mounted(el: HTMLElement, binding: any) {
            el.onclick = () => {
                const { value } = binding;
                const copyDom = document.querySelector(`${value}`) as HTMLElement;
                //获取值
                let innerTxt = '';
                if (!copyDom.innerText) {
                    innerTxt = (copyDom as HTMLInputElement).value;
                } else {
                    innerTxt = copyDom.innerText;
                }
                //创建input
                const input = document.createElement('input');
                document.body.appendChild(input);
                input.setAttribute('value', innerTxt);
                input.select();
                if (document.execCommand('copy')) {
                    document.execCommand('copy');
                    ElMessage({
                        message: '复制成功',
                        type: 'success'
                    });
                }
                document.body.removeChild(input);
            };
        }
    });
}
