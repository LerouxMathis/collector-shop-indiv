#!/bin/bash

echo "[TEST] Tests Kafka"
echo "Taper des messages ici (Producteur) et vérifie qu'ils apparaissent de l'autre côté !"
echo "COMMANDE CONSOMMATEUR :"
echo "kubectl -n kafka run kafka-consumer -ti --image=quay.io/strimzi/kafka:0.40.0-kafka-3.7.0 --rm=true --restart=Never -- bin/kafka-console-consumer.sh --bootstrap-server collector-cluster-kafka-bootstrap:9092 --topic article-cree --from-beginning"


kubectl -n kafka run kafka-producer -ti --image=quay.io/strimzi/kafka:0.40.0-kafka-3.7.0 --rm=true --restart=Never -- bin/kafka-console-producer.sh --bootstrap-server collector-cluster-kafka-bootstrap:9092 --topic article-cree