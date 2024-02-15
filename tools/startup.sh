#!/bin/bash
: "${AUTH_FILE:=/var/www/.auth.allow}"
: "${NOIRCIR_FOLDER:=/noircir}"
: "${NGINX_FOLDER:=/var/www/html}"
: "${BLOGS_FOLDER:=blogs}"
: "${WWW_USER:=www-data}"
: "${WWW_GROUP:=www-data}"

mkdir -p $NGINX_FOLDER/$BLOGS_FOLDER
touch $AUTH_FILE
chown -R $WWW_USER:$WWW_GROUP $NGINX_FOLDER
envsubst '$NGINX_FOLDER,$BLOGS_FOLDER,$AUTH_FILE' < $NOIRCIR_FOLDER/nginx.conf > /tmp/nginx.conf && mv /tmp/nginx.conf /etc/nginx/sites-available/noircir
service nginx start
su $WWW_USER
echo '{"layout": "article.11ty.js", "lang": "fr-FR" }' > $NGINX_FOLDER/$BLOGS_FOLDER/blogs.json
cd $NOIRCIR_FOLDER
npx yarn start