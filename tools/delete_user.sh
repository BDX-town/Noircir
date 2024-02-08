#!/bin/bash
set -euo pipefail

# path must be the same that auth_basic_user_file in nginx.conf
: "${AUTH_FILE:=/var/www/.auth.allow}"
# path must be the same that root in nginx.conf + a blogs folder
: "${BLOGS_FOLDER:=/var/www/html/blogs}"

# source 
# https://starbeamrainbowlabs.com/blog/article.php?article=posts%2F237-WebDav-Nginx-Setup.html

gum style --foreground 212 "delete_user.sh: delete access and blog from Noircir"

USERNAME=$(gum input --placeholder "Username")

if test -z "$USERNAME" 
then
    echo "You must provide a non-empty username"
    exit 1
fi

if [ ! -d "$BLOGS_FOLDER/$USERNAME" ]
then
    echo "User '$USERNAME' does not exist"
    exit 1
fi

gum confirm "Are you sure you want to remove $USERNAME blog and access to Noircir ?" || exit 0

rm -r "$BLOGS_FOLDER/$USERNAME"
LINE_NUMBER=$(grep -n $USERNAME $AUTH_FILE | cut -d : -f 1)
sed -i ''"$LINE_NUMBER"'d' $AUTH_FILE