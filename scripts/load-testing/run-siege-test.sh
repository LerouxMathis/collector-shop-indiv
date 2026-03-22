#!/bin/bash
set -e

echo "🚀 [PHASE 6] Lancement du test de charge (Stress Test) ISO 25010..."
echo "📊 Outil : Apache Bench (ab) via Alpine Linux"
echo "🎯 Cible : Microservice Catalog (API Articles)"
echo "⚙️  Configuration : 2000 requêtes totales, 100 utilisateurs simultanés."
echo "------------------------------------------------------------------"

# host.docker.internal est le pont réseau magique de Docker Desktop vers ton Windows
TARGET_URL="http://host.docker.internal:8081/api/articles"

echo "👉 Tir de charge en cours depuis Docker vers ton poste local..."
echo "⏳ Patiente quelques secondes, l'outil bombarde ton API..."

# On installe apache2-utils (qui contient 'ab') et on lance l'assaut en une ligne.
# Note : on rajoute un '/' à la fin de l'URL car Apache Bench est très strict sur la syntaxe.
docker run --rm alpine sh -c "apk add --no-cache apache2-utils > /dev/null && ab -n 2000 -c 100 ${TARGET_URL}/"

echo "------------------------------------------------------------------"
echo "✅ Test de charge terminé !"
echo "👉 Regarde la ligne 'Requests per second' et 'Time per request' pour ton dossier ISO 25010."