FROM node:21.6.1

# install deps
RUN apt-get update -yq \
    && apt-get install -y git \
    && apt-get install -y nginx nginx-extras libnginx-mod-http-dav-ext libnginx-mod-http-auth-pam \
    && corepack enable \
    && apt-get clean -y

# configure webdav
RUN  chown -R www-data:www-data /var/www/html && touch /var/www/.auth.allow
COPY nginx.conf /etc/nginx/sites-available/default

# install noircir 
RUN git clone https://github.com/BDX-town/Noircir.git noircir && cd noircir/cms && npx yarn && npx yarn build && cp -r dist/* /var/www/html

EXPOSE 8080

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]