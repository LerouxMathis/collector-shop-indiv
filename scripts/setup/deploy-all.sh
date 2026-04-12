#!/bin/bash
set -e

eval $(minikube docker-env)

docker build -t collector-catalog:latest ./services/catalog-service
docker build -t collector-notification:latest ./services/notification-service
docker build -t collector-front:latest ./frontend/collector-app

./infra/kubernetes/secrets/generate-secrets.sh

./scripts/setup/setup-kafka.sh

./scripts/setup/setup-infra-security.sh

./scripts/setup/setup-apps.sh

minikube addons enable ingress

echo "OK"