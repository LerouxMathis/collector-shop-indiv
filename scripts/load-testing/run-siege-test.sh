#!/bin/bash
set -e
echo "2000 requêtes totales, 100 utilisateurs simultanés"

TARGET_URL="http://host.docker.internal:8081/api/articles"
docker run --rm alpine sh -c "apk add --no-cache apache2-utils > /dev/null && ab -n 2000 -c 100 ${TARGET_URL}/"