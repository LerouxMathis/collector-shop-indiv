#!/bin/bash
set -e

echo "🚀 [PHASE 3] Déploiement de l'Infrastructure Core & Sécurité..."

# 1. Génération des secrets
./infra/kubernetes/secrets/generate-secrets.sh

# 2. Création de la ConfigMap pour le Realm Keycloak
echo "📦 Injection de la configuration Keycloak (Realm)..."
kubectl create configmap keycloak-realm-config \
  --from-file=realm.json=infra/kubernetes/keycloak/realm-export.json \
  --namespace collector-app \
  --dry-run=client -o yaml | kubectl apply -f -

# 3. Déploiement de Keycloak
echo "🛡️ Déploiement de Keycloak IAM..."
kubectl apply -f infra/kubernetes/keycloak/keycloak-deployment.yaml

# 4. Déploiement du routage (Ingress)
echo "🚦 Configuration du routage réseau..."
kubectl apply -f infra/kubernetes/traefik/ingress.yaml

echo "⏳ Attente de la disponibilité de Keycloak (peut prendre 1-2 minutes)..."
kubectl wait --for=condition=available --timeout=300s deployment/keycloak -n collector-app

echo "✅ Phase 3 terminée. Infrastructure Core déployée."
echo "👉 N'oublie pas d'ajouter '127.0.0.1 collector.local' dans ton fichier /etc/hosts (Linux/Mac) ou C:\Windows\System32\drivers\etc\hosts (Windows) !"