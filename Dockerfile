FROM alpine:3.20

# Please set this var env at startup as it is mandatory
ENV SERVER localhost

# noircir repo: where to fetch updates
ENV NOIRCIR_RELEASE=https://api.github.com/repos/BDX-town/Noircir/tags
# noircir folder: where you saved noircir files
ENV NOIRCIR_FOLDER="/noircir"
# nginx root: all noircir data will be saved there, blogs and generated content
ENV NGINX_FOLDER=/usr/share/nginx/html
# 11ty base path: all blogs data will be saved there. Will be under NGINX_FOLDER
ENV BLOGS_FOLDER=blogs
# blog's ressources: each blog has it's own ressources folder, where all media will be uploaded. Will be under NGINX_FOLDER/BLOGS_FOLDER/username
ENV RESSOURCES_FOLDER=ressources
# must match nginx user 
ENV WWW_USER=noircir
# must match nginx group
ENV WWW_GROUP=www-data

# install noircir 
COPY . $NOIRCIR_FOLDER 

# install deps
RUN apk add gettext gum nginx nginx-mod-http-lua nginx-mod-http-dav-ext openssl nodejs-current npm jq curl \
    && corepack enable \
    && mkdir -p $NGINX_FOLDER \
    && mkdir -p /tools && cp $NOIRCIR_FOLDER/tools/* /tools
RUN cd $NOIRCIR_FOLDER && yarn workspaces focus @bdxtown/canaille cms template && yarn run build 
RUN cd $NOIRCIR_FOLDER && rm -rf */node_modules/* && rm -rf node_modules/*
RUN cd $NOIRCIR_FOLDER && yarn workspaces focus generator 
RUN cp -r $NOIRCIR_FOLDER/cms/dist/* $NGINX_FOLDER


RUN adduser -D -u 1001 -h /home/$WWW_USER -G $WWW_GROUP $WWW_USER\
    && mkdir -p $NGINX_FOLDER/$BLOGS_FOLDER \
    && chown -R $WWW_USER:$WWW_GROUP $NGINX_FOLDER \
    && envsubst '$NGINX_FOLDER,$BLOGS_FOLDER' < $NOIRCIR_FOLDER/nginx.conf > /tmp/nginx.conf && mv /tmp/nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 8080

STOPSIGNAL SIGQUIT

CMD ["/tools/startup.sh"]