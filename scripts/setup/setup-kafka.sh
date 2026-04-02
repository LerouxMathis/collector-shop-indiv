#!/bin/bash
set -e

echo "[PHASE 2] Démarrage du déploiement Kafka via Strimzi..."

# 1. Création du namespace dédié (Isolation Sécurité)
kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f -

# 2. Ajout du repo Helm officiel de Strimzi
helm repo add strimzi https://strimzi.io/charts/
helm repo update

# 3. Installation de l'opérateur Strimzi (Zéro config manuelle)
helm upgrade --install strimzi-kafka strimzi/strimzi-kafka-operator \
  --namespace kafka \
  --version 0.40.0 \
  --wait

# 4. Déploiement du cluster et du topic
kubectl apply -f infra/kubernetes/kafka/kafka-cluster.yaml
kubectl wait kafka/collector-cluster --for=condition=Ready --timeout=300s -n kafka
kubectl apply -f infra/kubernetes/kafka/kafka-topic.yaml

echo "Déploiement Kafka terminé avec succès !"