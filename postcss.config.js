module.exports = (ctx) => ({
    plugins: {
        "postcss-import": {},
        "postcss-cssnext": { browsers: "last 1 version" },
        "postcss-inline-base64": { useCache: false },
        "cssnano": { safe: true, autoprefixer: false }
    },
    map: ctx.options.map
})