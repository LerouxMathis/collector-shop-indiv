#!/bin/bash
set -e

kubectl apply -f infra/kubernetes/postgres/postgres.yaml

kubectl wait --for=condition=available --timeout=300s deployment/postgres -n collector-app

kubectl apply -f k8s/apps-deployment.yaml