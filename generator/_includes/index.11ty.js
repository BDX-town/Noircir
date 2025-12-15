const path = require('path')
const { escapeForHtmlAttr } = require('./../misc/utils')

class Index {
  data() {
    return {
      templateEngineOverride: "11ty.js, md",
    }
  }

  render(data) {
    const blogPath = data.page.url;

    const articles = data.collections.all
    .filter((a) => a.page.url.startsWith(blogPath))
    .map((props) => ({
      draft: props.data.draft,
      title: props.data.title,
      description: props.data.description,
      coverUrl: props.data.cover,
      updatedAt: new Date(props.data.updatedAt),
      createdAt: new Date(props.data.createdAt),
      url: props.data.page.url
    }))
    .filter((a) => !a.draft)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

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
                    <link rel="icon" href=${blog.coverUrl}>
                    <link rel="stylesheet" href="/style.css">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta property="og:title" content=${blog.title}>
                    <meta property="og:description" content=${blog.description}>
                    <meta property="og:image" content=${blog.coverUrl}>
                    <meta property="og:type" content="website">
                    <meta name="twitter:title" content=${blog.title}>
                    <meta name="twitter:description" content=${blog.description}>
                    <meta name="twitter:image" content=${blog.coverUrl}>
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