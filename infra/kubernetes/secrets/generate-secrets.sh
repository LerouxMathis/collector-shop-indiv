#!/bin/bash
set -e

echo "Génération des Secrets Kubernetes (Non versionnés)..."

# Création du namespace commun pour l'application s'il n'existe pas
kubectl create namespace collector-app --dry-run=client -o yaml | kubectl apply -f -

# Secret pour l'administrateur Keycloak
kubectl create secret generic keycloak-admin-secret \
  --from-literal=admin-user=admin \
  --from-literal=admin-password=SuperSecureAdmin99! \
  --namespace collector-app \
  --dry-run=client -o yaml | kubectl apply -f -

# Secret pour la base de données PostgreSQL du microservice Catalog (Phase 4)
kubectl create secret generic postgres-secret \
  --from-literal=db-user=collector_db_user \
  --from-literal=db-password=CatalogDbSecret2024! \
  --namespace collector-app \
  --dry-run=client -o yaml | kubectl apply -f -

echo "✅ Secrets générés et injectés dans le cluster K8s avec succès."