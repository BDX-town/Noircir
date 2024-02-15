#!/bin/bash
: "${AUTH_FILE:=/var/www/.auth.allow}"
: "${NOIRCIR_FOLDER:=/noircir}"
: "${NGINX_FOLDER:=/var/www/html}"
: "${BLOGS_FOLDER:=blogs}"
: "${WWW_USER:=noircir}"
: "${WWW_GROUP:=www-data}"

su $WWW_USER
echo '{"layout": "article.11ty.js", "lang": "fr-FR" }' > $NGINX_FOLDER/$BLOGS_FOLDER/blogs.json
cd $NOIRCIR_FOLDER
npx yarn start