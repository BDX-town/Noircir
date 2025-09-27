const path = require('path')
const fs = require('fs')
const debounce = require('debounce')
const { escapeForHtmlAttr } = require('./../misc/utils')

async function generate(renderFile, data) {
  const blogPath = path.dirname(path.dirname(data.page.outputPath));
  // we only keep articles from current blog
  const res = await renderFile(__filename, { collections: { articles: data.collections.articles.filter((a) => a.page.outputPath.startsWith(blogPath)) } });
  fs.writeFileSync(path.join(blogPath, "index.html"), res);
}

class Index {
  data() {
    return {
      templateEngineOverride: "11ty.js, md",
    }
  }

  render(data) {
    const articles = data.collections.articles.map((props) => ({
      title: props.data.title,
      description: props.data.description,
      coverUrl: props.data.cover,
      updatedAt: new Date(props.data.updatedAt),
      url: props.data.page.url
    }))

    const blog = {
      title: data.collections.articles[0].data.blogName,
      coverUrl: data.collections.articles[0].data.blogCover,
      description: data.collections.articles[0].data.blogDescription
    }

    const r = `
           <!DOCTYPE html>
            <html>
                <head>
                    <title>${blog.title}</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>
                    <blog-index blog='${escapeForHtmlAttr(JSON.stringify(blog))}' articles='${escapeForHtmlAttr(JSON.stringify(articles))}'>
                    </blog-index>
                </body>
            </html>
        `;

    return r;
  }
}

Index.generate = debounce(generate, 500);

module.exports = Index;