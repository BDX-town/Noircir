#!/bin/sh
: "${NOIRCIR_FOLDER:=/noircir}"
: "${NGINX_FOLDER:=/usr/share/nginx/html}"
: "${NOIRCIR_RELEASE:=https://api.github.com/repos/BDX-town/Noircir/tags}"

cd $NOIRCIR_FOLDER
rm -rf ./*
curl -sL $NOIRCIR_RELEASE \
  | jq -r '.[0].zipball_url' \
  | xargs -I {} curl -sL {} -o /tmp/latest.zip
unzip /tmp/latest.zip -d $NOIRCIR_FOLDER
mv */* ./
cp $NOIRCIR_FOLDER/tools/* /tools
yarn workspaces focus cms template
yarn run build 
rm -rf */node_modules/* && rm -rf node_modules/*
yarn workspaces focus generator 
cp -r $NOIRCIR_FOLDER/cms/dist/* $NGINX_FOLDER
echo "You can restart the system to apply update"