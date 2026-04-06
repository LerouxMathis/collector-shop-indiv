#!/bin/bash
set -e

./infra/kubernetes/secrets/generate-secrets.sh

kubectl create configmap keycloak-realm-config \
  --from-file=realm.json=infra/kubernetes/keycloak/realm-export.json \
  --namespace collector-app \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl apply -f infra/kubernetes/keycloak/keycloak-deployment.yaml

kubectl apply -f infra/kubernetes/traefik/ingress.yaml
kubectl wait --for=condition=available --timeout=300s deployment/keycloak -n collector-app
