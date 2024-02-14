#!/bin/bash
set -euo pipefail

# path must be the same that auth_basic_user_file in nginx.conf
: "${AUTH_FILE:=/var/www/.auth.allow}"
: "${NGINX_FOLDER:=/var/www/html}"
# path must be the same that root in nginx.conf + a blogs folder
: "${BLOGS_FOLDER:=blogs}"
: "${RESSOURCES_FOLDER:=ressources}"
: "${WWW_USER:=www-data}"
: "${WWW_GROUP:=www-data}"


# source 
# https://starbeamrainbowlabs.com/blog/article.php?article=posts%2F237-WebDav-Nginx-Setup.html

gum style --foreground 212 "create_user.sh: Add a new user/blog to Noircir"

USERNAME=$(gum input --placeholder "Username")

if test -z "$USERNAME" 
then
    echo "You must provide a non-empty username"
    exit 1
fi

if test -d "$BLOGS_FOLDER/$USERNAME"
then
    echo "Username '$USERNAME' is already taken"
    exit 1
fi

PASSWORD=$(openssl passwd -apr1)

if test -z "$PASSWORD" 
then
      exit 1
fi

mkdir -p "$NGINX_FOLDER/$BLOGS_FOLDER/$USERNAME/$RESSOURCES_FOLDER"
echo '{ "blogName": "blog name", "blogDescription": "blog description", "blogCover": null }' > "$NGINX_FOLDER/$BLOGS_FOLDER/$USERNAME/$USERNAME.json"
echo "$USERNAME:$PASSWORD" >> $AUTH_FILE
chown -R "$WWW_USER:$WWW_GROUP" "$NGINX_FOLDER/$BLOGS_FOLDER"