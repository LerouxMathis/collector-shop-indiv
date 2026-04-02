#!/bin/bash

echo "[PONT RÉSEAU] Connexion de l'environnement local au cluster K8s..."

# Fermer les anciens port-forwards s'ils existent
pkill -f "kubectl port-forward" || true

# 1. Exposer PostgreSQL (Port 5432)
kubectl port-forward svc/postgres 5432:5432 -n collector-app > /dev/null 2>&1 &

# 2. Exposer Kafka (Port 9092)
kubectl port-forward svc/collector-cluster-kafka-bootstrap 9092:9092 -n kafka > /dev/null 2>&1 &

# 3. Exposer Keycloak en direct (Port 8080)
kubectl port-forward svc/keycloak-service 8080:8080 -n collector-app > /dev/null 2>&1 &

echo "TERMINAL 1 (Backend Catalog) :"
echo "cd services/catalog-service && ./mvnw spring-boot:run"
echo ""
echo "TERMINAL 2 (Backend Notification) :"
echo "cd services/notification-service && ./mvnw spring-boot:run"
echo ""
echo "TERMINAL 3 (Frontend React) :"
echo "cd frontend/collector-app && npm run dev"
echo "---------------------------------------------------------"