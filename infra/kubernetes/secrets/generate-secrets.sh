#!/bin/bash
set -e

echo "Génération des Secrets Kubernetes (Non versionnés)..."

if [ -f .env ]; then
    echo "Chargement des variables depuis le fichier .env..."
    export $(grep -v '^#' .env | sed 's/\r$//' | xargs)
else
    echo -e "${RED}Erreur : Fichier .env introuvable.${NC}"
    echo "Assurez-vous d'avoir un fichier .env à la racine du projet."
    exit 1
fi

# --- VÉRIFICATION DES VARIABLES ---
REQUIRED_VARS=("KEYCLOAK_ADMIN_USER" "KEYCLOAK_ADMIN_PASSWORD" "DB_USER" "DB_PASSWORD")

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}Erreur : La variable $var n'est pas définie dans le .env${NC}"
        exit 1
    fi
done

# Création du namespace commun pour l'application s'il n'existe pas
kubectl create namespace collector-app --dry-run=client -o yaml | kubectl apply -f -

# Secret pour l'administrateur Keycloak
kubectl create secret generic keycloak-admin-secret \
  --from-literal=admin-user="$KEYCLOAK_ADMIN_USER" \
  --from-literal=admin-password="$KEYCLOAK_ADMIN_PASSWORD" \
  --namespace collector-app \
  --dry-run=client -o yaml | kubectl apply -f -

# Secret pour la base de données PostgreSQL du microservice Catalog (Phase 4)
kubectl create secret generic postgres-secret \
  --from-literal=db-user="$DB_USER" \
  --from-literal=db-password="$DB_PASSWORD" \
  --namespace collector-app \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Secrets générés et injectés dans le cluster K8s avec succès."