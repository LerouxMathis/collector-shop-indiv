#!/bin/bash
set -e

if [ -f .env ]; then
    export $(grep -v '^#' .env | sed 's/\r$//' | xargs)
else
    echo -e "${RED}Erreur : Fichier .env introuvable.${NC}"
    exit 1
fi

REQUIRED_VARS=("KEYCLOAK_ADMIN_USER" "KEYCLOAK_ADMIN_PASSWORD" "DB_USER" "DB_PASSWORD")

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}Erreur : La variable $var n'est pas définie dans le .env${NC}"
        exit 1
    fi
done

kubectl create namespace collector-app --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic keycloak-admin-secret \
  --from-literal=admin-user="$KEYCLOAK_ADMIN_USER" \
  --from-literal=admin-password="$KEYCLOAK_ADMIN_PASSWORD" \
  --namespace collector-app \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic postgres-secret \
  --from-literal=db-user="$DB_USER" \
  --from-literal=db-password="$DB_PASSWORD" \
  --namespace collector-app \
  --dry-run=client -o yaml | kubectl apply -f -
