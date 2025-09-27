const { EleventyRenderPlugin } = require("@11ty/eleventy");
const litPlugin = require('@lit-labs/eleventy-plugin-lit');

module.exports = function(eleventyConfig) {
    eleventyConfig.addCollection("articles", function(collectionApi) {
        return collectionApi.getFilteredByGlob("./**/*.md");
    });

    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPassthroughCopy({ "../template/src/main.css": "style.css" });
    eleventyConfig.addPlugin(litPlugin, {
        mode: 'worker',
        componentModules: [
            '../template/dist/blog-article/index.js',
            '../template/dist/blog-index/index.js',
        ],
    });
    return {
        dir: {
            input: "blogs",
            includes: "./../_includes",
        }
    }
};