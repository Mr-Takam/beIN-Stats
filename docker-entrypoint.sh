#!/bin/sh
set -e

envsubst "${VITE_APP_API_ENDPOINT_URL} ${VITE_APP_FOOTBALL_API_KEY}" < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;' 