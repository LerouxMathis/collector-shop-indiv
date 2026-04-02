#!/bin/bash
set -e

echo "[PHASE 3] Déploiement de l'Infrastructure Core & Sécurité..."

# 1. Génération des secrets
./infra/kubernetes/secrets/generate-secrets.sh

# 2. Création de la ConfigMap pour le Realm Keycloak
kubectl create configmap keycloak-realm-config \
  --from-file=realm.json=infra/kubernetes/keycloak/realm-export.json \
  --namespace collector-app \
  --dry-run=client -o yaml | kubectl apply -f -

# 3. Déploiement de Keycloak
kubectl apply -f infra/kubernetes/keycloak/keycloak-deployment.yaml

# 4. Déploiement du routage (Ingress)
kubectl apply -f infra/kubernetes/traefik/ingress.yaml
kubectl wait --for=condition=available --timeout=300s deployment/keycloak -n collector-app

echo "Phase 3 terminée."