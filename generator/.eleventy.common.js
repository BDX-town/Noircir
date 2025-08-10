import { EleventyRenderPlugin } from '@11ty/eleventy'

export default function(eleventyConfig) {
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