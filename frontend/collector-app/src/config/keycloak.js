import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080/auth', // Modifié ici
  realm: 'collector-realm',
  clientId: 'collector-frontend'
};

const keycloak = new Keycloak(keycloakConfig);
export default keycloak;