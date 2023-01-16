import {
    defineConfig
    // loadEnv
} from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import DefineOptions from 'unplugin-vue-define-options/vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend'; // 引入插件
import * as path from 'path';

// https://vitejs.dev/config/
// export default ({ mode }) => {
//     const { VITE_PORT, VITE_BASE_URL } = loadEnv(mode, process.cwd());
//         return defineConfig({base: VITE_BASE_URL)}
// };

export default defineConfig({
    resolve: {
        //设置别名
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
        }),
        DefineOptions(),
        vueSetupExtend()
    ],
    server: {
        host: '0.0.0.0',
        port: 8080, //启动端口
        hmr: {
            host: 'localhost',
            port: 8080
        },
        // 服务启动时是否自动打开浏览器
        open: true,
        // 允许跨域
        cors: true,
        // 是否开启 https
        https: false,
        // 设置代理
        proxy: {
            '/api': {
                target: 'http://101.35.109.105:3006', //网易云测试
                // target: 'http://10.0.9.62:8080', //代理地址，这里设置的地址会代替axios中设置的baseURL
                // target: 'your https address',
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, '')
            }
        }
    },
    build: {
        // 设置最终构建的浏览器兼容目标
        target: 'es2015',
        // 构建后是否生成 source map 文件
        sourcemap: false,
        //  chunk 大小警告的限制（以 kbs 为单位）
        chunkSizeWarningLimit: 2000,
        // 启用/禁用 gzip 压缩大小报告
        reportCompressedSize: false
    }
});
