FROM node:21.6.1

# install deps
RUN apt update -yq \
    && apt install git \
    && apt install nginx nginx-extras libnginx-mod-http-dav-ext libnginx-mod-http-auth-pam \
    && corepack enable \
    && apt clean -y

# configure webdav
RUN  chown -R www-data:www-data /var/www/html && touch /var/www/.auth.allow
COPY nginx.conf /etc/nginx/sites-available/default

# install noircir 
RUN git clone git@github.com:BDX-town/Noirsir.git noirsir && npx yarn && cd noircir/cms && npx yarn build && cp dist/* /var/www/html

CMD service nginx start