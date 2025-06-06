FROM nginx:stable-alpine

# Installation de envsubst
RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html

# Nettoyage du répertoire par défaut
RUN rm -rf ./*

# Copie du build local (généré par npm run build)
COPY dist ./

# Copie de la config nginx et substitution des variables d'environnement
COPY nginx.conf /etc/nginx/templates/default.conf.template
RUN envsubst '${VITE_APP_API_ENDPOINT_URL} ${VITE_APP_FOOTBALL_API_KEY}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
