import common from './.eleventy.common.js'
import path from 'path'

const {
  NGINX_FOLDER,
  BLOGS_FOLDER,
  NOIRCIR_FOLDER
} = process.env;

const includesPath = path.relative(path.join(NGINX_FOLDER, BLOGS_FOLDER), NOIRCIR_FOLDER);

export default function(eleventyConfig) {
    return {
      ...common(eleventyConfig),
      dir: {
        input: path.join(NGINX_FOLDER, BLOGS_FOLDER),
        output: NGINX_FOLDER,
        includes: path.join(includesPath, "/generator/_includes"),
      }
    }
  };





















