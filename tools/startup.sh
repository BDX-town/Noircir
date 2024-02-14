#!/bin/bash
: "${NOIRCIR_FOLDER:=/noircir}"
: "${NGINX_FOLDER:=/var/www/html}"
: "${BLOGS_FOLDER:=blogs}"

service nginx start
mkdir -p $NGINX_FOLDER/$BLOGS_FOLDER
echo '{"layout": "article.11ty.js", "lang": "fr-FR" }' > $NGINX_FOLDER/$BLOGS_FOLDER/blogs.json
cd $NOIRCIR_FOLDER
npx yarn start