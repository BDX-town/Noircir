module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("{,!(_site)/**/}ressources/*.png");
    eleventyConfig.addPassthroughCopy("{,!(_site)/**/}ressources/*.jpe?g");
    eleventyConfig.addPassthroughCopy("{,!(_site)/**/}ressources/*.gif");
    eleventyConfig.addPassthroughCopy("{,!(_site)/**/}ressources/*.webp");
  };