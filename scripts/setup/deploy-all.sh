#!/bin/bash
set -e

# --- COULEURS ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}>>> DÉMARRAGE DU DÉPLOIEMENT COMPLET : COLLECTOR.SHOP <<<${NC}"

# ÉTAPE 0 : Configurer l'environnement Docker pour Minikube
echo "Connexion au démon Docker de Minikube..."
eval $(minikube docker-env)

# ÉTAPE 1 : Build des images (indispensable pour ErrImageNeverPull)
echo -e "${BLUE}Construction des images Docker locales...${NC}"
docker build -t collector-catalog:latest ./services/catalog-service
docker build -t collector-notification:latest ./services/notification-service
docker build -t collector-front:v2 ./frontend/collector-app

# ÉTAPE 2 : Secrets & Namespaces
echo -e "${BLUE}Phase 1 : Secrets...${NC}"
./infra/kubernetes/secrets/generate-secrets.sh

# ÉTAPE 3 : Kafka
echo -e "${BLUE}Phase 2 : Kafka...${NC}"
./scripts/setup/setup-kafka.sh

# ÉTAPE 4 : Keycloak & Infra
echo -e "${BLUE}Phase 3 : Keycloak & Sécurité...${NC}"
./scripts/setup/setup-infra-security.sh

# ÉTAPE 5 : Apps & Postgres
echo -e "${BLUE}Phase 4 : Applications...${NC}"
./scripts/setup/setup-apps.sh

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}   TOUT LE PROJET EST DÉPLOYÉ AVEC SUCCÈS !       ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo "Suivi : watch kubectl get pods -A"