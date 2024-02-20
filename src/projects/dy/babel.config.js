module.exports = {
    presets: [
        [
            "@vue/app",
            {
                useBuiltIns: "entry",
                polyfills: ["es6.promise", "es6.symbol"],
            },
        ],
        [
            "@babel/preset-env",
            {
                modules: false,
                useBuiltIns: "entry",
                corejs: 2,
            },
        ],
    ],
};
