FROM nginx:stable-alpine

# Installation de envsubst
RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html

# Nettoyage du répertoire par défaut
RUN rm -rf ./*

# Copie du build local (généré par npm run build)
COPY dist ./

# Copie de la config nginx
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Création du script de démarrage
RUN echo '#!/bin/sh\n\
envsubst "\${VITE_APP_API_ENDPOINT_URL} \${VITE_APP_FOOTBALL_API_KEY}" < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf\n\
nginx -g "daemon off;"' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
