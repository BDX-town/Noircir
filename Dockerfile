FROM debian:bookworm

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
ENV WWW_USER=noircir
# must match nginx group
ENV WWW_GROUP=www-data

RUN apt-get update \
    apt-get -y curl gnupg

# add gum source
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://repo.charm.sh/apt/gpg.key | gpg --dearmor -o /etc/apt/keyrings/charm.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" | tee /etc/apt/sources.list.d/charm.list

# add node source 
RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash -

# install deps
RUN apt-get update \
    && apt-get install -y nodejs gettext git gum nginx nginx-core libnginx-mod-http-lua libnginx-mod-http-dav-ext libnginx-mod-http-auth-pam openssl \
    && corepack enable \
    && apt-get clean -y

COPY nginx.service /lib/systemd/system/nginx.service 

# install noircir 
COPY . $NOIRCIR_FOLDER 
RUN mkdir -p /tools && cp $NOIRCIR_FOLDER/tools/* /tools
RUN cd $NOIRCIR_FOLDER && npx yarn && npx yarn run build && cd /
RUN cp -r $NOIRCIR_FOLDER/cms/dist/* $NGINX_FOLDER

RUN useradd -u 1001 --shell /bin/bash -d /home/$WWW_USER $WWW_USER && usermod -a -G $WWW_GROUP $WWW_USER \
    && mkdir -p $NGINX_FOLDER/$BLOGS_FOLDER \
    && touch $AUTH_FILE \
    && chown -R $WWW_USER:$WWW_GROUP $NGINX_FOLDER \
    && envsubst '$NGINX_FOLDER,$BLOGS_FOLDER,$AUTH_FILE' < $NOIRCIR_FOLDER/nginx.conf > /tmp/nginx.conf && mv /tmp/nginx.conf /etc/nginx/sites-available/noircir && ln -s /etc/nginx/sites-available/noircir /etc/nginx/sites-enabled/noircir

EXPOSE 8080

STOPSIGNAL SIGQUIT

CMD service nginx start && /tools/startup.sh