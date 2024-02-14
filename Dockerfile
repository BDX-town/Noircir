FROM node:21.6.1

# auth_basic_user_file: contains login informations for authorized webdav users. You can create new users with /tools/create_user.sh
ENV AUTH_FILE=/var/www/.auth.allow
# noircir folder: where you saved noircir files
ENV NOIRCIR_FOLDER="/noircir"
# nginx root: all noircir data will be saved there, blogs and generated content
ENV NGINX_FOLDER=/var/www/html
# 11ty base path: all blogs data will be saved there. Will be under NGINX_FOLDER
ENV BLOGS_FOLDER=blogs
# blog's ressources: each blog has it's own ressources folder, where all media will be uploaded. Will be under NGINX_FOLDER/BLOGS_FOLDER/username
ENV RESSOURCES_FOLDER=ressources
# must match nginx user 
ENV WWW_USER=www-data
# must match nginx group
ENV WWW_GROUP=www-data

# add gum source
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://repo.charm.sh/apt/gpg.key | gpg --dearmor -o /etc/apt/keyrings/charm.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" | tee /etc/apt/sources.list.d/charm.list

# install deps
RUN apt-get update -yq \
    && apt-get install -y gettext git gum nginx nginx-extras libnginx-mod-http-dav-ext libnginx-mod-http-auth-pam openssl \
    && corepack enable \
    && apt-get clean -y

# configure webdav
RUN  chown -R $WWW_USER:$WWW_GROUP $NGINX_FOLDER && touch $AUTH_FILE
COPY nginx.conf /tmp/nginx.conf
RUN envsubst < /tmp/nginx.conf > /tmp/default.conf && mv /tmp/default.conf /etc/nginx/sites-available/default

# install noircir 
RUN git clone https://github.com/BDX-town/Noircir.git $NOIRCIR_FOLDER 
RUN mkdir -p /tools && cp $NOIRCIR_FOLDER/tools/* /tools
RUN cd $NOIRCIR_FOLDER && npx yarn && npx yarn run build && cd /
RUN cp -r $NOIRCIR_FOLDER/cms/dist/* $NGINX_FOLDER

EXPOSE 8080

STOPSIGNAL SIGQUIT

CMD ["/tools/startup.sh"]