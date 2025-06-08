const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPassthroughCopy({ "./../node_modules/template/dist/style.css": "style.css" });
    eleventyConfig.addPassthroughCopy({ "./../node_modules/template/src/fonts/*.ttf": "/fonts/" });

    return {
        dir: {
            input: "blogs",
            includes: "./../_includes",
        }
    }
};