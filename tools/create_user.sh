#!/bin/bash
set -euo pipefail

# path must be the same that auth_basic_user_file in nginx.conf
: "${AUTH_FILE:=/var/www/.auth.allow}"
# path must be the same that root in nginx.conf + a blogs folder
: "${BLOGS_FOLDER:=/var/www/html/blogs}"
: "${RESSOURCES_FOLDER:=ressources}"

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

mkdir -p "$BLOGS_FOLDER/$USERNAME/$RESSOURCES_FOLDER"
echo "$USERNAME's BLOG" >> "$BLOGS_FOLDER/$USERNAME/index.md"
echo "$USERNAME:$PASSWORD" >> $AUTH_FILE