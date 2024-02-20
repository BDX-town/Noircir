
const glob = require('glob');
const fs = require('fs');
const path = require('path');

module.exports = function() {
    const blogs = glob.globSync('./**/blogs/*/*.json');
    const articles = glob.globSync('./**/blogs/*/*.md');
    const blogData = blogs.map((p) => ({
        ...JSON.parse(fs.readFileSync(p, { encoding: "utf-8"})),
        username: path.dirname(path.relative(__dirname, p)),
        _a: articles.length,
    }));
    return {
        layout: "article.11ty.js",
        lang: "fr-FR",
        blogs: blogData,
    }
}