#!/bin/sh
: "${NOIRCIR_FOLDER:=/noircir}"
: "${NGINX_FOLDER:=/usr/share/nginx/html}"
: "${NOIRCIR_RELEASE:=https://github.com/BDX-town/Noircir/releases/latest/download/noircir.zip}"

cd $NOIRCIR_FOLDER
rm -rf ./*
wget $NOIRCIR_RELEASE
unzip noircir.zip
cp $NOIRCIR_FOLDER/tools/* /tools
yarn workspaces focus cms template
yarn run build 
rm -rf */node_modules/* && rm -rf node_modules/*
yarn workspaces focus generator 
cp -r $NOIRCIR_FOLDER/cms/dist/* $NGINX_FOLDER
echo "You can restart the system to apply update"