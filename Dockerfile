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

# Copie du script d'entrée
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
