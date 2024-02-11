#!/bin/bash
: "${BLOGS_FOLDER:=/var/www/html/blogs}"

service nginx start
mkdir -p $BLOGS_FOLDER
echo '{"layout": "article.11ty.js"}' > $BLOGS_FOLDER/blogs.json
cd /noircir/generator
npx yarn run