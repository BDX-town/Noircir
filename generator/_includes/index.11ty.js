const path = require('path')
const { escapeForHtmlAttr } = require('./../misc/utils')

class Index {
  data() {
    return {
      templateEngineOverride: "11ty.js, md",
    }
  }

  render(data) {
    const blogPath = path.dirname(path.dirname(data.page.outputPath));

    const articles = data.collections.all
    .filter((a) => a.page.outputPath.startsWith(blogPath))
    .map((props) => ({
      title: props.data.title,
      description: props.data.description,
      coverUrl: props.data.cover,
      updatedAt: new Date(props.data.updatedAt),
      url: props.data.page.url
    }))

    const blog = {
      title: data.blogName,
      coverUrl: data.blogCover,
      description: data.blogDescription
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

module.exports = Index;