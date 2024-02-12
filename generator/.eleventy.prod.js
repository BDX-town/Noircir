const common = require('./.eleventy.common.js');

module.exports = function(eleventyConfig) {
    return {
      ...common(eleventyConfig),
      dir: {
        input: "/var/www/html/blogs/",
        output: "/var/www/html/",
        includes: "../../../../noircir/generator/_includes"
      }
    }
  };





















