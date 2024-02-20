module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "./../node_modules/template/dist/style.css": "style.css" });
    eleventyConfig.addPassthroughCopy({ "./../node_modules/template/src/fonts/*.woff": "/fonts/" });
    eleventyConfig.addPassthroughCopy({ "./../node_modules/template/src/fonts/*.woff2": "/fonts/" });

    return {
        dir: {
            input: "blogs",
            includes: "./../_includes",
        }
    }
};