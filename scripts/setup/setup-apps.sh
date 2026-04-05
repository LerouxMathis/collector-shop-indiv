#!/bin/bash
set -e

# --- COULEURS ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[PHASE 4] Déploiement des Bases de données et des Applications...${NC}"

# 1. Lancement de PostgreSQL (Dépendance critique)
# On s'assure que la base est là avant de lancer le reste
echo "Déploiement de PostgreSQL..."
kubectl apply -f infra/kubernetes/postgres/postgres.yaml

echo "Attente du démarrage de la base de données (Postgres)..."
kubectl wait --for=condition=available --timeout=300s deployment/postgres -n collector-app

# 2. Lancement groupé des Applications (Backend + Frontend + Ingress)
# Ton fichier apps-deployment.yaml contient les 3 services et l'Ingress
echo -e "${BLUE}Déploiement de la stack applicative (Catalog, Notification, Front)...${NC}"
kubectl apply -f k8s/apps-deployment.yaml

# 3. Vérification finale
echo -e "${GREEN}------------------------------------------------------------${NC}"
echo -e "${GREEN}Toute l'application Collector.shop est en cours de déploiement !${NC}"
echo -e "${GREEN}------------------------------------------------------------${NC}"
echo "Vérifie l'état des pods avec : kubectl get pods -n collector-app"
echo "Une fois que tout est 'Running', lance : minikube tunnel"