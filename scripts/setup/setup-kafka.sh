#!/bin/bash
set -e

kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f -

helm repo add strimzi https://strimzi.io/charts/
helm repo update

helm upgrade --install strimzi-kafka strimzi/strimzi-kafka-operator \
  --namespace kafka \
  --version 0.40.0 \
  --wait

kubectl apply -f infra/kubernetes/kafka/kafka-cluster.yaml
kubectl wait kafka/collector-cluster --for=condition=Ready --timeout=300s -n kafka
kubectl apply -f infra/kubernetes/kafka/kafka-topic.yaml