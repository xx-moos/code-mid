import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path, { resolve } from "path";
import compression from "vite-plugin-compression"; //gzip/br 压缩
import AutoImport from "unplugin-auto-import/vite"; // 自动引入
import Components from "unplugin-vue-components/vite"; // 组件自动引入
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { VantResolver } from "unplugin-vue-components/resolvers";
import chalk from "chalk"; // console高亮
import legacyPlugin from "@vitejs/plugin-legacy";
import esbuild from "rollup-plugin-esbuild";

// 引入多页面配置文件
const project = require("./scripts/multiPages.json");
// 获取npm run dev后缀 配置的环境变量
const npm_config_page = process.env.npm_config_pro || "";
// 命令行报错提示
const errorLog = (error) => console.log(chalk.red(`${error}`));

//获取指定的单页面入口
const getEnterPages = () => {
    if (!npm_config_page) {
        errorLog("请输入 npm run dev --pro=项目名称  格式指定项目名称！");
    }
    const filterArr = project.filter(
        (item) => item.chunk.toLowerCase() == npm_config_page.toLowerCase()
    );
    if (!filterArr.length) {
        errorLog("⚠️ 警告 -- 不存在此项目，请检查项目名称！");
    }

    return {
        [npm_config_page]: path.resolve(__dirname, `src/projects/${npm_config_page}/index.html`),
    };
};

// 打包提示
const buildEndFn = (name) => {
    console.log(
        `🚀🚀🚀 ${chalk.green.bold("项目构建")} ➡️   ${chalk.white.bgGreen.bold(` ${name} `)} 🇨🇳`
    );
};

export default defineConfig({
    root: path.resolve(__dirname, `./src/projects/${npm_config_page}`),
    base: "/",
    plugins: [
        vue(),
        AutoImport({
            // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
            imports: ["vue", "vue-router"],
            dts: path.resolve(__dirname, "./auto-import.d.ts"),
            eslintrc: {
                enabled: false, // 是否自动生成 eslint 规则，建议生成之后设置 false
                filepath: path.resolve(__dirname, "./.eslintrc-auto-import.json"), // 指定自动导入函数 eslint 规则的文件
                globalsPropValue: true,
            },
            resolvers: [
                IconsResolver({ prefix: "Icon" }), // 自动导入图标组件
                VantResolver(),
            ],
            // vueTemplate: true,
            // dts: true, // 配置文件生成位置(false:关闭自动生成)
            // dts: path.resolve(pathSrc, "types", "auto-imports.d.ts"), // 指定自动导入函数TS类型声明文件路径
        }),
        Components({
            resolvers: [
                IconsResolver({ enabledCollections: ["ep"] }), // 自动注册图标组件
                VantResolver(),
            ],
            dirs: ["src/**/components"], // 指定自定义组件位置(默认:src/components)
            // dts: true, // 配置文件位置(false:关闭自动生成)
            // dts: path.resolve(pathSrc, "types", "components.d.ts"), // 指定自动导入组件TS类型声明文件路径
        }),
        Icons({
            autoInstall: true,
        }),
        // gzip格式
        compression({
            threshold: 1024 * 500, // 体积大于 threshold 才会被压缩,单位 b
            ext: ".gz", // 压缩文件格式
            deleteOriginFile: false, // 是否删除源文件
        }),

        // 浏览器兼容问题配置
        legacyPlugin({
            targets: ["defaults", "not IE 11", "chrome>=60"],
            modernTargets: ["defaults", "not IE 11", "chrome>=60"],
            additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
            renderLegacyChunks: true,
            polyfills: [
                "es.promise",
                "es.promise.finally",
                "es/map",
                "es/set",
                "es.array.filter",
                "es.array.for-each",
                "es.array.flat-map",
                "es.object.define-properties",
                "es.object.define-property",
                "es.object.get-own-property-descriptor",
                "es.object.get-own-property-descriptors",
                "es.object.keys",
                "es.object.to-string",
                "web.dom-collections.for-each",
                "esnext.global-this",
                "esnext.string.match-all",
            ],
        }),
    ],
    resolve: {
        alias: {
            "@": path.join(__dirname, "./src"),
            "@projects": path.join(__dirname, "./src/projects"),
        },
    },
    server: {
        host: "localhost", // 指定服务器主机名
        port: 3000, // 指定服务器端口
        hmr: false, // 开启热更新
        open: false, // 在服务器启动时自动在浏览器中打开应用程序
        https: false, // 是否开启 https
    },
    build: {
        target: ["chrome60"],
        cssTarget: ["chrome60"],
        outDir: path.resolve(__dirname, `dist/${npm_config_page}`), // 指定输出路径
        assetsInlineLimit: 4096, //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求
        emptyOutDir: true, //Vite 会在构建时清空该目录
        terserOptions: {
            compress: {
                keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
                drop_console: true, // 生产环境去除 console
                drop_debugger: true, // 生产环境去除 debugger
            },
            format: {
                comments: false, // 删除注释
            },
        },
        rollupOptions: {
            //自定义底层的 Rollup 打包配置
            input: getEnterPages(),
            buildEnd: buildEndFn(npm_config_page),
            output: {
                assetFileNames: "[ext]/[name]-[hash].[ext]", //静态文件输出的文件夹名称
                chunkFileNames: "js/[name]-[hash].js", //chunk包输出的文件夹名称
                entryFileNames: "js/[name]-[hash].js", //入口文件输出的文件夹名称
                compact: true,
                manualChunks: (id) => {
                    if (id.includes("node_modules")) {
                        return id.toString().split("node_modules/")[1].split("/")[0].toString(); // 拆分多个vendors
                    }
                },
            },
        },
    },
});
