import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import './styles/reset.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
//引入指令
const directives = import.meta.globEager('./directive/*.ts');
// 创建vue实例
const app = createApp(App);
//注册指令
for (const item in directives) {
    directives[item].default(app);
}
//图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
//piana
app.use(store);
//路由
app.use(router);
//element
app.use(ElementPlus);
// 挂载实例
app.mount('#app');
