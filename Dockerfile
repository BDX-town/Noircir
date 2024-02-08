FROM node:21.6.1

# install deps
RUN apt-get update -yq \
    && apt-get install -y git \
    && apt-get install -y nginx nginx-extras libnginx-mod-http-dav-ext libnginx-mod-http-auth-pam openssl \
    && corepack enable \
    && apt-get clean -y

# install gum
RUN sudo mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://repo.charm.sh/apt/gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/charm.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" | sudo tee /etc/apt/sources.list.d/charm.list \
    && sudo apt update && sudo apt install gum

# configure webdav
RUN  chown -R www-data:www-data /var/www/html && touch /var/www/.auth.allow
COPY nginx.conf /etc/nginx/sites-available/default

# install noircir 
RUN git clone https://github.com/BDX-town/Noircir.git noircir 
RUN cp noircir/tools/* .
RUN cd noircir/cms && npx yarn && npx yarn build && cp -r dist/* /var/www/html && cd .. 

EXPOSE 8080

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]