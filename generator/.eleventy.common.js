module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "./../node_modules/template/dist/style.css": "style.css" });
};