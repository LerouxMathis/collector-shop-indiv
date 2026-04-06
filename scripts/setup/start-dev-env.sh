#!/bin/bash

pkill -f "kubectl port-forward" || true

kubectl port-forward svc/postgres 5432:5432 -n collector-app > /dev/null 2>&1 &

kubectl port-forward svc/collector-cluster-kafka-bootstrap 9092:9092 -n kafka > /dev/null 2>&1 &

kubectl port-forward svc/keycloak-service 8080:8080 -n collector-app > /dev/null 2>&1 &