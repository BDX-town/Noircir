#!/bin/sh
: "${SERVER:=http://localhost:8080}"
: "${NOIRCIR_FOLDER:=/noircir}"
: "${NGINX_FOLDER:=/usr/share/nginx/html}"
: "${BLOGS_FOLDER:=blogs}"
: "${WWW_USER:=noircir}"
: "${WWW_GROUP:=www-data}"

cd $NOIRCIR_FOLDER && yarn run cms
cp -r $NOIRCIR_FOLDER/cms/dist/* $NGINX_FOLDER

nginx
su $WWW_USER
echo '{"layout": "article.11ty.js" }' > $NGINX_FOLDER/$BLOGS_FOLDER/blogs.json
cd $NOIRCIR_FOLDER
yarn start