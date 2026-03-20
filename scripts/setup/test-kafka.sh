#!/bin/bash

echo "🧪 [TEST SANDBOX] Démarrage des tests Kafka..."
echo "Ouvre un AUTRE terminal et exécute la commande du Consommateur."
echo "Ensuite, tape des messages ici (Producteur) et vérifie qu'ils apparaissent de l'autre côté !"
echo "------------------------------------------------------"
echo "👉 COMMANDE CONSOMMATEUR (à copier/coller dans un autre terminal) :"
echo "kubectl -n kafka run kafka-consumer -ti --image=quay.io/strimzi/kafka:0.40.0-kafka-3.7.0 --rm=true --restart=Never -- bin/kafka-console-consumer.sh --bootstrap-server collector-cluster-kafka-bootstrap:9092 --topic article-cree --from-beginning"
echo "------------------------------------------------------"
echo "Lancement du Producteur interactif... Tape tes messages puis fais Ctrl+C pour quitter."

kubectl -n kafka run kafka-producer -ti --image=quay.io/strimzi/kafka:0.40.0-kafka-3.7.0 --rm=true --restart=Never -- bin/kafka-console-producer.sh --bootstrap-server collector-cluster-kafka-bootstrap:9092 --topic article-cree